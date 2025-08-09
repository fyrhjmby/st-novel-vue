import { fetchMockDashboardData } from '@/home/api/mockDashboardApi';

const getDashboardData = async () => {
    try {
        const data = await fetchMockDashboardData();
        return data;
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // 返回空状态或默认值，以便UI可以优雅地处理错误
        return {
            stats: [],
            quickStartActions: [],
            recentProjects: [],
        };
    }
}

export const dashboardService = {
    getDashboardData,
}