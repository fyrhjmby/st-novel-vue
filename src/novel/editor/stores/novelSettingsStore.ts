import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useMetadataStore } from '@novel/editor/stores/editor-state/metadataStore';
import { novelSettingsService } from '@/novel/editor/services/novelSettingsService';
import type { NovelProject } from '@/novel/editor/types/project';
import type { NovelMetadata } from '@/novel/editor/types';

export const useNovelSettingsStore = defineStore('novel-settings', () => {
    const metadataStore = useMetadataStore();

    const novelMetadata = ref<NovelMetadata | null>(null);
    const referencedNovels = ref<NovelProject[]>([]);
    const availableReferenceNovels = ref<NovelProject[]>([]);

    /**
     * Asynchronously loads and populates all data needed for the settings view.
     */
    async function loadSettingsData() {
        const meta = metadataStore.novelMetadata;
        novelMetadata.value = meta;
        if (meta) {
            referencedNovels.value = await novelSettingsService.getReferencedNovels(meta.referenceNovelIds);
            availableReferenceNovels.value = await novelSettingsService.getAvailableReferenceNovels(meta);
        } else {
            referencedNovels.value = [];
            availableReferenceNovels.value = await novelSettingsService.getAvailableReferenceNovels(null);
        }
    }

    const addReferenceNovel = async (novelId: string) => {
        if (!novelId) return;
        metadataStore.addReferenceNovel(novelId);
        await loadSettingsData();
    };

    const removeReferenceNovel = async (novelId: string) => {
        metadataStore.removeReferenceNovel(novelId);
        await loadSettingsData();
    };

    const addTag = () => {
        metadataStore.addTag();
    };

    const removeTag = (index: number) => {
        metadataStore.removeTag(index);
    };

    const saveMetadata = () => {
        metadataStore.saveMetadata();
    };

    const resetMetadata = async () => {
        if (metadataStore.currentNovelId) {
            await metadataStore.fetchNovelData(metadataStore.currentNovelId);
        }
    };

    return {
        novelMetadata,
        referencedNovels,
        availableReferenceNovels,
        loadSettingsData,
        addReferenceNovel,
        removeReferenceNovel,
        addTag,
        removeTag,
        saveMetadata,
        resetMetadata,
    };
});