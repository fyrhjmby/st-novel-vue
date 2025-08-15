import { defineStore } from 'pinia';
import { ref } from 'vue';
import { dashboardService } from '@/workflow/services/dashboardService';
import type { DashboardStat, QuickStartAction, RecentProject } from '@/workflow/types';

export const useDashboardStore = defineStore('dashboard', () => {
    const stats = ref<DashboardStat[]>([]);
    const quickStartActions = ref<QuickStartAction[]>([]);
    const recentProjects = ref<RecentProject[]>([]);
    const isLoading = ref(false);

    const loadDashboardData = async () => {
        isLoading.value = true;
        try {
            const data = await dashboardService.getDashboardData();
            if (data) {
                stats.value = data.stats;
                quickStartActions.value = data.quickStartActions;
                recentProjects.value = data.recentProjects;
            }
        } catch (error) {
            console.error('Error loading dashboard data in store:', error);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        stats,
        quickStartActions,
        recentProjects,
        isLoading,
        loadDashboardData,
    };
});