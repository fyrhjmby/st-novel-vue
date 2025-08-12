import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AITaskType, AIProviderConfig } from '@novel/editor/types';
import { fetchAvailableAIProviders } from '@novel/editor/services/ai/aiService.ts';

// 定义每种任务类型默认选中的提示词ID
const defaultSelectedPromptIds: Record<AITaskType, string> = {
    '润色': 'prompt-polish-default',
    '续写': 'prompt-continue-default',
    '分析': 'prompt-analyze-default',
    '剧情生成': 'prompt-plot-default',
    '创作': 'prompt-create-default',
};

// 定义任务配置的接口
interface TaskConfig {
    selectedPromptId: string;
    selectedAIProviderId: string;
    temperature: number;
}

export const useAIConfigStore = defineStore('aiConfig', () => {
    // State: 外部AI配置列表
    const availableAIProviders = ref<AIProviderConfig[]>([]);

    // State: 每种任务类型的具体配置，现在包含温度
    const taskConfigs = ref<Record<AITaskType, TaskConfig>>({
        '润色': { selectedPromptId: defaultSelectedPromptIds['润色'], selectedAIProviderId: '', temperature: 0.7 },
        '续写': { selectedPromptId: defaultSelectedPromptIds['续写'], selectedAIProviderId: '', temperature: 0.8 },
        '分析': { selectedPromptId: defaultSelectedPromptIds['分析'], selectedAIProviderId: '', temperature: 0.5 },
        '剧情生成': { selectedPromptId: defaultSelectedPromptIds['剧情生成'], selectedAIProviderId: '', temperature: 0.9 },
        '创作': { selectedPromptId: defaultSelectedPromptIds['创作'], selectedAIProviderId: '', temperature: 0.7 },
    });

    /**
     * 从系统设置中加载用户配置的 AI 提供商
     */
    async function initializeProviders() {
        if(availableAIProviders.value.length > 0) return;

        availableAIProviders.value = await fetchAvailableAIProviders();

        const firstAvailableProviderId = availableAIProviders.value[0]?.id || '';
        for (const taskType in taskConfigs.value) {
            const config = taskConfigs.value[taskType as AITaskType];
            const isCurrentProviderAvailable = availableAIProviders.value.some(p => p.id === config.selectedAIProviderId);
            if (!isCurrentProviderAvailable) {
                config.selectedAIProviderId = firstAvailableProviderId;
            }
        }
    }

    /**
     * 更新指定任务类型选择的提示词ID
     */
    const setSelectedPromptId = (taskType: AITaskType, promptId: string) => {
        if (taskConfigs.value[taskType]) {
            taskConfigs.value[taskType].selectedPromptId = promptId;
        }
    };

    /**
     * 更新指定任务类型选择的AI Provider ID
     */
    const setSelectedAIProviderId = (taskType: AITaskType, providerId: string) => {
        if (taskConfigs.value[taskType] && availableAIProviders.value.some(p => p.id === providerId)) {
            taskConfigs.value[taskType].selectedAIProviderId = providerId;
        }
    };

    /**
     * 更新指定任务类型的创作温度
     */
    const setTaskTemperature = (taskType: AITaskType, temperature: number) => {
        if (taskConfigs.value[taskType]) {
            taskConfigs.value[taskType].temperature = Number(temperature.toFixed(2));
        }
    }

    return {
        taskConfigs,
        availableAIProviders,
        initializeProviders,
        setSelectedPromptId,
        setSelectedAIProviderId,
        setTaskTemperature,
    };
});