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

            const strategy = uiStore.uiState.taskApplicationStrategy;
            if (strategy.mode === 'auto') {
                applyChanges(taskId, true);
            } else if (strategy.mode === 'delayed') {
                task.applyAt = Date.now() + strategy.delaySeconds * 1000;
                setTimeout(() => {
                    const taskAfterDelay = tasks.value.find(t => t.id === taskId);
                    if (taskAfterDelay?.status === 'completed') {
                        applyChanges(taskId, true);
                    }
                }, strategy.delaySeconds * 1000);
            }
        }
    };

    const applyChanges = (taskId: string, isAutoApplied: boolean = false) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (!task || (task.status !== 'completed' && task.status !== 'completed_with_conflict')) return;

        const { node: targetItem } = editorStore.findItemById(task.targetItemId);
        if (!targetItem) {
            task.status = 'failed';
            task.error = '目标文档不存在。';
            return;
        }

        // --- 核心Bug修复：版本冲突检查 ---
        const currentVersion = (targetItem as any)._lastModified || 0;
        if (task.sourceItemVersion < currentVersion) {
            task.status = 'completed_with_conflict';
            task.error = `内容已被修改，AI结果无法自动应用。请手动处理。`;
            console.warn(`AI Task Conflict: Task for "${task.sourceItemTitle}" cannot be applied automatically. Task version: ${task.sourceItemVersion}, Current version: ${currentVersion}`);
            return;
        }
        // --- 核心Bug修复结束 ---

        if (task.type === '分析' || task.type === '剧情生成') {
            const finalTitle = task.title.split(' - ')[0];
            const newContent = formatContentForEditor(finalTitle, task.generatedContent);
            editorStore.updateItemContentById(task.targetItemId, newContent, true); // Pass true to update version
            const result = derivedContentStore.findItemById(task.targetItemId);
            if (result) result.title = finalTitle;
        } else {
            editorStore.appendContentToItem(task.targetItemId, task.generatedContent, isAutoApplied);
        }

        task.status = 'applied';
    };

    const retryTask = (taskId: string) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (task && (task.status === 'failed' || task.status === 'completed_with_conflict')) {
            // Re-create the task to get fresh content and a new version stamp
            startTask(task.type, task.sourceItemId, task.finalPrompt);
            // Remove the old, failed task
            tasks.value = tasks.value.filter(t => t.id !== taskId);
        }
    };

    const clearCompletedTasks = () => {
        tasks.value = tasks.value.filter(t => !['applied', 'failed', 'completed_with_conflict'].includes(t.status));
    };

    const clearAllTasks = () => {
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
        updateTaskStatus,
        updateTaskError,
        appendGeneratedContent,
        completeTask
    };
});