// 文件: src\novel\editor\stores\aiTaskStore.ts

import { defineStore } from 'pinia'
import { ref, nextTick, computed } from 'vue'
import { useEditorStore } from './editorStore'
import { useUIStore } from './uiStore'
import type { AITask, AITaskStatus, Volume } from '@/novel/editor/types';
import { mockAIResponses } from '@/novel/editor/data';

export const useAITaskStore = defineStore('aiTask', () => {
    const tasks = ref<AITask[]>([]);

    const activeTasksCount = computed(() => {
        return tasks.value.filter(t => t.status === 'processing' || t.status === 'pending').length;
    });

    const _simulateAIStream = (taskId: string) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (!task || task.status !== 'pending') return;

        const editorStore = useEditorStore();
        const uiStore = useUIStore();
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
                    return;
                }
            } else {
                clearInterval(intervalId);
                currentTask.status = 'completed';
                if (!uiStore.uiState.needsPreview) {
                    editorStore.appendContentToItem(currentTask.targetItemId, currentTask.generatedContent, true);
                    currentTask.status = 'applied';
                }
            }
        }, 30);
    }

    const _processQueue = () => {
        const processingCount = tasks.value.filter(t => t.status === 'processing').length;
        if (processingCount > 0) return;

        const pendingTask = tasks.value.find(t => t.status === 'pending');
        if (pendingTask) {
            _simulateAIStream(pendingTask.id);
        }
    };

    const _addTask = (taskType: '润色' | '续写' | '分析', targetItemId: string) => {
        const editorStore = useEditorStore();
        const { node: item } = editorStore.findItemById(targetItemId);

        if (!item || !('content' in item)) {
            console.error("无法启动AI任务：找不到目标文档或文档没有内容属性。", targetItemId);
            return null;
        }

        const newTask: AITask = {
            id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: `${taskType}《${item.title}》`,
            type: taskType,
            targetItemId: targetItemId,
            status: 'pending',
            originalContent: item.content || '',
            generatedContent: '',
            createdAt: new Date(),
        };

        tasks.value.unshift(newTask);
        return newTask;
    };

    const startNewTask = (taskType: '润色' | '续写' | '分析', targetItemId: string) => {
        const task = _addTask(taskType, targetItemId);
        if (task) {
            nextTick(_processQueue);
        }
    };

    const startBatchTaskForVolume = (taskType: '润色' | '续写' | '分析', volume: Volume) => {
        if (!volume || !volume.chapters) return;

        for (const chapter of volume.chapters) {
            _addTask(taskType, chapter.id);
        }
        nextTick(_processQueue);
    };

    const applyChanges = (taskId: string) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (task && task.status === 'completed') {
            const editorStore = useEditorStore();
            editorStore.appendContentToItem(task.targetItemId, task.generatedContent, false);
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
        tasks,
        activeTasksCount,
        startNewTask,
        startBatchTaskForVolume,
        applyChanges,
        retryTask,
        clearCompletedTasks,
        clearAllTasks,
    }
});