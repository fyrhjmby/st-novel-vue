import * as historyApi from '@/novel/editor/api/historyApi';
import type { HistoryVersion } from '@novel/editor/types/historyTypes';
import { useEditorStore } from '@novel/editor/stores/editorStore';
;

/**
 * 获取指定文档的历史版本列表。
 */
export const getHistoryVersions = async (documentId: string): Promise<HistoryVersion[]> => {
    return await historyApi.fetchHistoryForDocument(documentId);
};

/**
 * 将指定文档恢复到某个历史版本。
 * @param documentId - 要恢复的文档ID。
 * @param versionId - 要恢复到的版本ID。
 */
export const restoreVersion = async (documentId: string, versionId: string): Promise<void> => {
    const editorStore = useEditorStore();
    const novelId = editorStore.novelMetadata?.id;

    if (!novelId) {
        console.error('无法恢复版本：未找到当前小说ID。');
        alert('恢复失败，缺少小说上下文。');
        return;
    }

    await historyApi.restoreVersion(documentId, versionId);

    // 恢复成功后，重新加载整个项目以确保数据一致性
    const { loadProject } = useProjectManager();
    await loadProject(novelId);
};