// src/novel/editor/stores/aiTaskStore.ts
import { defineStore } from 'pinia'
import { ref, nextTick, computed } from 'vue'
import { useEditorStore } from './editorStore'
import { useUIStore } from './uiStore'
import { useDerivedContentStore } from './derivedContentStore';
import type { AITask, Volume, AITaskType } from '@/novel/editor/types';
import { useContextBuilder } from '@/novel/editor/composables/useContextBuilder';
import { streamAITask } from '@/novel/editor/api/aiService';

const formatContentForEditor = (title: string, rawContent: string): string => {
    const body = rawContent.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p}</p>`).join('');
    return `<h1>${title}</h1>${body}`;
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

        if (!task.finalPrompt) {
            // **核心修正**: 直接将任务对象传给上下文构建器
            const contextResult = buildContextForTask(task);
            if (!contextResult || !contextResult.prompt) {
                task.status = 'failed';
                task.error = '上下文构建失败，无法生成最终提示词。';
                nextTick(_processQueue);
                return;
            }
            task.finalPrompt = contextResult.prompt;
        }

        const promptToUse = task.finalPrompt;

        streamAITask(promptToUse, {
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
                    if (currentTask.type === '润色' || currentTask.type === '续写') {
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
        const limit = uiStore.uiState.concurrentTaskLimit;
        const processingCount = tasks.value.filter(t => t.status === 'processing').length;

        if (processingCount >= limit) {
            return;
        }

        const canStartCount = limit - processingCount;
        const pendingTasks = tasks.value.filter(t => t.status === 'pending');

        const tasksToStart = pendingTasks.slice(0, canStartCount);

        for (const task of tasksToStart) {
            _executeTaskAndStream(task.id);
        }
    };

    const startTask = async (taskType: AITaskType, sourceItemId: string, finalPrompt?: string) => {
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
            sourceItemId: sourceItemId,
            targetItemId: targetItemId,
            sourceItemTitle: sourceItem.title, // **核心修正**: 添加标题快照
            sourceItemContent: sourceItem.content, // **核心修正**: 添加内容快照
            status: 'pending',
            generatedContent: '',
            finalPrompt: finalPrompt,
            createdAt: new Date(),
        };

        tasks.value.unshift(newTask);
        if (uiStore.uiState.autoOpenAIPanel && editorStore.activePaneId) {
            editorStore.ensureAIPanelIsOpen(editorStore.activePaneId);
        }
        nextTick(_processQueue);
    };

    const startBatchTaskForVolume = (taskType: AITaskType, volume: Volume) => {
        if (!volume || !volume.chapters) return;
        volume.chapters.forEach(chapter => {
            startTask(taskType, chapter.id, undefined);
        });
    };

    const applyChanges = (taskId: string, isAutoApplied: boolean = false) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (!task || task.status !== 'completed') return;

        if (task.type === '分析' || task.type === '剧情生成') {
            const { node: targetNode } = editorStore.findItemById(task.targetItemId);
            if (targetNode) {
                const finalTitle = task.title.split(' - ')[0];
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
            task.finalPrompt = undefined; // 清除旧的prompt，强制重新构建
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