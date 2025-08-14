import { dashboardApi } from '@/workflow/api/dashboardApi';
import type { DashboardData } from '@/workflow/types';

export const dashboardService = {
    getDashboardData: async (): Promise<DashboardData | null> => {
        try {
            const data = await dashboardApi.fetchDashboardData();
            return data;
        } catch (error) {
            console.error('Failed to get dashboard data:', error);
            return null;
        }
    },
};