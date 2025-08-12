// src/api/novel/trashApi.ts
import apiClient from '@/api/client';
import type { DeletedItem, NovelDashboardItem } from '@/novel/types';

/**
 * 将指定ID的小说移至回收站
 * @param novelId - 要删除的小说ID
 */
export const moveToTrash = async (novelId: string): Promise<void> => {
    await apiClient.delete(`/novels/${novelId}`);
};

/**
 * 获取回收站中的项目列表
 * @returns 返回已删除项目列表
 */
export const fetchTrashedItems = async (): Promise<DeletedItem[]> => {
    const response = await apiClient.get('/trash/novels');
    return response.data;
};

/**
 * 从回收站恢复指定的项目
 * @param itemId - 要恢复的项目ID
 * @returns 返回恢复后的小说摘要信息
 */
export const restoreItem = async (itemId: string): Promise<NovelDashboardItem> => {
    const response = await apiClient.post(`/trash/novels/${itemId}/restore`);
    return response.data;
};

/**
 * 从回收站永久删除指定的项目
 * @param itemId - 要永久删除的项目ID
 */
export const deleteItemPermanently = async (itemId: string): Promise<void> => {
    await apiClient.delete(`/trash/novels/${itemId}`);
};