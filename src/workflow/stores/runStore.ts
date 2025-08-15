import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { runService } from '@/workflow/services/runService';
import type { RunPreset, RunRecentParam, RunFormData } from '@/workflow/types';

export const useRunStore = defineStore('run', () => {
    const workflowId = ref<string | null>(null);
    const workflowName = ref<string>('');
    const presets = ref<RunPreset[]>([]);
    const recentParams = ref<RunRecentParam[]>([]);
    const isLoading = ref(false);
    const formData = reactive<RunFormData>({
        topic: '',
        platform: '',
        tone: '',
        includeHashtags: false,
        includeEmojis: false,
        includeCTA: false,
    });

    const loadRunData = async (id: string) => {
        isLoading.value = true;
        workflowId.value = id;
        try {
            const data = await runService.getRunPageData(id);
            if (data) {
                workflowName.value = data.workflowName;
                presets.value = data.presets;
                recentParams.value = data.recentParams;
                Object.assign(formData, data.initialFormData);
            }
        } catch (error) {
            console.error('Error loading run data in store:', error);
            workflowName.value = '加载失败';
        } finally {
            isLoading.value = false;
        }
    };

    return {
        workflowId,
        workflowName,
        presets,
        recentParams,
        formData,
        isLoading,
        loadRunData,
    };
});