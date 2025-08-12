import apiClient from '@/api/client';
import type { NovelMetadata } from '@/novel/editor/types/project';

/**
 * 根据小说ID获取元数据
 * @param novelId - 小说ID
 * @returns 返回小说元数据
 */
export const getNovelMetadata = async (novelId: string): Promise<NovelMetadata> => {
    const response = await apiClient.get(`/novels/${novelId}/metadata`);
    return response.data;
};

/**
 * 更新小说元数据
 * @param novelId - 小说ID
 * @param metadata - 更新后的元数据
 * @returns 返回更新后的元数据
 */
export const updateNovelMetadata = async (novelId: string, metadata: Partial<NovelMetadata>): Promise<NovelMetadata> => {
    const response = await apiClient.patch(`/novels/${novelId}/metadata`, metadata);
    return response.data;
};