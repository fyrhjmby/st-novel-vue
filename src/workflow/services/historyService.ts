import { historyApi } from '@/workflow/api/historyApi';
import type { RunHistoryItem } from '@/workflow/types';

export const historyService = {
    getRunHistory: async (): Promise<RunHistoryItem[]> => {
        try {
            const data = await historyApi.fetchRunHistory();
            return data;
        } catch (error) {
            console.error('Failed to get run history:', error);
            return [];
        }
    },
};