import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { NovelMetadata } from '@/novel/editor/types';
import { mockNovelMetadata, mockDirectoryData, mockSettingsData, mockPlotCustomData, mockAnalysisCustomData, mockNoteData } from '@/novel/editor/data';
import { useDirectoryStore } from '../directoryStore';
import { useRelatedContentStore } from '../relatedContentStore';
import { useNotesStore } from '../notesStore';
import { useUIStore } from '../uiStore';
import { usePaneStore } from './paneStore';
import { useTabStore } from './tabStore';

export const useMetadataStore = defineStore('editor-metadata', () => {
    const novelMetadata = ref<NovelMetadata | null>(null);

    function fetchNovelData(novelId: string) {
        console.log(`Fetching data for novel: ${novelId}`);
        const directoryStore = useDirectoryStore();
        const relatedContentStore = useRelatedContentStore();
        const notesStore = useNotesStore();
        const uiStore = useUIStore();
        const paneStore = usePaneStore();
        const tabStore = useTabStore();

        directoryStore.fetchDirectoryData(mockDirectoryData);
        relatedContentStore.fetchRelatedData(mockSettingsData, mockPlotCustomData, mockAnalysisCustomData);
        notesStore.fetchNotes(mockNoteData);
        novelMetadata.value = JSON.parse(JSON.stringify(mockNovelMetadata));

        paneStore.initializePanes();
        tabStore.openTab('ch-3');

        uiStore.uiState.expandedNodeIds.add('vol-1');
        uiStore.uiState.expandedRelatedNodeIds.add('settings');
        uiStore.uiState.expandedRelatedNodeIds.add('characters');
        uiStore.uiState.expandedRelatedNodeIds.add('plot');
        uiStore.uiState.expandedRelatedNodeIds.add('analysis');
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

    function saveMetadata() {
        if (!novelMetadata.value) return;
        console.log('Saving metadata:', JSON.parse(JSON.stringify(novelMetadata.value)));
        alert('小说设置已保存！');
    }

    return {
        novelMetadata,
        fetchNovelData,
        removeTag,
        addTag,
        saveMetadata,
    };
});