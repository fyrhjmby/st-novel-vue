
import { defineStore } from 'pinia'
import { ref, nextTick } from 'vue'
import { useEditorStore } from './editorStore'
import type { AITask, AITaskStatus, Volume } from '@/novel/editor/types';

export const useAITaskStore = defineStore('aiTask', () => {
    // --- State ---
    const tasks = ref<AITask[]>([]);
    const previewTaskId = ref<string | null>(null);
    const taskForPreview = ref<{ type: '润色' | '续写' | '分析'; targetItemId: string; title: string } | null>(null);

    // --- Private Methods ---

    /**
     * 模拟AI流式生成内容。
     * 这个函数是任务执行的核心。
     * @param taskId - 要处理的任务ID。
     */
    const _simulateAIStream = (taskId: string) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (!task || task.status !== 'pending') return;

        const editorStore = useEditorStore();
        task.status = 'processing';
        task.generatedContent = '';

        const mockResponses = {
            '续写': "警报的尖啸犹如一把利刃，划破了卡尔文短暂的假寐。他猛然挺直身躯，猩红的警示灯在他眼中投下不祥的光晕。'发现引力异常，' 艾拉的合成音毫无波澜，却字字千钧，'我们正迫近一个理论中的时空奇点——跃迁点。根据数据库推演，这或许是返回太阳系的唯一路径。'",
            '润色': "控制台的警报声，如同一道惊雷，将卡尔文从混沌的浅眠中劈醒。他霍然坐直，闪烁的红色警告灯在视网膜上烙下灼热的印记。",
            '分析': "从文本来看，主角卡尔文此刻的情绪是震惊与希望的混合体。'浅眠'暗示了他长期的精神疲惫，而警报则是一个外部冲突的触发器。'回家'是核心动机，为后续情节发展提供了强大的驱动力。建议在后续描写中，可以加入更多关于他过去的回忆闪现，以丰富人物形象。",
        };

        const mockResponseText = mockResponses[task.type];
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
                if (previewTaskId.value !== task.id) {
                    editorStore.appendContentToItem(task.targetItemId, task.generatedContent, true);
                    task.status = 'applied';
                }
            }
        }, 30);
    }

    /**
     * 队列处理器，负责执行所有待处理的任务。
     */
    const _processQueue = () => {
        const pendingTasks = tasks.value.filter(t => t.status === 'pending');
        for (const task of pendingTasks) {
            _simulateAIStream(task.id);
        }
    };

    /**
     * 内部使用的添加任务函数，只负责创建对象和入队。
     * @param taskType - 任务类型。
     * @param targetItemId - 目标文档ID。
     */
    const _addTask = (taskType: '润色' | '续写' | '分析', targetItemId: string) => {
        const editorStore = useEditorStore();
        const { node: item } = editorStore.findItemById(targetItemId);

        if (!item || item.content === undefined) {
            console.error("无法启动AI任务：找不到目标文档或文档没有内容属性。", targetItemId);
            return;
        }

        const newTask: AITask = {
            id: `task_${Date.now()}_${Math.random()}`,
            title: `${taskType} "${item.title}"`,
            type: taskType,
            targetItemId: targetItemId,
            status: 'pending',
            originalContent: item.content || '',
            generatedContent: '',
            createdAt: new Date(),
        };

        tasks.value.unshift(newTask);
    };


    // --- Public Actions ---

    /**
     * 准备一个任务以供预览，但不立即执行。
     * @param taskType - 任务类型。
     * @param targetItemId - 目标文档ID。
     */
    const prepareTaskForPreview = (taskType: '润色' | '续写' | '分析', targetItemId: string) => {
        const editorStore = useEditorStore();
        const { node: item } = editorStore.findItemById(targetItemId);
        if (!item) {
            console.error("无法准备预览任务：找不到目标文档。", targetItemId);
            taskForPreview.value = null;
            return;
        }
        taskForPreview.value = {
            type: taskType,
            targetItemId: targetItemId,
            title: `${taskType} "${item.title}"`
        };
    };

    /**
     * 清理待预览的任务信息。
     */
    const clearTaskForPreview = () => {
        taskForPreview.value = null;
    }

    /**
     * 设置当前正在预览的任务ID。
     * @param taskId - 任务ID或null。
     */
    const setPreviewTaskId = (taskId: string | null) => {
        previewTaskId.value = taskId;
    }

    /**
     * 启动一个新的AI任务。
     * @param taskType - 任务类型。
     * @param targetItemId - 目标文档ID。
     */
    const startNewTask = (taskType: '润色' | '续写' | '分析', targetItemId: string) => {
        _addTask(taskType, targetItemId);
        nextTick(_processQueue);
    };

    /**
     * 为一个卷下的所有章节启动批量AI任务。
     * @param taskType - 任务类型。
     * @param volume - 目标卷对象。
     */
    const startBatchTaskForVolume = (taskType: '润色' | '续写' | '分析', volume: Volume) => {
        if (!volume || !volume.chapters) return;

        for (const chapter of volume.chapters) {
            _addTask(taskType, chapter.id);
        }
        // 在所有任务都入队后，统一触发一次队列处理器
        nextTick(_processQueue);
    };

    /**
     * 应用指定任务的修改。
     * @param taskId - 已完成的任务ID。
     */
    const applyChanges = (taskId: string) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (task && task.status === 'completed') {
            const editorStore = useEditorStore();
            editorStore.appendContentToItem(task.targetItemId, task.generatedContent, false);
            task.status = 'applied';
            if (previewTaskId.value === taskId) {
                previewTaskId.value = null;
            }
        }
    };

    /**
     * 重试一个失败的任务。
     * @param taskId - 要重试的任务ID。
     */
    const retryTask = (taskId: string) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (task && task.status === 'failed') {
            task.status = 'pending';
            task.error = undefined;
            task.generatedContent = '';
            nextTick(_processQueue);
        }
    };

    /**
     * 清空所有任务。
     */
    const clearAllTasks = () => {
        tasks.value = [];
    };

    return {
        tasks,
        previewTaskId,
        taskForPreview,
        startNewTask,
        startBatchTaskForVolume,
        clearAllTasks,
        setPreviewTaskId,
        applyChanges,
        retryTask,
        prepareTaskForPreview,
        clearTaskForPreview,
    }
});