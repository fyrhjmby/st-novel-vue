// ..\src\novel\editor\api\customAnalysisApi.ts
import apiClient from '@/api/client';
import type { ItemNode } from '@/novel/editor/types';

/**
 * 获取指定小说的自定义分析数据。
 * @param novelId - 小说的ID。
 * @returns 返回自定义分析条目数组。
 */
export const getAnalysisCustomData = async (novelId: string): Promise<ItemNode[]> => {
    const response = await apiClient.get(`/novels/${novelId}/custom-analysis`);
    return response.data;
};

/**
 * 更新指定小শনের自定义分析数据。
 * @param novelId - 小说的ID。
 * @param data - 包含自定义分析数据的条目数组。
 * @returns 返回更新后的数据。
 */
export const updateAnalysisCustomData = async (novelId: string, data: ItemNode[]): Promise<ItemNode[]> => {
    const response = await apiClient.put(`/novels/${novelId}/custom-analysis`, data);
    return response.data;
};