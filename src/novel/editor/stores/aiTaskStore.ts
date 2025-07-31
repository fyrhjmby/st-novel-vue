// 文件: src/novel/editor/stores/aiTaskStore.ts
import { defineStore } from 'pinia'
import { ref, nextTick, computed } from 'vue'
import { useEditorStore } from './editorStore'
import { useUIStore } from './uiStore'
import { useRelatedContentStore } from './relatedContentStore';
import type { AITask, Volume } from '@/novel/editor/types';
import { mockAIResponses } from '@/novel/editor/data';

const isReplaceTask = (type: AITask['type']) => {
    return type === '分析' || type === '剧情生成';
};

const formatContentForEditor = (rawContent: string): string => {
    return rawContent.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p}</p>`).join('');
};

export const useAITaskStore = defineStore('aiTask', () => {
    const tasks = ref<AITask[]>([]);
    const editorStore = useEditorStore();
    const uiStore = useUIStore();
    const relatedContentStore = useRelatedContentStore();

    const activeTasksCount = computed(() => {
        return tasks.value.filter(t => t.status === 'processing' || t.status === 'pending').length;
    });

    const _simulateAIStream = (taskId: string) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (!task || task.status !== 'pending') return;

        task.status = 'processing';
        task.generatedContent = '';
        const mockResponseText = mockAIResponses[task.type];
        const words = mockResponseText.split('');
        let wordIndex = 0;
        const willFail = Math.random() < 0.1;

        const intervalId = setInterval(() => {
            const currentTask = tasks.value.find(t => t.id === taskId);
            if (!currentTask || currentTask.status !== 'processing') {
                clearInterval(intervalId);
                return;
            }

            if (wordIndex < words.length) {
                currentTask.generatedContent += words[wordIndex];
                wordIndex++;
                if (willFail && wordIndex > words.length / 2) {
                    clearInterval(intervalId);
                    currentTask.status = 'failed';
                    currentTask.error = '生成超时，请检查网络后重试。';
                    _processQueue();
                    return;
                }
            } else {
                clearInterval(intervalId);
                currentTask.status = 'completed';

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

                _processQueue();
            }
        }, 30);
    }

    const _processQueue = () => {
        const processingCount = tasks.value.filter(t => t.status === 'processing').length;
        if (processingCount > 0) return;
        const pendingTask = tasks.value.find(t => t.status === 'pending');
        if (pendingTask) _simulateAIStream(pendingTask.id);
    };

    const startTask = (taskType: AITask['type'], sourceItemId: string) => {
        const { node: sourceItem } = editorStore.findItemById(sourceItemId);
        if (!sourceItem || !('content' in sourceItem) || typeof sourceItem.content !== 'string') {
            console.error("AI Task Error: Source item not found or has no content.", sourceItemId);
            return;
        }

        const sourceContent = sourceItem.content;
        const baseTitle = sourceItem.title;
        let targetItemId = sourceItemId;

        if (isReplaceTask(taskType)) {
            const prefix = taskType === '分析' ? 'analysis' : 'plot';
            targetItemId = `${prefix}_${sourceItemId}`;
            relatedContentStore.ensureDerivedItemExists(targetItemId);
        }

        editorStore.openTab(targetItemId);

        const newTask: AITask = {
            id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: `${taskType}《${baseTitle}》`,
            type: taskType,
            targetItemId: targetItemId,
            status: 'pending',
            sourceContent: sourceContent,
            generatedContent: '',
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
        if (task && task.status === 'completed') {
            const { node: targetNode } = editorStore.findItemById(task.targetItemId);
            if (!targetNode) return;

            if (isReplaceTask(task.type)) {
                const newBody = formatContentForEditor(task.generatedContent);
                const newContent = `<h1>${targetNode.title}</h1>${newBody}`;
                editorStore.updateItemContentById(task.targetItemId, newContent);
            } else {
                editorStore.appendContentToItem(task.targetItemId, task.generatedContent, isAutoApplied);
            }
            task.status = 'applied';
        }
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