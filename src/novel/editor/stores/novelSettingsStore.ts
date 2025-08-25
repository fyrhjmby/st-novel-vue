// 文件: ..\src/novel\editor\stores\novelSettingsStore.ts
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useMetadataStore } from '@novel/editor/stores/editor-state/metadataStore';
import { novelSettingsService } from '@/novel/editor/services/novelSettingsService';
import type { NovelProject } from '@/novel/editor/types/project';
import type { NovelMetadata } from '@/novel/editor/types';
import { useReferenceStore } from './referenceStore';

export const useNovelSettingsStore = defineStore('novel-settings', () => {
    const metadataStore = useMetadataStore();

    const novelMetadata = computed<NovelMetadata | null>(() => metadataStore.novelMetadata);
    const referencedNovels = ref<NovelProject[]>([]);
    const availableReferenceNovels = ref<NovelProject[]>([]);

    async function loadSettingsData() {
        const meta = metadataStore.novelMetadata;
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
        if(metadataStore.novelMetadata) {
            await useReferenceStore().loadReferences(metadataStore.novelMetadata.referenceNovelIds);
        }
    };

    const removeReferenceNovel = async (novelId: string) => {
        metadataStore.removeReferenceNovel(novelId);
        await loadSettingsData();
        if(metadataStore.novelMetadata) {
            await useReferenceStore().loadReferences(metadataStore.novelMetadata.referenceNovelIds);
        }
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