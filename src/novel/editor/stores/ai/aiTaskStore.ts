// src/novel/editor/stores/ai/aiTaskStore.ts
import { defineStore } from 'pinia';
import { ref, computed, nextTick } from 'vue';
import { useEditorStore } from '../editorStore';
import { useUIStore } from '../uiStore';
import { useDerivedContentStore } from '../derivedContentStore';
import * as AITaskFactory from '@/novel/editor/services/ai/AITaskFactory';
import { processQueue } from '@/novel/editor/services/ai/AITaskExecutionService';
import type { AITask, Volume, AITaskType, AITaskStatus } from '@novel/editor/types';

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

    // --- State Mutation Actions ---
    const updateTaskStatus = (taskId: string, status: AITaskStatus) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (task) {
            task.status = status;
        }
    };

    const updateTaskError = (taskId: string, error: string) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (task) {
            task.status = 'failed';
            task.error = error;
        }
    };

    const appendGeneratedContent = (taskId: string, chunk: string) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (task && task.status === 'processing') {
            task.generatedContent += chunk;
        }
    };

    // --- Complex Actions ---
    const startTask = async (taskType: AITaskType, sourceItemId: string, finalPrompt?: string) => {
        const newTask = await AITaskFactory.createTask(taskType, sourceItemId, finalPrompt);
        if (!newTask) return;

        // Open tab for derived content immediately
        if (newTask.type === '分析' || newTask.type === '剧情生成') {
            await nextTick();
            editorStore.openTab(newTask.targetItemId);
        }

        tasks.value.unshift(newTask);

        if (uiStore.uiState.autoOpenAIPanel && editorStore.activePaneId) {
            editorStore.ensureAIPanelIsOpen(editorStore.activePaneId);
        }
        nextTick(processQueue);
    };

    const startBatchTaskForVolume = (taskType: AITaskType, volume: Volume) => {
        if (!volume || !volume.chapters) return;
        volume.chapters.forEach(chapter => {
            startTask(taskType, chapter.id, undefined);
        });
    };

    const completeTask = (taskId: string) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (task && task.status === 'processing') {
            task.status = 'completed';

            // Handle auto-application logic
            if (task.type === '润色' || task.type === '续写') {
                const strategy = uiStore.uiState.taskApplicationStrategy;
                switch (strategy.mode) {
                    case 'auto':
                        applyChanges(taskId, true);
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
                        // Do nothing
                        break;
                }
            }
        }
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
            task.finalPrompt = undefined; // Force prompt rebuild
            nextTick(processQueue);
        }
    };

    const clearCompletedTasks = () => {
        tasks.value = tasks.value.filter(t => t.status !== 'applied' && t.status !== 'failed');
    };

    const clearAllTasks = () => {
        // Here we might need a way to signal cancellation to the execution service in a real scenario
        tasks.value = [];
    };

    return {
        tasks,
        activeTasksCount,
        startTask,
        startBatchTaskForVolume,
        applyChanges,
        retryTask,
        clearCompletedTasks,
        clearAllTasks,
        // Methods for execution service
        updateTaskStatus,
        updateTaskError,
        appendGeneratedContent,
        completeTask
    };
});