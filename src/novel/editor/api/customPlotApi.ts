// 文件: ..\src\novel\editor\api\customPlotApi.ts
import apiClient from '@/api/client';
import type { ItemNode } from '@/novel/editor/types';

/**
 * 获取指定小说的自定义剧情数据。
 * @param novelId - 小说的ID。
 * @returns 返回自定义剧情条目数组。
 */
export const getPlotCustomData = async (novelId: string): Promise<ItemNode[]> => {
    const response = await apiClient.get(`/novels/${novelId}/custom-plot`);
    return response.data;
};

/**
 * 更新指定小说的自定义剧情数据。
 * @param novelId - 小说的ID。
 * @param data - 包含自定义剧情数据的条目数组。
 * @returns 返回更新后的数据。
 */
export const updatePlotCustomData = async (novelId: string, data: ItemNode[]): Promise<ItemNode[]> => {
    const response = await apiClient.put(`/novels/${novelId}/custom-plot`, data);
    return response.data;
};