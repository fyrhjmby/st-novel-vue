import { defineStore } from 'pinia';
import { ref } from 'vue';
import { dashboardService } from '@/workflow/services/dashboardService';
import type { DashboardStat, QuickStartAction, RecentProject, Workflow } from '@/workflow/types';

export const useDashboardStore = defineStore('dashboard', () => {
    const stats = ref<DashboardStat[]>([]);
    const quickStartActions = ref<QuickStartAction[]>([]);
    const recentProjects = ref<RecentProject[]>([]);
    const allWorkflows = ref<Workflow[]>([]);
    const isLoading = ref(false);

    const loadDashboardData = async () => {
        isLoading.value = true;
        try {
            const data = await dashboardService.getDashboardData();
            if (data) {
                stats.value = data.stats;
                quickStartActions.value = data.quickStartActions;
                recentProjects.value = data.recentProjects;
                allWorkflows.value = data.allWorkflows || [];
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
        allWorkflows,
        isLoading,
        loadDashboardData,
    };
});