import apiClient from '@/api/client';
import type { Volume } from '@/novel/editor/types';

/**
 * 获取指定小说的所有卷（不含章节内容）。
 * @param novelId - 小说的ID。
 * @returns 返回该小说下所有卷的数组。
 */
export const getVolumes = async (novelId: string): Promise<Volume[]> => {
    const response = await apiClient.get(`/novels/${novelId}/volumes`);
    return response.data;
};

/**
 * 为指定小说创建一个新的卷。
 * @param novelId - 小说的ID。
 * @param volumeData - 创建卷所需的数据（如标题、大纲）。
 * @returns 返回新创建的卷对象。
 */
export const createVolume = async (novelId: string, volumeData: Partial<Omit<Volume, 'id' | 'chapters'>>): Promise<Volume> => {
    const response = await apiClient.post(`/novels/${novelId}/volumes`, volumeData);
    return response.data;
};

/**
 * 更新指定卷的信息（如标题、大纲）。
 * @param volumeId - 要更新的卷的ID。
 * @param volumeData - 包含更新字段的对象。
 * @returns 返回更新后的卷对象。
 */
export const updateVolume = async (volumeId: string, volumeData: Partial<Omit<Volume, 'id' | 'chapters'>>): Promise<Volume> => {
    const response = await apiClient.patch(`/volumes/${volumeId}`, volumeData);
    return response.data;
};

/**
 * 删除一个卷。
 * @param volumeId - 要删除的卷的ID。
 */
export const deleteVolume = async (volumeId: string): Promise<void> => {
    await apiClient.delete(`/volumes/${volumeId}`);
};

/**
 * 更新一个小说下所有卷的排序。
 * @param novelId - 小说的ID。
 * @param orderedVolumeIds - 按新顺序排列的卷ID数组。
 */
export const updateVolumeOrder = async (novelId: string, orderedVolumeIds: string[]): Promise<void> => {
    await apiClient.put(`/novels/${novelId}/volumes/order`, { orderedVolumeIds });
};