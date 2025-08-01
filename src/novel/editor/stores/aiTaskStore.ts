// 文件: src/novel/editor/stores/aiTaskStore.ts

import { defineStore } from 'pinia'
import { ref, nextTick, computed } from 'vue'
import { useEditorStore } from './editorStore'
import { useUIStore } from './uiStore'
import { useDerivedContentStore } from './derivedContentStore';
import type { AITask, Volume } from '@/novel/editor/types';
import { mockAIResponses } from '@/novel/editor/data';

const formatContentForEditor = (title: string, rawContent: string): string => {
    const body = rawContent.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p}</p>`).join('');
    return `<h1>${title}</h1>${body}`;
};

export const useAITaskStore = defineStore('aiTask', () => {
    const tasks = ref<AITask[]>([]);
    const editorStore = useEditorStore();
    const uiStore = useUIStore();
    const derivedContentStore = useDerivedContentStore();

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
                // 流式更新只作用于任务自身的 generatedContent，用于AI预览面板
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

                // 自动应用策略只对“润色”这类直接修改任务有效
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
        }, 30);
    }

    const _processQueue = () => {
        const processingCount = tasks.value.filter(t => t.status === 'processing').length;
        if (processingCount > 0) return;
        const pendingTask = tasks.value.find(t => t.status === 'pending');
        if (pendingTask) _simulateAIStream(pendingTask.id);
    };

    const startTask = async (taskType: AITask['type'], sourceItemId: string) => {
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

            // 等待UI稳定
            await nextTick();

            // 打开新标签
            editorStore.openTab(targetItemId);

        } else { // 润色等直接修改任务
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
            // 对于派生任务，应用修改意味着将最终内容写入占位符文件
            const { node: targetNode } = editorStore.findItemById(task.targetItemId);
            if (targetNode) {
                // 从任务标题中移除时间戳，作为最终的文件标题
                const finalTitle = task.title.split(' - ')[0];
                const newContent = formatContentForEditor(finalTitle, task.generatedContent);
                editorStore.updateItemContentById(task.targetItemId, newContent);
                // 更新标题（如果需要）
                const result = derivedContentStore.findItemById(task.targetItemId);
                if (result) result.title = finalTitle;
            }
        } else {
            // 对于润色任务，追加内容
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