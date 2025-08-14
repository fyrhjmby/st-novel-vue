import { defineStore } from 'pinia';
import { ref } from 'vue';
import { historyService } from '@/workflow/services/historyService';
import type { RunHistoryItem } from '@/workflow/types';

export const useHistoryStore = defineStore('history', () => {
    const runHistory = ref<RunHistoryItem[]>([]);
    const isLoading = ref(false);

    const loadRunHistory = async () => {
        isLoading.value = true;
        try {
            runHistory.value = await historyService.getRunHistory();
        } catch (error) {
            console.error('Error loading run history in store:', error);
            runHistory.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    return {
        runHistory,
        isLoading,
        loadRunHistory,
    };
});