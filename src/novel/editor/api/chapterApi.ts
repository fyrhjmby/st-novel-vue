import apiClient from '@/api/client';
import type { Chapter } from '@/novel/editor/types';

/**
 * 获取指定小说的所有章节（扁平列表）。
 * @param novelId - 小说的ID。
 * @returns 返回该小说下所有章节的数组。
 */
export const getChaptersForNovel = async (novelId: string): Promise<Chapter[]> => {
    const response = await apiClient.get(`/novels/${novelId}/chapters`);
    return response.data;
};

/**
 * 获取单个章节的详细信息，包括正文内容。
 * @param chapterId - 章节的ID。
 * @returns 返回完整的章节对象。
 */
export const getChapter = async (chapterId: string): Promise<Chapter> => {
    const response = await apiClient.get(`/chapters/${chapterId}`);
    return response.data;
};

/**
 * 在指定卷下创建一个新的章节。
 * @param volumeId - 章节所属的卷的ID。
 * @param chapterData - 创建章节所需的数据（如标题）。
 * @returns 返回新创建的章节对象。
 */
export const createChapter = async (volumeId: string, chapterData: Partial<Omit<Chapter, 'id'>>): Promise<Chapter> => {
    const response = await apiClient.post(`/volumes/${volumeId}/chapters`, chapterData);
    return response.data;
};

/**
 * 更新指定章节的信息（如标题、内容、状态）。
 * @param chapterId - 要更新的章节的ID。
 * @param chapterData - 包含更新字段的对象。
 * @returns 返回更新后的章节对象。
 */
export const updateChapter = async (chapterId: string, chapterData: Partial<Omit<Chapter, 'id'>>): Promise<Chapter> => {
    const response = await apiClient.patch(`/chapters/${chapterId}`, chapterData);
    return response.data;
};

/**
 * 删除一个章节。
 * @param chapterId - 要删除的章节的ID。
 */
export const deleteChapter = async (chapterId: string): Promise<void> => {
    await apiClient.delete(`/chapters/${chapterId}`);
};

/**
 * 更新一个卷下所有章节的排序。
 * @param volumeId - 卷的ID。
 * @param orderedChapterIds - 按新顺序排列的章节ID数组。
 */
export const updateChapterOrder = async (volumeId: string, orderedChapterIds: string[]): Promise<void> => {
    await apiClient.put(`/volumes/${volumeId}/chapters/order`, { orderedChapterIds });
};