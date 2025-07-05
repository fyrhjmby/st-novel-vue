// 文件: src/novel/editor/stores/aiTaskStore.ts
import { defineStore } from 'pinia'
import { ref, nextTick } from 'vue'
import { useEditorStore } from './editorStore'
import type { AITask, AITaskStatus, Volume } from '@/novel/editor/types';
import { mockAIResponses } from '@/novel/editor/data';

export const useAITaskStore = defineStore('aiTask', () => {
    const tasks = ref<AITask[]>([]);

    const _simulateAIStream = (taskId: string) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (!task || task.status !== 'pending') return;

        const editorStore = useEditorStore();
        task.status = 'processing';
        task.generatedContent = '';

        // [修改] 从外部数据源获取模拟回复
        const mockResponseText = mockAIResponses[task.type];
        const words = mockResponseText.split('');
        let wordIndex = 0;
        const willFail = Math.random() < 0.1;

        const intervalId = setInterval(() => {
            if (wordIndex < words.length) {
                task.generatedContent += words[wordIndex];
                wordIndex++;
                if (willFail && wordIndex > words.length / 2) {
                    clearInterval(intervalId);
                    task.status = 'failed';
                    task.error = '生成超时，请检查网络后重试。';
                    return;
                }
            } else {
                clearInterval(intervalId);
                task.status = 'completed';
                if (!editorStore.uiState.needsPreview) {
                    editorStore.appendContentToItem(task.targetItemId, task.generatedContent, true);
                    task.status = 'applied';
                }
            }
        }, 30);
    }

    const _processQueue = () => {
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

    const clearAllTasks = () => {
        tasks.value = [];
    };

    return {
        tasks,
        startNewTask,
        startBatchTaskForVolume,
        clearAllTasks,
        applyChanges,
        retryTask,
    }
});