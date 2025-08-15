import { runApi } from '@/workflow/api/runApi';

export const runService = {
    getRunPageData: async (id: string) => {
        try {
            const data = await runApi.fetchRunPageData(id);
            return data;
        } catch (error) {
            console.error('Failed to get run page data:', error);
            return null;
        }
    },
};