import { defineStore, storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useMetadataStore } from './modules/metadataStore';
import { getAllNovelProjects, getNovelProject } from '@/novel/services/novelProjectService';
import type { NovelProject } from '@/novel/editor/types/project';

export const useNovelSettingsStore = defineStore('novel-settings', () => {
    const metadataStore = useMetadataStore();
    const { novelMetadata, currentNovelId } = storeToRefs(metadataStore);

    const referencedNovels = computed((): NovelProject[] => {
        if (!novelMetadata.value?.referenceNovelIds) return [];
        return novelMetadata.value.referenceNovelIds
            .map(id => getNovelProject(id))
            .filter((p): p is NovelProject => p !== undefined);
    });

    const availableReferenceNovels = computed((): NovelProject[] => {
        const allNovels = getAllNovelProjects();
        if (!novelMetadata.value) return allNovels;

        const currentAndReferencedIds = new Set([
            ...novelMetadata.value.referenceNovelIds,
            novelMetadata.value.id
        ]);

        return allNovels.filter(novel => !currentAndReferencedIds.has(novel.metadata.id));
    });

    const addReferenceNovel = (novelId: string) => {
        if (!novelId) return;
        metadataStore.addReferenceNovel(novelId);
    };

    const removeReferenceNovel = (novelId: string) => {
        metadataStore.removeReferenceNovel(novelId);
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
        if (currentNovelId.value) {
            metadataStore.fetchNovelData(currentNovelId.value);
        }
    };

    return {
        novelMetadata,
        referencedNovels,
        availableReferenceNovels,
        addReferenceNovel,
        removeReferenceNovel,
        addTag,
        removeTag,
        saveMetadata,
        resetMetadata,
    };
});