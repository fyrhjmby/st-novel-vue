// 文件: ..\src\novel\editor\api\customOthersApi.ts
import apiClient from '@/api/client';
import type { ItemNode } from '@/novel/editor/types';

/**
 * 获取指定小说的自定义“其他”数据。
 * @param novelId - 小说的ID。
 * @returns 返回自定义“其他”条目数组。
 */
export const getOthersCustomData = async (novelId: string): Promise<ItemNode[]> => {
    const response = await apiClient.get(`/novels/${novelId}/custom-others`);
    return response.data;
};

/**
 * 更新指定小说的自定义“其他”数据。
 * @param novelId - 小说的ID。
 * @param data - 包含自定义“其他”数据的条目数组。
 * @returns 返回更新后的数据。
 */
export const updateOthersCustomData = async (novelId: string, data: ItemNode[]): Promise<ItemNode[]> => {
    const response = await apiClient.put(`/novels/${novelId}/custom-others`, data);
    return response.data;
};