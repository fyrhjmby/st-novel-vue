import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { NovelMetadata } from '@/novel/editor/types/project';
import * as metadataService from '@novel/editor/services/metadataService';

export const useMetadataStore = defineStore('editor-metadata', () => {
    const novelMetadata = ref<NovelMetadata | null>(null);
    const currentNovelId = ref<string | null>(null);

    function reset() {
        novelMetadata.value = null;
        currentNovelId.value = null;
    }

    async function fetchNovelData(novelId: string) {
        try {
            const data = await metadataService.getNovelMetadata(novelId);
            novelMetadata.value = data;
            currentNovelId.value = novelId;
        } catch (error) {
            console.error(`[MetadataStore] Failed to fetch metadata for novel ${novelId}:`, error);
            reset();
            throw error; // Re-throw to be caught by the project loader
        }
    }

    // This is kept for manual saving from the settings page
    async function saveMetadata() {
        if (!currentNovelId.value || !novelMetadata.value) {
            console.error("保存失败：未加载小说。");
            alert('保存失败，请查看控制台获取更多信息。');
            return;
        }
        try {
            await metadataService.updateNovelMetadata(currentNovelId.value, novelMetadata.value);
            alert('小说设置已保存！');
        } catch (error) {
            console.error("保存元数据失败:", error);
            alert('保存失败，请稍后重试。');
        }
    }

    function addReferenceNovel(novelIdToAdd: string) {
        if (!novelMetadata.value || novelMetadata.value.referenceNovelIds.includes(novelIdToAdd)) return;
        novelMetadata.value.referenceNovelIds.push(novelIdToAdd);
    }

    function removeReferenceNovel(novelIdToRemove: string) {
        if (!novelMetadata.value) return;
        const index = novelMetadata.value.referenceNovelIds.indexOf(novelIdToRemove);
        if (index > -1) {
            novelMetadata.value.referenceNovelIds.splice(index, 1);
        }
    }

    function removeTag(tagIndex: number) {
        if (novelMetadata.value) novelMetadata.value.tags.splice(tagIndex, 1);
    }

    function addTag() {
        if (!novelMetadata.value) return;
        const newTagText = prompt("输入新标签:");
        if (newTagText?.trim()) {
            novelMetadata.value.tags.push({ text: newTagText, class: 'bg-gray-100 text-gray-800' });
        }
    }

    return {
        novelMetadata,
        currentNovelId,
        fetchNovelData,
        saveMetadata,
        addReferenceNovel,
        removeReferenceNovel,
        removeTag,
        addTag,
        reset,
    };
});