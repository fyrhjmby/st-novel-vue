import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Stat, QuickStartAction, RecentProject } from '@/types/home';
import { dashboardService } from '@/home/services/dashboardService';

export const useDashboardStore = defineStore('dashboard', () => {
    // State
    const stats = ref<Stat[]>([]);
    const quickStartActions = ref<QuickStartAction[]>([]);
    const recentProjects = ref<RecentProject[]>([]);
    const isLoading = ref(false);

    // Actions
    async function fetchDashboardData() {
        isLoading.value = true;
        try {
            const data = await dashboardService.getDashboardData();
            stats.value = data.stats;
            quickStartActions.value = data.quickStartActions;
            recentProjects.value = data.recentProjects;
        } catch (error) {
            console.error("Error in store while fetching dashboard data:", error);
            // 在这里可以设置错误状态
        } finally {
            isLoading.value = false;
        }
    }

    return {
        stats,
        quickStartActions,
        recentProjects,
        isLoading,
        fetchDashboardData,
    };
});