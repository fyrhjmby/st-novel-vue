import * as usageLogsApi from '@/api/usageLogsApi';
import type { UsageStat, ApiLog, ChartDataPoint, FetchParams } from '@/types/usageLogs';

export type { UsageStat, ApiLog, ChartDataPoint, FetchParams };

export const fetchUsageData = (params: FetchParams): Promise<{
    stats: UsageStat[],
    logs: ApiLog[],
    chartData: ChartDataPoint[],
    totalLogs: number,
    totalPages: number
}> => {
    return usageLogsApi.fetchUsageData(params);
};