import apiClient from '@/api/client';
import type { NovelDashboardItem, NovelCategory } from '@/novel/types';

/**
 * 从后端获取小说仪表盘列表
 * @returns 返回小说项目摘要列表
 */
export const fetchNovels = async (): Promise<NovelDashboardItem[]> => {
    const response = await apiClient.get('/novels');
    return response.data;
};

/**
 * 创建一本新的小说
 * @param data - 创建小说所需的数据
 * @returns 返回新创建的小说项目摘要
 */
export const createNovel = async (data: { title: string; synopsis: string; category: NovelCategory }): Promise<NovelDashboardItem> => {
    const response = await apiClient.post('/novels', data);
    return response.data;
};

/**
 * 获取所有可用的小说分类
 * @returns 返回分类名称数组
 */
export const fetchAvailableCategories = async (): Promise<NovelCategory[]> => {
    const response = await apiClient.get('/novels/categories');
    return response.data;
};

/**
 * 将指定ID的小说移至回收站
 * @param novelId - 要删除的小说ID
 */
export const moveToTrash = async (novelId: string): Promise<void> => {
    await apiClient.delete(`/novels/${novelId}`);
};