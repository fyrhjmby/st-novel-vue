import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useEditorStore } from './editorStore';
import * as historyService from '@/novel/editor/services/historyService';
import { calculateHtmlDiff } from '@/novel/editor/services/diffService';
import type { HistoryVersion } from '@novel/editor/types/historyTypes';
import type { EditorItem } from '@/novel/editor/types';

export const useHistoryStore = defineStore('history', () => {
    const isLoading = ref(false);
    const targetDocument = ref<EditorItem | null>(null);
    const versions = ref<HistoryVersion[]>([]);
    const selectedVersionId = ref<string | null>(null);
    const diffHtml = ref<string>('');

    const headerTitle = computed(() => {
        if (!targetDocument.value) return '版本对比';
        return `《${targetDocument.value.title}》版本对比`;
    });

    const selectedVersion = computed(() => {
        return versions.value.find(v => v.id === selectedVersionId.value) || null;
    });

    async function loadHistory(documentId: string) {
        isLoading.value = true;
        diffHtml.value = '';
        versions.value = [];

        const editorStore = useEditorStore();
        const { node } = editorStore.findItemById(documentId);
        targetDocument.value = node;

        if (!node) {
            console.error("History Store: Target document not found.");
            isLoading.value = false;
            return;
        }

        versions.value = await historyService.getHistoryVersions(documentId);

        if (versions.value.length > 0) {
            await selectVersion(versions.value[0].id);
        }

        isLoading.value = false;
    }

    async function selectVersion(versionId: string) {
        if (!targetDocument.value || !('content' in targetDocument.value)) return;

        selectedVersionId.value = versionId;
        const versionToCompare = selectedVersion.value;

        if (!versionToCompare) {
            diffHtml.value = '<p>错误：找不到选中的历史版本。</p>';
            return;
        }

        const currentContent = targetDocument.value.content;
        const historicalContent = versionToCompare.content;

        diffHtml.value = calculateHtmlDiff(historicalContent, currentContent);
    }

    async function restoreSelectedVersion() {
        if (!targetDocument.value || !selectedVersion.value) {
            alert('恢复失败：未找到目标文档或选中版本。');
            return;
        }

        isLoading.value = true;
        try {
            await historyService.restoreVersion(targetDocument.value.id, selectedVersion.value.id);
            // 成功信息由 service 层显示
            // 重新加载历史记录以反映最新状态
            await loadHistory(targetDocument.value.id);
        } catch (error) {
            console.error('Failed to restore version:', error);
            alert('恢复失败，请查看控制台获取更多信息。');
        } finally {
            isLoading.value = false;
        }
    }

    return {
        isLoading,
        targetDocument,
        versions,
        selectedVersionId,
        diffHtml,
        headerTitle,
        selectedVersion,
        loadHistory,
        selectVersion,
        restoreSelectedVersion,
    };
});