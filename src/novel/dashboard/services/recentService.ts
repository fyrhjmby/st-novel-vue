import * as recentApi from '../api/recentApi';
import type { RecentActivityItem } from '@/novel/types';

export const fetchRecentItems = (): Promise<RecentActivityItem[]> => {
    return recentApi.fetchRecentItems();
};

export const logRecentAccess = (novelId: string): Promise<RecentActivityItem> => {
    return recentApi.logRecentAccess(novelId);
};