import apiClient from '@/api/client';
import type { RecentActivityItem } from '@/novel/types';

/**
 * 获取最近活动列表
 * @returns 返回最近活动项目列表
 */
export const fetchRecentItems = async (): Promise<RecentActivityItem[]> => {
    const response = await apiClient.get('/recent-items');
    return response.data;
};

/**
 * 记录一次小说访问活动
 * @param novelId - 被访问的小说ID
 * @returns 返回新创建的活动记录
 */
export const logRecentAccess = async (novelId: string): Promise<RecentActivityItem> => {
    const response = await apiClient.post('/recent-items', { novelId });
    return response.data;
};