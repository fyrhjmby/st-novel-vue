import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AITaskType } from '@novel/editor/types';

// 定义每种任务类型默认选中的提示词ID
const defaultSelectedPromptIds: Record<AITaskType, string> = {
    '润色': 'prompt-polish-default',
    '续写': 'prompt-continue-default',
    '分析': 'prompt-analyze-default',
    '剧情生成': 'prompt-plot-default',
    '创作': 'prompt-create-default',
};

export const useAIConfigStore = defineStore('aiConfig', () => {
    // 状态结构简化，只存储选中ID和其他配置
    const taskConfigs = ref<Record<AITaskType, { selectedPromptId: string }>>({
        '润色': { selectedPromptId: defaultSelectedPromptIds['润色'] },
        '续写': { selectedPromptId: defaultSelectedPromptIds['续写'] },
        '分析': { selectedPromptId: defaultSelectedPromptIds['分析'] },
        '剧情生成': { selectedPromptId: defaultSelectedPromptIds['剧情生成'] },
        '创作': { selectedPromptId: defaultSelectedPromptIds['创作'] },
    });

    /**
     * 更新指定任务类型选择的提示词ID
     * @param taskType 要更新的任务类型
     * @param promptId 选择的提示词ID
     */
    const setSelectedPromptId = (taskType: AITaskType, promptId: string) => {
        if (taskConfigs.value[taskType]) {
            taskConfigs.value[taskType].selectedPromptId = promptId;
        }
    };

    return {
        taskConfigs,
        setSelectedPromptId,
    };
});