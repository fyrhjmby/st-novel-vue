import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useEditorStore } from './editorStore'

// --- 类型定义 ---
export type AITaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AITask {
    id: string;
    title: string;
    status: AITaskStatus;
    prompt: string;
    originalContent: string;
    generatedContent: string;
    error?: string;
    createdAt: Date;
}

// --- Store 定义 ---
export const useAITaskStore = defineStore('aiTask', () => {
    // --- State ---

    /**
     * 存储所有AI任务的队列
     */
    const tasks = ref<AITask[]>([]);

    // --- Actions ---

    /**
     * 模拟AI流式响应
     * @param taskId - 正在处理的任务ID
     */
    const _simulateAIStream = (taskId: string) => {
        const task = tasks.value.find(t => t.id === taskId);
        if (!task) return;

        task.status = 'processing';
        // 流式响应开始时，生成内容等于原始内容，AI在此基础上增删
        task.generatedContent = task.originalContent + '\n\n';

        // 模拟的流式文本
        const mockResponseText = "警报的尖啸犹如一把利刃，划破了卡尔文短暂的假寐。他猛然挺直身躯，猩红的警示灯在他眼中投下不祥的光晕。'发现引力异常，' 艾拉的合成音毫无波澜，却字字千钧，'我们正迫近一个理论中的时空奇点——跃迁点。根据数据库推演，这或许是返回太阳系的唯一路径。'";
        const words = mockResponseText.split(''); // 按单个字符分割以获得更平滑的流式效果
        let wordIndex = 0;

        // 随机决定这次模拟是否会失败
        const willFail = Math.random() < 0.1; // 10%的失败率

        const intervalId = setInterval(() => {
            if (wordIndex < words.length) {
                task.generatedContent += words[wordIndex];
                wordIndex++;

                // 模拟中途失败
                if (willFail && wordIndex > words.length / 2) {
                    clearInterval(intervalId);
                    task.status = 'failed';
                    task.error = '生成超时，请检查网络后重试。';
                    return;
                }

            } else {
                clearInterval(intervalId);
                task.status = 'completed';
            }
        }, 30); // 每30ms吐一个字，速度更快一些
    }

    /**
     * 创建并开始一个新AI任务
     * @param taskType - 任务类型 (如 '润色', '续写')
     */
    const startNewTask = (taskType: '润色' | '续写' | '分析') => {
        const editorStore = useEditorStore();
        const currentItem = editorStore.activeItem;

        if (!currentItem) {
            console.error("无法启动AI任务：没有激活的文档。");
            return;
        }

        const newTask: AITask = {
            id: `task_${Date.now()}`,
            title: `${taskType} "${currentItem.title}"`,
            status: 'pending',
            prompt: `请对以下内容进行"${taskType}"：`, // 简单的示例prompt
            originalContent: currentItem.content,
            generatedContent: '',
            createdAt: new Date(),
        };

        // 将新任务添加到队列顶部
        tasks.value.unshift(newTask);

        // 立即开始模拟处理
        // 使用 setTimeout 延迟执行，给 Vue 一点时间渲染 "pending" 状态
        setTimeout(() => _simulateAIStream(newTask.id), 100);
    };

    /**
     * 清除所有任务
     */
    const clearAllTasks = () => {
        tasks.value = [];
    };

    return {
        // State
        tasks,
        // Actions
        startNewTask,
        clearAllTasks
    }
})