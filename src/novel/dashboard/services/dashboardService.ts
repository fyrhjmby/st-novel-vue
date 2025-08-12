import * as dashboardApi from '../api/dashboardApi';
import * as recentApi from '@/api/novel/recentApi'; // 假设 recent 和 trash 暂时没有模块代理
import * as trashApi from '@/api/novel/trashApi';
import type { DeletedItem, NovelCategory, NovelDashboardItem, RecentActivityItem } from '@/novel/types';

// --- Novel List Functions ---
export const fetchNovels = (): Promise<NovelDashboardItem[]> => {
    return dashboardApi.fetchNovels();
};

export const createNovel = (data: { title: string; synopsis: string; category: NovelCategory }): Promise<NovelDashboardItem> => {
    return dashboardApi.createNovel(data);
};

export const fetchAvailableCategories = (): Promise<NovelCategory[]> => {
    return dashboardApi.fetchAvailableCategories();
};

// --- Recent Activity Functions ---
export const fetchRecentItems = (): Promise<RecentActivityItem[]> => {
    return recentApi.fetchRecentItems();
};

export const logRecentAccess = (novelId: string): Promise<RecentActivityItem> => {
    return recentApi.logRecentAccess(novelId);
};

// --- Trash Functions ---
export const moveToTrash = (novelId: string): Promise<void> => {
    return trashApi.moveToTrash(novelId);
};

export const fetchTrashedItems = (): Promise<DeletedItem[]> => {
    return trashApi.fetchTrashedItems();
};

export const restoreItem = (itemId: string): Promise<NovelDashboardItem> => {
    return trashApi.restoreItem(itemId);
};

export const deleteItemPermanently = (itemId: string): Promise<void> => {
    // 此处调用的是 trashApi 的永久删除，它会调用 /trash/novels/:id
    // 这与 projectApi 中的 /novels/:id/permanent 是不同的，前者是从回收站删除
    return trashApi.deleteItemPermanently(itemId);
};