import * as dashboardApi from '@/api/novel/dashboardApi';
import type { NovelDashboardItem, NovelCategory } from '@/novel/types';

/**
 * 从后端获取小说仪表盘列表
 * @returns 返回小说项目摘要列表
 */
export const fetchNovels = (): Promise<NovelDashboardItem[]> => {
    return dashboardApi.fetchNovels();
};

/**
 * 创建一本新的小说
 * @param data - 创建小说所需的数据
 * @returns 返回新创建的小说项目摘要
 */
export const createNovel = (data: { title: string; synopsis: string; category: NovelCategory }): Promise<NovelDashboardItem> => {
    return dashboardApi.createNovel(data);
};

/**
 * 获取所有可用的小说分类
 * @returns 返回分类名称数组
 */
export const fetchAvailableCategories = (): Promise<NovelCategory[]> => {
    return dashboardApi.fetchAvailableCategories();
};