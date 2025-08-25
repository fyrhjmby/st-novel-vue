// ..\src\novel\editor\api\historyApi.ts
import apiClient from '@/api/client';
import type { HistoryVersion } from '@novel/editor/types/historyTypes';

/**
 * 根据文档ID获取其历史版本列表。
 * @param documentId - 文档的ID (例如章节ID, 卷ID等)
 * @returns 返回历史版本快照列表。
 */
export const fetchHistoryForDocument = async (documentId: string): Promise<HistoryVersion[]> => {
    const response = await apiClient.get(`/documents/${documentId}/history`);
    return response.data;
};

/**
 * 将指定文档恢复到某个历史版本。
 * @param documentId - 要恢复的文档ID。
 * @param versionId - 要恢复到的版本ID。
 */
export const restoreVersion = async (documentId: string, versionId: string): Promise<void> => {
    await apiClient.post(`/documents/${documentId}/history/${versionId}/restore`);
};