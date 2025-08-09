// ..\src\novel\editor\stores\ai\aiConfigStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AITaskType, AIProviderConfig } from '@novel/editor/types';

// 定义每种任务类型默认选中的提示词ID
const defaultSelectedPromptIds: Record<AITaskType, string> = {
    '润色': 'prompt-polish-default',
    '续写': 'prompt-continue-default',
    '分析': 'prompt-analyze-default',
    '剧情生成': 'prompt-plot-default',
    '创作': 'prompt-create-default',
};

// 预定义的外部AI配置列表
const defaultAIProviders: AIProviderConfig[] = [
    { id: 'provider-1', name: '默认模型 (快速)', model: 'fast-model-v1', temperature: 0.5, maxTokens: 2048, description: '响应速度快，适用于润色、续写等常规任务。' },
    { id: 'provider-2', name: '创造性模型 (强大)', model: 'creative-model-v2', temperature: 0.8, maxTokens: 4096, description: '更具创造力和想象力，适用于剧情生成和分析。' },
    { id: 'provider-3', name: '分析专用模型 (深度)', model: 'analytical-model-v1', temperature: 0.2, maxTokens: 8192, description: '逻辑性强，上下文理解能力优秀，适合深度分析。' },
];

export const useAIConfigStore = defineStore('aiConfig', () => {
    // State: 外部AI配置列表
    const availableAIProviders = ref<AIProviderConfig[]>(defaultAIProviders);

    // State: 每种任务类型的具体配置
    const taskConfigs = ref<Record<AITaskType, { selectedPromptId: string; selectedAIProviderId: string }>>({
        '润色': { selectedPromptId: defaultSelectedPromptIds['润色'], selectedAIProviderId: 'provider-1' },
        '续写': { selectedPromptId: defaultSelectedPromptIds['续写'], selectedAIProviderId: 'provider-1' },
        '分析': { selectedPromptId: defaultSelectedPromptIds['分析'], selectedAIProviderId: 'provider-3' },
        '剧情生成': { selectedPromptId: defaultSelectedPromptIds['剧情生成'], selectedAIProviderId: 'provider-2' },
        '创作': { selectedPromptId: defaultSelectedPromptIds['创作'], selectedAIProviderId: 'provider-2' },
    });

    /**
     * 获取可用的外部AI配置列表
     * @returns AIProviderConfig[]
     */
    const getAvailableAIProviders = computed(() => availableAIProviders.value);

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

    /**
     * 更新指定任务类型选择的AI Provider ID
     * @param taskType 要更新的任务类型
     * @param providerId 选择的AI Provider ID
     */
    const setSelectedAIProviderId = (taskType: AITaskType, providerId: string) => {
        if (taskConfigs.value[taskType] && availableAIProviders.value.some(p => p.id === providerId)) {
            taskConfigs.value[taskType].selectedAIProviderId = providerId;
        }
    };

    return {
        taskConfigs,
        availableAIProviders,
        getAvailableAIProviders,
        setSelectedPromptId,
        setSelectedAIProviderId,
    };
});