import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { runService } from '@/workflow/services/runService';
import type { RunPreset, RunRecentParam, RunFormData } from '@/workflow/types';

export const useRunStore = defineStore('run', () => {
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

    const loadRunData = async () => {
        isLoading.value = true;
        try {
            const data = await runService.getRunPageData();
            if (data) {
                presets.value = data.presets;
                recentParams.value = data.recentParams;
                Object.assign(formData, data.initialFormData);
            }
        } catch (error) {
            console.error('Error loading run data in store:', error);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        presets,
        recentParams,
        formData,
        isLoading,
        loadRunData,
    };
});