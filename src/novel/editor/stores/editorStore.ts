// 文件: src/novel/editor/stores/editorStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { EditorItem, EditorUIState } from '@/novel/editor/types';
import { useDirectoryStore } from './directoryStore';
import { useRelatedContentStore } from './relatedContentStore';
import { useNotesStore } from './notesStore';
import {
    mockDirectoryData,
    mockSettingsData,
    mockPlotCustomData,
    mockAnalysisCustomData,
    mockNoteData
} from '@/novel/editor/data';

export const useEditorStore = defineStore('editor', () => {
    const activeItemId = ref<string | null>(null);
    const editingNodeId = ref<string | null>(null);
    const uiState = ref<EditorUIState>({
        activeInternalTab: 'directory',
        expandedNodeIds: new Set(),
        expandedRelatedNodeIds: new Set(),
        needsPreview: false,
    });

    const activeItem = computed((): EditorItem | null => {
        if (!activeItemId.value) return null;
        return findItemById(activeItemId.value)?.node ?? null;
    });

    const findItemById = (id: string): { node: EditorItem | null; source: 'directory' | 'related' | 'notes' | null } => {
        const directoryStore = useDirectoryStore();
        const relatedContentStore = useRelatedContentStore();
        const notesStore = useNotesStore();

        let result = directoryStore.findNodeById(id);
        if (result?.node) return { node: result.node, source: 'directory' };

        result = relatedContentStore.findNodeById(id);
        if (result?.node) return { node: result.node, source: 'related' };

        const note = notesStore.findNoteById(id);
        if (note) return { node: note, source: 'notes' };

        return { node: null, source: null };
    };

    const updateItemContentById = (id: string, content: string) => {
        const { node, source } = findItemById(id);
        if (!node) return;

        switch (source) {
            case 'directory':
                useDirectoryStore().updateChapterContent(id, content);
                break;
            case 'related':
                useRelatedContentStore().updateNodeContent(id, content);
                break;
            case 'notes':
                useNotesStore().updateNoteContent(id, content);
                break;
        }
    };

    const appendContentToItem = (itemId: string, contentToAppend: string, isAutoApplied: boolean) => {
        const { node, source } = findItemById(itemId);
        if (!node) return;

        if (source === 'directory' && node.type === 'chapter') {
            useDirectoryStore().appendChapterContent(itemId, contentToAppend, isAutoApplied);
        } else if (source === 'related' && 'content' in node) {
            useRelatedContentStore().appendNodeContent(itemId, contentToAppend, isAutoApplied);
        }
    };

    const fetchNovelData = (novelId: string) => {
        console.log(`Fetching data for novel: ${novelId}`);

        // 从模块专属的数据文件导入数据，并分发给各个子store
        useDirectoryStore().fetchDirectoryData(mockDirectoryData);
        useRelatedContentStore().fetchRelatedData(mockSettingsData, mockPlotCustomData, mockAnalysisCustomData);
        useNotesStore().fetchNotes(mockNoteData);

        // 初始化UI状态
        if (!activeItemId.value) {
            activeItemId.value = 'ch-4';
            uiState.value.expandedNodeIds.add('vol-1');
            uiState.value.expandedNodeIds.add('vol-2');
            uiState.value.expandedRelatedNodeIds.add('settings');
            uiState.value.expandedRelatedNodeIds.add('characters');
            uiState.value.expandedRelatedNodeIds.add('worldview');
            uiState.value.expandedRelatedNodeIds.add('plot');
            uiState.value.expandedRelatedNodeIds.add('analysis');
        }
    };

    const setActiveItem = (id: string | null) => {
        activeItemId.value = id;
    };

    const setEditingNodeId = (id: string | null) => {
        editingNodeId.value = id;
    };

    const toggleNodeExpansion = (nodeId: string) => {
        if (uiState.value.expandedNodeIds.has(nodeId)) {
            uiState.value.expandedNodeIds.delete(nodeId);
        } else {
            uiState.value.expandedNodeIds.add(nodeId);
        }
    };

    const toggleRelatedNodeExpansion = (nodeId: string) => {
        if (uiState.value.expandedRelatedNodeIds.has(nodeId)) {
            uiState.value.expandedRelatedNodeIds.delete(nodeId);
        } else {
            uiState.value.expandedRelatedNodeIds.add(nodeId);
        }
    };

    const setActiveInternalTab = (tabId: 'directory' | 'related' | 'notes') => {
        uiState.value.activeInternalTab = tabId;
    };

    return {
        activeItemId,
        editingNodeId,
        uiState,
        activeItem,
        fetchNovelData,
        setActiveItem,
        setEditingNodeId,
        updateItemContentById,
        appendContentToItem,
        toggleNodeExpansion,
        toggleRelatedNodeExpansion,
        setActiveInternalTab,
        findItemById,
    };
});