import { defineStore } from 'pinia'
import { ref, nextTick, computed } from 'vue'
import { useEditorStore } from './editorStore'
import { useUIStore } from './uiStore'
import { useDerivedContentStore } from './derivedContentStore';
import type { AITask, Volume } from '@/novel/editor/types';
import { useContextBuilder } from '@/novel/editor/composables/useContextBuilder';
import { streamAITask } from '@/novel/editor/api/aiService';
const formatContentForEditor = (title: string, rawContent: string): string => {
    const body = rawContent.split('\n').filter(p => p.trim() !== '').map(p => <p>${p}</p>).join('');
    return <h1>${title}</h1>${body};
};
export const useAITaskStore = defineStore('aiTask', () => {
    const tasks = ref<AITask[]>([]);
    const editorStore = useEditorStore();
    const uiStore = useUIStore();
    const derivedContentStore = useDerivedContentStore();
    const { buildContextForTask } = useContextBuilder();

    const activeTasksCount = computed(() => {
        return tasks.value.filter(t => t.status === 'processing' || t.status === 'pending').length;
    });

    const _executeTaskAndStream = (taskId: string) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (!task) return;

        task.status = 'processing';
        task.generatedContent = '';

        const { node: targetItem } = editorStore.findItemById(task.targetItemId);
        if (!targetItem) {
            task.status = 'failed';
            task.error = '任务目标文档未找到，无法构建上下文。';
            nextTick(_processQueue);
            return;
        }

        let finalPrompt: string;

        if (task.prompt) {
            // 如果任务对象中已存在预构建的提示词，则直接使用
            finalPrompt = task.prompt;
        } else {
            // 否则（例如跳过预览直接执行），动态构建提示词
            const contextResult = buildContextForTask(task.type, targetItem);
            if (!contextResult || !contextResult.prompt) {
                task.status = 'failed';
                task.error = '上下文构建失败，无法生成最终提示词。';
                nextTick(_processQueue);
                return;
            }
            finalPrompt = contextResult.prompt;
        }

        // 调用API服务，传入最终的提示词
        streamAITask(finalPrompt, {
            onChunk: (chunk) => {
                const currentTask = tasks.value.find(t => t.id === taskId);
                if (currentTask && currentTask.status === 'processing') {
                    currentTask.generatedContent += chunk;
                }
            },
            onComplete: () => {
                const currentTask = tasks.value.find(t => t.id === taskId);
                if (currentTask && currentTask.status === 'processing') {
                    currentTask.status = 'completed';
                    if (task.type === '润色') {
                        const strategy = uiStore.uiState.taskApplicationStrategy;
                        switch (strategy.mode) {
                            case 'auto':
                                applyChanges(currentTask.id, true);
                                break;
                            case 'delayed':
                                setTimeout(() => {
                                    const taskAfterDelay = tasks.value.find(t => t.id === taskId);
                                    if (taskAfterDelay && taskAfterDelay.status === 'completed') {
                                        applyChanges(taskId, true);
                                    }
                                }, strategy.delaySeconds * 1000);
                                break;
                            case 'manual':
                                break;
                        }
                    }
                    _processQueue();
                }
            },
            onError: (error) => {
                const currentTask = tasks.value.find(t => t.id === taskId);
                if (currentTask && currentTask.status === 'processing') {
                    currentTask.status = 'failed';
                    currentTask.error = error;
                    _processQueue();
                }
            }
        });
    }

    const _processQueue = () => {
        const processingCount = tasks.value.filter(t => t.status === 'processing').length;
        if (processingCount > 0) return;
        const pendingTask = tasks.value.find(t => t.status === 'pending');
        if (pendingTask) _executeTaskAndStream(pendingTask.id);
    };

    const startTask = async (taskType: AITask['type'], sourceItemId: string, prebuiltPrompt?: string) => {
        const { node: sourceItem } = editorStore.findItemById(sourceItemId);
        if (!sourceItem || !('content' in sourceItem) || typeof sourceItem.content !== 'string') {
            console.error("AI Task Error: Source item not found or has no content.", sourceItemId);
            return;
        }

        let targetItemId: string;
        let taskTitle: string;

        if (taskType === '分析' || taskType === '剧情生成') {
            const newDerivedItem = derivedContentStore.createDerivedItem(sourceItemId, taskType);
            if (!newDerivedItem) {
                console.error("Failed to create derived item shell.");
                return;
            }
            targetItemId = newDerivedItem.id;
            taskTitle = newDerivedItem.title;

            await nextTick();
            editorStore.openTab(targetItemId);

        } else {
            targetItemId = sourceItemId;
            taskTitle = `${taskType}《${sourceItem.title}》`;
        }


        const newTask: AITask = {
            id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: taskTitle,
            type: taskType,
            targetItemId: targetItemId,
            status: 'pending',
            sourceContent: sourceItem.content,
            generatedContent: '',
            prompt: prebuiltPrompt, // 存储预构建的提示词
            createdAt: new Date(),
        };

        tasks.value.unshift(newTask);
        if (uiStore.uiState.autoOpenAIPanel && editorStore.activePaneId) {
            editorStore.ensureAIPanelIsOpen(editorStore.activePaneId);
        }
        nextTick(_processQueue);
    };

    const startBatchTaskForVolume = (taskType: AITask['type'], volume: Volume) => {
        if (!volume || !volume.chapters) return;
        volume.chapters.forEach(chapter => startTask(taskType, chapter.id));
    };

    const applyChanges = (taskId: string, isAutoApplied: boolean = false) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (!task || task.status !== 'completed') return;

        if (task.type === '分析' || task.type === '剧情生成') {
            const { node: targetNode } = editorStore.findItemById(task.targetItemId);
            if (targetNode) {
                const finalTitle = task.title.split(' - ');
                const newContent = formatContentForEditor(finalTitle, task.generatedContent);
                editorStore.updateItemContentById(task.targetItemId, newContent);
                const result = derivedContentStore.findItemById(task.targetItemId);
                if (result) result.title = finalTitle;
            }
        } else {
            editorStore.appendContentToItem(task.targetItemId, task.generatedContent, isAutoApplied);
        }

        task.status = 'applied';
    };

    const retryTask = (taskId: string) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (task && task.status === 'failed') {
            task.status = 'pending';
            task.error = undefined;
            task.generatedContent = '';
            nextTick(_processQueue);
        }
    };

    const clearCompletedTasks = () => {
        tasks.value = tasks.value.filter(t => t.status !== 'applied' && t.status !== 'failed');
    };

    const clearAllTasks = () => {
        tasks.value = [];
    };

    return {
        tasks, activeTasksCount, startTask, startBatchTaskForVolume, applyChanges, retryTask, clearCompletedTasks, clearAllTasks
    };
});