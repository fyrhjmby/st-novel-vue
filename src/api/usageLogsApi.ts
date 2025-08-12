// src/api/usageLogsApi.ts
import apiClient from './client';
import type { UsageStat, ApiLog, ChartDataPoint, FetchParams } from '@/types/usageLogs';

export const fetchUsageData = async (params: FetchParams): Promise<{
    stats: UsageStat[],
    logs: ApiLog[],
    chartData: ChartDataPoint[],
    totalLogs: number,
    totalPages: number
}> => {
    const response = await apiClient.get('/usage-logs', { params });
    return response.data;
};