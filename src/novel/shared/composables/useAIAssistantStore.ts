import { defineStore } from 'pinia';

// 定义一个任务类型到中文标题的映射
const taskTitles: { [key: string]: string } = {
    'continue': '续写内容',
    'polish': '润色内容',
    'analyze': '分析内容',
    'chat': 'AI聊天助手'
};

/**
 * AI 助手全局状态管理 Store
 */
export const useAIAssistantStore = defineStore('aiAssistant', {
    state: () => ({
        isConfigModalOpen: false,
        currentTaskType: '',
    }),
    getters: {
        /**
         * 根据当前任务类型动态生成模态框标题
         */
        taskTitle: (state): string => taskTitles[state.currentTaskType] || 'AI任务配置',
    },
    actions: {
        /**
         * 打开任务配置模态框
         * @param taskType - 要配置的任务类型 (e.g., 'polish')
         */
        openTaskConfig(taskType: string) {
            this.currentTaskType = taskType;
            this.isConfigModalOpen = true;
        },

        /**
         * 关闭任务配置模态框
         */
        closeTaskConfig() {
            this.isConfigModalOpen = false;
        },
    },
});