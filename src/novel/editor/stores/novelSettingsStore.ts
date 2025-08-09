import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useMetadataStore } from '@novel/editor/stores/editor-state/metadataStore';
import { novelSettingsService } from '@/novel/editor/services/novelSettingsService';
import type { NovelProject } from '@/novel/editor/types/project';
import type { NovelMetadata } from '@/novel/editor/types';

export const useNovelSettingsStore = defineStore('novel-settings', () => {
    const metadataStore = useMetadataStore();

    // State: No longer computed, but refs updated by an action.
    const novelMetadata = ref<NovelMetadata | null>(null);
    const referencedNovels = ref<NovelProject[]>([]);
    const availableReferenceNovels = ref<NovelProject[]>([]);

    /**
     * Loads and populates all data needed for the settings view.
     * This is the central point for refreshing the store's state.
     */
    function loadSettingsData() {
        const meta = metadataStore.novelMetadata;
        novelMetadata.value = meta;
        if (meta) {
            referencedNovels.value = novelSettingsService.getReferencedNovels(meta.referenceNovelIds);
            availableReferenceNovels.value = novelSettingsService.getAvailableReferenceNovels(meta);
        } else {
            referencedNovels.value = [];
            availableReferenceNovels.value = novelSettingsService.getAvailableReferenceNovels(null);
        }
    }

    const addReferenceNovel = (novelId: string) => {
        if (!novelId) return;
        metadataStore.addReferenceNovel(novelId);
        // After core data is changed, reload our UI-specific data.
        loadSettingsData();
    };

    const removeReferenceNovel = (novelId: string) => {
        metadataStore.removeReferenceNovel(novelId);
        // After core data is changed, reload our UI-specific data.
        loadSettingsData();
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

    const resetMetadata = () => {
        if (metadataStore.currentNovelId) {
            metadataStore.fetchNovelData(metadataStore.currentNovelId);
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