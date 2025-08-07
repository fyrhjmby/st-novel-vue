import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { EditorItem, EditorUIState } from '@/novel/editor/types';

export const useUIStore = defineStore('ui', () => {
    const editingNodeId = ref<string | null>(null);
    const uiState = ref<EditorUIState>({
        expandedNodeIds: new Set(),
        expandedRelatedNodeIds: new Set(),
        autoOpenAIPanel: true,
        activeTheme: 'default',
        concurrentTaskLimit: 3, // 新增：默认并发数为3
        taskApplicationStrategy: {
            mode: 'manual', // 'manual', 'auto', 'delayed'
            delaySeconds: 3,
        },
    });

    // Reader Mode State
    const isReaderModeVisible = ref(false);
    const readerModeItem = ref<EditorItem | null>(null);

    const setEditingNodeId = (id: string | null) => {
        editingNodeId.value = id;
    };

    const setAutoOpenAIPanel = (value: boolean) => {
        uiState.value.autoOpenAIPanel = value;
    };

    const setTheme = (theme: 'default' | 'eye-care' | 'dark') => {
        uiState.value.activeTheme = theme;
    };

    const setConcurrentTaskLimit = (limit: number) => {
        const newLimit = Math.max(1, Math.floor(limit)); // 保证至少为1
        uiState.value.concurrentTaskLimit = newLimit;
    };

    const setTaskApplicationStrategy = (strategy: EditorUIState['taskApplicationStrategy']) => {
        uiState.value.taskApplicationStrategy = strategy;
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

    const ensureRelatedNodeIsExpanded = (nodeId: string) => {
        if (!uiState.value.expandedRelatedNodeIds.has(nodeId)) {
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
        setAutoOpenAIPanel,
        setTheme,
        setConcurrentTaskLimit,
        setTaskApplicationStrategy,
        toggleNodeExpansion,
        toggleRelatedNodeExpansion,
        ensureRelatedNodeIsExpanded,
        showReaderMode,
        hideReaderMode,
    };
});