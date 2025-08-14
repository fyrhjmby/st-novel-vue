import { schedulesApi } from '@/workflow/api/schedulesApi';

export const schedulesService = {
    getSchedules: async () => {
        try {
            const data = await schedulesApi.fetchSchedules();
            return data;
        } catch (error) {
            console.error('Failed to get schedules:', error);
            return [];
        }
    },
};