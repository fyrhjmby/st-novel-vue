import { defineStore } from 'pinia';
import { ref, computed, nextTick } from 'vue';
import { useDirectoryStore } from './directoryStore';
import { useRelatedContentStore } from './relatedContentStore';
import { useUIStore } from './uiStore';
import type { AITask, Volume, Chapter, RelatedTree } from '../types';
import { mockAIResponses } from '../data';

type ContentItem = Chapter | RelatedTree;

export const useAITaskStore = defineStore('novel-ai-task', () => {
    const tasks = ref<AITask[]>([]);
    const directoryStore = useDirectoryStore();
    const relatedContentStore = useRelatedContentStore();
    const uiStore = useUIStore();

    const activeTasksCount = computed(() => {
        return tasks.value.filter(t => t.status === 'processing' || t.status === 'pending').length;
    });

    const _findItemContent = (itemId: string): string => {
        const dirNode = directoryStore.findNodeById(itemId)?.node;
        if (dirNode && 'content' in dirNode) return dirNode.content || '';
        const relNode = relatedContentStore.findNodeById(itemId)?.node;
        if (relNode && 'content' in relNode) return relNode.content || '';
        return '';
    };

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
                    return;
                }
            } else {
                clearInterval(intervalId);
                currentTask.status = 'completed';
                if (!uiStore.uiState.needsPreview) {
                    applyChanges(currentTask.id);
                }
            }
        }, 30);
    };

    const _processQueue = () => {
        const processingCount = tasks.value.filter(t => t.status === 'processing').length;
        if (processingCount > 0) return;

        const pendingTask = tasks.value.find(t => t.status === 'pending');
        if (pendingTask) {
            _simulateAIStream(pendingTask.id);
        }
    };

    const _addTask = (taskType: '润色' | '续写' | '分析', item: ContentItem) => {
        const newTask: AITask = {
            id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: `${taskType}《${item.title}》`,
            type: taskType,
            targetItemId: item.id,
            status: 'pending',
            originalContent: item.content || '',
            generatedContent: '',
            createdAt: new Date(),
        };
        tasks.value.unshift(newTask);
    };

    function startNewTask(taskType: '润色' | '续写' | '分析', targetItemId: string) {
        const dirNode = directoryStore.findNodeById(targetItemId)?.node as ContentItem;
        const relNode = relatedContentStore.findNodeById(targetItemId)?.node as ContentItem;
        const item = dirNode || relNode;
        if (item) {
            _addTask(taskType, item);
            nextTick(_processQueue);
        }
    }

    function startBatchTaskForVolume(taskType: '润色' | '续写' | '分析', volume: Volume) {
        volume.chapters.forEach(chapter => _addTask(taskType, chapter));
        nextTick(_processQueue);
    }

    function applyChanges(taskId: string) {
        const task = tasks.value.find(t => t.id === taskId);
        if (task && task.status === 'completed') {
            directoryStore.appendChapterContent(task.targetItemId, task.generatedContent);
            task.status = 'applied';
        }
    }

    function retryTask(taskId: string) {
        const task = tasks.value.find(t => t.id === taskId);
        if (task && task.status === 'failed') {
            task.status = 'pending';
            task.error = undefined;
            task.generatedContent = '';
            nextTick(_processQueue);
        }
    }

    function clearCompletedTasks() {
        tasks.value = tasks.value.filter(t => t.status !== 'applied' && t.status !== 'failed');
    }

    function clearAllTasks() {
        tasks.value = [];
    }

    return {
        tasks,
        activeTasksCount,
        startNewTask,
        startBatchTaskForVolume,
        applyChanges,
        retryTask,
        clearCompletedTasks,
        clearAllTasks,
    };
});