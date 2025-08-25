import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AITaskType, AIProviderConfig } from '@novel/editor/types';
import { fetchAvailableAIProviders } from '@novel/editor/services/ai/aiService';

const defaultSelectedPromptIds: Record<AITaskType, string> = {
    '润色': 'prompt-polish-default',
    '续写': 'prompt-continue-default',
    '分析': 'prompt-analyze-default',
    '剧情生成': 'prompt-plot-default',
    '创作': 'prompt-create-default',
};

interface TaskConfig {
    selectedPromptId: string;
    selectedAIProviderId: string | null;
    temperature: number;
}

export const useAIConfigStore = defineStore('aiConfig', () => {
    const availableAIProviders = ref<AIProviderConfig[]>([]);
    const selectedChatProviderId = ref<string | null>(null);

    const taskConfigs = ref<Record<AITaskType, TaskConfig>>({
        '润色': { selectedPromptId: defaultSelectedPromptIds['润色'], selectedAIProviderId: null, temperature: 0.7 },
        '续写': { selectedPromptId: defaultSelectedPromptIds['续写'], selectedAIProviderId: null, temperature: 0.8 },
        '分析': { selectedPromptId: defaultSelectedPromptIds['分析'], selectedAIProviderId: null, temperature: 0.5 },
        '剧情生成': { selectedPromptId: defaultSelectedPromptIds['剧情生成'], selectedAIProviderId: null, temperature: 0.9 },
        '创作': { selectedPromptId: defaultSelectedPromptIds['创作'], selectedAIProviderId: null, temperature: 0.7 },
    });

    const selectedChatProviderConfig = computed(() => {
        return availableAIProviders.value.find(p => p.id === selectedChatProviderId.value) || null;
    });

    async function initializeProviders() {
        if (availableAIProviders.value.length > 0) return;

        availableAIProviders.value = await fetchAvailableAIProviders();

        const firstAvailableProviderId = availableAIProviders.value[0]?.id || null;

        if (!selectedChatProviderId.value) {
            selectedChatProviderId.value = firstAvailableProviderId;
        }

        for (const taskType in taskConfigs.value) {
            const config = taskConfigs.value[taskType as AITaskType];
            const isCurrentProviderAvailable = availableAIProviders.value.some(p => p.id === config.selectedAIProviderId);
            if (!isCurrentProviderAvailable) {
                config.selectedAIProviderId = firstAvailableProviderId;
            }
        }
    }

    const selectChatProvider = (id: string) => {
        if (availableAIProviders.value.some(p => p.id === id)) {
            selectedChatProviderId.value = id;
        }
    }

    const setSelectedPromptId = (taskType: AITaskType, promptId: string) => {
        if (taskConfigs.value[taskType]) {
            taskConfigs.value[taskType].selectedPromptId = promptId;
        }
    };

    const setSelectedAIProviderId = (taskType: AITaskType, providerId: string) => {
        if (taskConfigs.value[taskType] && availableAIProviders.value.some(p => p.id === providerId)) {
            taskConfigs.value[taskType].selectedAIProviderId = providerId;
        }
    };

    const setTaskTemperature = (taskType: AITaskType, temperature: number) => {
        if (taskConfigs.value[taskType]) {
            taskConfigs.value[taskType].temperature = Number(temperature.toFixed(2));
        }
    }

    return {
        availableAIProviders,
        selectedChatProviderId,
        taskConfigs,
        selectedChatProviderConfig,
        initializeProviders,
        selectChatProvider,
        setSelectedPromptId,
        setSelectedAIProviderId,
        setTaskTemperature,
    };
});