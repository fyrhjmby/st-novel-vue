import { defineStore } from 'pinia';
import { ref } from 'vue';
import { projectLoaderService } from '@novel/editor/services/novelLoaderService.ts';
import type { NovelMetadata } from '@/novel/editor/types/project';
import { useReferenceStore } from '../referenceStore';
import { updateNovelMetadata } from '../../api/metadataApi';

export const useMetadataStore = defineStore('editor-metadata', () => {
    const novelMetadata = ref<NovelMetadata | null>(null);
    const currentNovelId = ref<string | null>(null);

    // --- Actions (Public API for components) ---

    async function fetchNovelData(novelId: string) {
        await projectLoaderService.loadProjectIntoEditor(novelId);
    }

    async function saveMetadata() {
        if (!currentNovelId.value || !novelMetadata.value) {
            console.error("保存失败：未加载小说。");
            alert('保存失败，请查看控制台获取更多信息。');
            return;
        }

        try {
            await updateNovelMetadata(currentNovelId.value, novelMetadata.value);
            alert('小说设置已保存！');
        } catch (error) {
            console.error("保存元数据失败:", error);
            alert('保存失败，请稍后重试。');
        }
    }

    // --- State Modifiers (Internal, called by services or other actions) ---

    function _setNovelMetadata(data: NovelMetadata) {
        novelMetadata.value = JSON.parse(JSON.stringify(data));
    }

    function _setCurrentNovelId(id: string) {
        currentNovelId.value = id;
    }

    function addReferenceNovel(novelIdToAdd: string) {
        if (!novelMetadata.value || novelMetadata.value.referenceNovelIds.includes(novelIdToAdd)) {
            return;
        }
        novelMetadata.value.referenceNovelIds.push(novelIdToAdd);
        const referenceStore = useReferenceStore();
        referenceStore.loadReferences(novelMetadata.value.referenceNovelIds);
    }

    function removeReferenceNovel(novelIdToRemove: string) {
        if (!novelMetadata.value) {
            return;
        }
        const index = novelMetadata.value.referenceNovelIds.indexOf(novelIdToRemove);
        if (index > -1) {
            novelMetadata.value.referenceNovelIds.splice(index, 1);
            const referenceStore = useReferenceStore();
            referenceStore.loadReferences(novelMetadata.value.referenceNovelIds);
        }
    }

    function removeTag(tagIndex: number) {
        if (novelMetadata.value) {
            novelMetadata.value.tags.splice(tagIndex, 1);
        }
    }

    function addTag() {
        if (!novelMetadata.value) return;
        const newTagText = prompt("输入新标签:");
        if (newTagText?.trim()) {
            novelMetadata.value.tags.push({ text: newTagText, class: 'bg-gray-100 text-gray-800' });
        }
    }

    return {
        // State
        novelMetadata,
        currentNovelId,
        // Actions
        fetchNovelData,
        addReferenceNovel,
        removeReferenceNovel,
        removeTag,
        addTag,
        saveMetadata,
        // Internal Setters
        _setNovelMetadata,
        _setCurrentNovelId,
    };
});