// 文件: ..\src\novel\editor\stores\modules\metadataStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getNovelProject } from '@/novel/services/novelProjectService';
import type { NovelMetadata } from '@/novel/editor/types/project';
import { useDirectoryStore } from '../directoryStore';
import { useRelatedContentStore } from '../relatedContentStore';
import { useNotesStore } from '../notesStore';
import { useReferenceStore } from '../referenceStore';
import { useUIStore } from '../uiStore';
import { usePaneStore } from './paneStore';
import { useTabStore } from './tabStore';
import { useDerivedContentStore } from '../derivedContentStore';

export const useMetadataStore = defineStore('editor-metadata', () => {
    const novelMetadata = ref<NovelMetadata | null>(null);
    const currentNovelId = ref<string | null>(null);

    function fetchNovelData(novelId: string) {
        console.log(`Fetching data for novel: ${novelId}`);
        const projectData = getNovelProject(novelId);

        if (!projectData) {
            console.error(`Novel project with ID "${novelId}" not found.`);
            return;
        }

        currentNovelId.value = novelId;

        const directoryStore = useDirectoryStore();
        const relatedContentStore = useRelatedContentStore();
        const notesStore = useNotesStore();
        const referenceStore = useReferenceStore();
        const derivedContentStore = useDerivedContentStore();
        const uiStore = useUIStore();
        const paneStore = usePaneStore();
        const tabStore = useTabStore();

        directoryStore.fetchDirectoryData(projectData.directoryData);
        relatedContentStore.fetchRelatedData(
            projectData.settingsData,
            projectData.plotCustomData,
            projectData.analysisCustomData,
            projectData.othersCustomData
        );
        derivedContentStore.fetchDerivedData(
            projectData.derivedPlotData || [],
            projectData.derivedAnalysisData || []
        );
        notesStore.fetchNotes(projectData.noteData);
        novelMetadata.value = JSON.parse(JSON.stringify(projectData.metadata));
        referenceStore.fetchData(projectData.metadata.referenceNovelIds);

        paneStore.initializePanes();
        const firstChapterId = projectData.directoryData[0]?.chapters[0]?.id;
        if (firstChapterId) {
            tabStore.openTab(firstChapterId);
        }

        uiStore.uiState.expandedNodeIds.clear();
        uiStore.uiState.expandedRelatedNodeIds.clear();
        uiStore.uiState.expandedReferenceNodeIds.clear();

        if (projectData.directoryData.length > 0) {
            uiStore.uiState.expandedNodeIds.add(projectData.directoryData[0].id);
        }
        uiStore.uiState.expandedRelatedNodeIds.add('setting');
        uiStore.uiState.expandedRelatedNodeIds.add('characters');
        uiStore.uiState.expandedRelatedNodeIds.add('plot');
        uiStore.uiState.expandedRelatedNodeIds.add('analysis');
        uiStore.uiState.expandedRelatedNodeIds.add('others');
        if (projectData.metadata.referenceNovelIds.length > 0) {
            const firstRefBookId = `ref-book-${projectData.metadata.referenceNovelIds[0]}`;
            uiStore.uiState.expandedReferenceNodeIds.add(firstRefBookId);
        }
    }

    function addReferenceNovel(novelIdToAdd: string) {
        if (!novelMetadata.value || novelMetadata.value.referenceNovelIds.includes(novelIdToAdd)) {
            return;
        }
        novelMetadata.value.referenceNovelIds.push(novelIdToAdd);
        const referenceStore = useReferenceStore();
        referenceStore.fetchData(novelMetadata.value.referenceNovelIds);
    }

    function removeReferenceNovel(novelIdToRemove: string) {
        if (!novelMetadata.value) {
            return;
        }
        const index = novelMetadata.value.referenceNovelIds.indexOf(novelIdToRemove);
        if (index > -1) {
            novelMetadata.value.referenceNovelIds.splice(index, 1);
            const referenceStore = useReferenceStore();
            referenceStore.fetchData(novelMetadata.value.referenceNovelIds);
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

    function saveMetadata() {
        if (!novelMetadata.value) return;
        console.log('Saving metadata:', JSON.parse(JSON.stringify(novelMetadata.value)));
        alert('小说设置已保存！');
    }

    return {
        novelMetadata,
        currentNovelId,
        fetchNovelData,
        addReferenceNovel,
        removeReferenceNovel,
        removeTag,
        addTag,
        saveMetadata,
    };
});