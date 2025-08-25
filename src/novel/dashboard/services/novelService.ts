import * as dashboardApi from '../api/dashboardApi';
import type { NovelCategory, NovelDashboardItem } from '@/novel/types';

export const fetchNovels = (): Promise<NovelDashboardItem[]> => {
    return dashboardApi.fetchNovels();
};

export const createNovel = (data: { title: string; synopsis: string; category: NovelCategory }): Promise<NovelDashboardItem> => {
    return dashboardApi.createNovel(data);
};

export const fetchAvailableCategories = (): Promise<NovelCategory[]> => {
    return dashboardApi.fetchAvailableCategories();
};

export const moveToTrash = (novelId: string): Promise<void> => {
    return dashboardApi.moveToTrash(novelId);
};