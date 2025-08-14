import { runApi } from '@/workflow/api/runApi';

export const runService = {
    getRunPageData: async () => {
        try {
            const data = await runApi.fetchRunPageData();
            return data;
        } catch (error) {
            console.error('Failed to get run page data:', error);
            return null;
        }
    },
};