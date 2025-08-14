// 文件: src/novel/editor/stores/ai/aiTaskStore.ts

import { defineStore } from 'pinia';
import { ref, computed, nextTick } from 'vue';
import { useEditorStore } from '../editorStore';
import { useUIStore } from '../uiStore';
import { useDerivedContentStore } from '../derivedContentStore';
import * as AITaskFactory from '@/novel/editor/services/ai/AITaskFactory';
import { processQueue } from '@/novel/editor/services/ai/AITaskExecutionService';
import type { AITask, Volume, AITaskType, AITaskStatus } from '@novel/editor/types';

export const useAITaskStore = defineStore('aiTask', () => {
    const tasks = ref<AITask[]>([]);
    const previewTaskId = ref<string | null>(null);

    const editorStore = useEditorStore();
    const uiStore = useUIStore();
    const derivedContentStore = useDerivedContentStore();

    const activeTasksCount = computed(() => {
        return tasks.value.filter(t => t.status === 'processing' || t.status === 'pending').length;
    });

    const previewTask = computed((): AITask | null => {
        if (!previewTaskId.value) return null;
        return tasks.value.find(t => t.id === previewTaskId.value) ?? null;
    });

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

    const setPreviewTask = (taskId: string | null) => {
        previewTaskId.value = taskId;

        if (taskId) {
            const task = tasks.value.find(t => t.id === taskId);
            if (task) {
                // 当设置预览任务时，自动打开对应的源文件标签页
                editorStore.openTab(task.sourceItemId);
            }
        }
    };

    const startTask = async (taskType: AITaskType, sourceItemId: string, finalPrompt?: string) => {
        const newTask = await AITaskFactory.createTask(taskType, sourceItemId, finalPrompt);
        if (!newTask) return;

        tasks.value.unshift(newTask);

        if (uiStore.uiState.autoOpenAIPanel && editorStore.activePaneId) {
            editorStore.ensureAIPanelIsOpen(editorStore.activePaneId);
        }

        // 如果当前没有正在预览的任务，则自动将新任务设为预览对象
        if (!previewTaskId.value) {
            setPreviewTask(newTask.id);
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
        if (!task || !['completed', 'completed_with_conflict'].includes(task.status)) return;

        const { node: sourceItem } = editorStore.findItemById(task.targetItemId);
        if (!sourceItem) {
            task.status = 'failed';
            task.error = '目标文档不存在。';
            return;
        }

        // 核心修复：仅在自动应用时才进行版本冲突检查
        if (isAutoApplied) {
            const currentVersion = (sourceItem as any)._lastModified || 0;
            if (task.sourceItemVersion < currentVersion) {
                task.status = 'completed_with_conflict';
                task.error = `内容已被修改，AI结果无法自动应用。请手动处理。`;
                console.warn(`AI Task Conflict: Task for "${task.sourceItemTitle}" cannot be applied automatically. Task version: ${task.sourceItemVersion}, Current version: ${currentVersion}`);
                return;
            }
        }

        if (task.type === '分析' || task.type === '剧情生成') {
            const newItem = derivedContentStore.createAndAddDerivedItem(
                sourceItem,
                task.type,
                task.generatedContent
            );
            if (newItem) {
                editorStore.openTab(newItem.id);
            }
        } else {
            editorStore.appendContentToItem(task.targetItemId, task.generatedContent, isAutoApplied);
        }

        task.status = 'applied';
        task.error = undefined; // 清除可能存在的冲突错误信息

        // 如果应用的是当前正在预览的任务，则清空预览
        if (previewTaskId.value === taskId) {
            setPreviewTask(null);
        }
    };

    const retryTask = (taskId: string) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (task && (task.status === 'failed' || task.status === 'completed_with_conflict')) {
            // 从任务列表中移除旧的失败/冲突任务
            const taskIndex = tasks.value.findIndex(t => t.id === taskId);
            if (taskIndex > -1) {
                tasks.value.splice(taskIndex, 1);
            }
            // 重新创建并开始一个新任务
            startTask(task.type, task.sourceItemId, task.finalPrompt);
        }
    };

    const clearCompletedTasks = () => {
        tasks.value = tasks.value.filter(t => !['applied', 'failed', 'completed_with_conflict'].includes(t.status));
    };

    const clearAllTasks = () => {
        tasks.value = [];
        setPreviewTask(null);
    };

    return {
        tasks,
        activeTasksCount,
        previewTask,
        previewTaskId,
        startTask,
        startBatchTaskForVolume,
        applyChanges,
        retryTask,
        clearCompletedTasks,
        clearAllTasks,
        updateTaskStatus,
        updateTaskError,
        appendGeneratedContent,
        completeTask,
        setPreviewTask
    };
});