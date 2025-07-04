import { ref, computed } from 'vue';

// 定义一个响应式的状态变量，用于控制模态框的显示与隐藏
const isConfigModalOpen = ref(false);
// 定义一个响应式的状态变量，用于存储当前正在配置的任务类型
const currentTaskType = ref('');

// 定义一个任务类型到中文标题的映射
const taskTitles: { [key: string]: string } = {
    'continue': '续写内容',
    'polish': '润色内容',
    'analyze': '分析内容',
    'chat': 'AI聊天助手'
};

/**
 * 打开任务配置模态框的函数
 * @param taskType - 要配置的任务类型 (e.g., 'polish')
 */
const openTaskConfig = (taskType: string) => {
    currentTaskType.value = taskType;
    isConfigModalOpen.value = true;
};

/**
 * 关闭任务配置模态框的函数
 */
const closeTaskConfig = () => {
    isConfigModalOpen.value = false;
};

// 计算属性，根据当前任务类型动态生成模态框标题
const taskTitle = computed(() => taskTitles[currentTaskType.value] || 'AI任务配置');

/**
 * AI任务状态管理 Composable (用于全局配置模态框)
 * @returns 返回一个包含状态和方法的对象，供组件使用
 */
export function useAITaskStore() {
    return {
        isConfigModalOpen,
        currentTaskType,
        taskTitle,
        openTaskConfig,
        closeTaskConfig,
    };
}