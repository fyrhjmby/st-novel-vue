import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { EditorUIState, EditorItem, ContextItem } from '@/novel/editor/types';

export const useUIStore = defineStore('ui', () => {
    const editingNodeId = ref<string | null>(null);
    const uiState = ref<EditorUIState>({
        expandedNodeIds: new Set(),
        expandedRelatedNodeIds: new Set(),
        needsPreview: false,
        autoOpenAIPanel: true,
        activeTheme: 'default',
        taskApplicationStrategy: {
            mode: 'manual', // 'manual', 'auto', 'delayed'
            delaySeconds: 3,
        },
        customContextContent: '',
        dynamicContextSettings: { prevChapters: 3, nextChapters: 2, prevVolumes: 1, nextVolumes: 1 },
        isRagEnabled: true,
        selectedContextItems: []
    });

    // Reader Mode State
    const isReaderModeVisible = ref(false);
    const readerModeItem = ref<EditorItem | null>(null);

    const setEditingNodeId = (id: string | null) => {
        editingNodeId.value = id;
    };

    const setNeedsPreview = (value: boolean) => {
        uiState.value.needsPreview = value;
    }

    const setAutoOpenAIPanel = (value: boolean) => {
        uiState.value.autoOpenAIPanel = value;
    };

    const setTheme = (theme: 'default' | 'eye-care' | 'dark') => {
        uiState.value.activeTheme = theme;
    };

    const setTaskApplicationStrategy = (strategy: EditorUIState['taskApplicationStrategy']) => {
        uiState.value.taskApplicationStrategy = strategy;
    };

    const setCustomContextContent = (content: string) => {
        uiState.value.customContextContent = content;
    }

    const setDynamicContextSettings = (settings: { prevChapters: number, nextChapters: number, prevVolumes: number, nextVolumes: number }) => {
        uiState.value.dynamicContextSettings = settings;
    }

    const setRagEnabled = (value: boolean) => {
        uiState.value.isRagEnabled = value;
    }

    const addFixedContextItem = (item: ContextItem) => {
        if (!uiState.value.selectedContextItems.some(i => i.id === item.id)) {
            uiState.value.selectedContextItems.push({
                ...item,
                wordCount: item.content.length // Simple word count for now
            });
        }
    };

    const removeFixedContextItem = (index: number) => {
        uiState.value.selectedContextItems.splice(index, 1);
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

    const showReaderMode = (item: EditorItem) => {
        readerModeItem.value = item;
        isReaderModeVisible.value = true;
    };

    const hideReaderMode = () => {
        isReaderModeVisible.value = false;
        readerModeItem.value = null;
    };

    return {
        editingNodeId,
        uiState,
        isReaderModeVisible,
        readerModeItem,
        setEditingNodeId,
        setNeedsPreview,
        setAutoOpenAIPanel,
        setTheme,
        setTaskApplicationStrategy,
        setCustomContextContent,
        setDynamicContextSettings,
        setRagEnabled,
        addFixedContextItem,
        removeFixedContextItem,
        toggleNodeExpansion,
        toggleRelatedNodeExpansion,
        showReaderMode,
        hideReaderMode,
    };
});