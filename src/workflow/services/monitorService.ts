import { monitorApi } from '@/workflow/api/monitorApi';

export const monitorService = {
    getMonitorData: async () => {
        try {
            const data = await monitorApi.fetchMonitorData();
            return data;
        } catch (error) {
            console.error('Failed to get monitor data:', error);
            return null;
        }
    },
};