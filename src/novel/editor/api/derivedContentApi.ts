import apiClient from '@/api/client';
import type { PlotAnalysisItem } from '@/novel/editor/types';

/**
 * 获取指定小说的所有派生内容（剧情和分析）。
 * @param novelId - 小说的ID。
 * @returns 返回一个包含所有派生内容条目的数组。
 */
export const getDerivedItemsForNovel = async (novelId: string): Promise<PlotAnalysisItem[]> => {
    const response = await apiClient.get(`/novels/${novelId}/derived-content`);
    return response.data;
};

/**
 * 创建一个新的派生内容条目。
 * @param itemData - 创建条目所需的数据（类型、源ID、标题、内容）。
 * @returns 返回新创建的派生内容条目。
 */
export const createDerivedItem = async (itemData: Omit<PlotAnalysisItem, 'id'>): Promise<PlotAnalysisItem> => {
    const response = await apiClient.post(`/derived-content`, itemData);
    return response.data;
};

/**
 * 更新一个派生内容条目。
 * @param itemId - 要更新的条目的ID。
 * @param itemData - 包含更新字段的对象。
 * @returns 返回更新后的派生内容条目。
 */
export const updateDerivedItem = async (itemId: string, itemData: Partial<Omit<PlotAnalysisItem, 'id'>>): Promise<PlotAnalysisItem> => {
    const response = await apiClient.patch(`/derived-content/${itemId}`, itemData);
    return response.data;
};

/**
 * 删除一个派生内容条目。
 * @param itemId - 要删除的条目的ID。
 */
export const deleteDerivedItem = async (itemId: string): Promise<void> => {
    await apiClient.delete(`/derived-content/${itemId}`);
};