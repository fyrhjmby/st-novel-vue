// 文件: ..\src\novel\editor\api\settingsApi.ts
import apiClient from '@/api/client';
import type { TreeNode } from '@/novel/editor/types';

/**
 * 获取指定小说的设定数据。
 * @param novelId - 小说的ID。
 * @returns 返回设定数据的树形节点数组。
 */
export const getSettingsData = async (novelId: string): Promise<TreeNode[]> => {
    const response = await apiClient.get(`/novels/${novelId}/settings`);
    return response.data;
};

/**
 * 更新指定小说的设定数据。
 * @param novelId - 小说的ID。
 * @param data - 包含设定数据的树形节点数组。
 * @returns 返回更新后的数据。
 */
export const updateSettingsData = async (novelId: string, data: TreeNode[]): Promise<TreeNode[]> => {
    const response = await apiClient.put(`/novels/${novelId}/settings`, data);
    return response.data;
};