import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { EditorUIState, SearchResult, EditorItem, RelatedTree, ContextItem } from '@/novel/editor/types';
import { useDirectoryStore } from './directoryStore';
import { useRelatedContentStore } from './relatedContentStore';
import { useNotesStore } from './notesStore';
import { getIconByNodeType } from '@/novel/editor/utils/iconUtils';

export const useUIStore = defineStore('ui', () => {
    const editingNodeId = ref<string | null>(null);
    const searchResults = ref<SearchResult[]>([]);
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

    const searchAllDocuments = (query: string) => {
        searchResults.value = [];
        if (!query || query.trim().length < 1) return;

        const lowerCaseQuery = query.toLowerCase();
        const resultsMap = new Map<string, SearchResult>();
        const tempDiv = document.createElement('div');

        const processItem = (item: EditorItem) => {
            if (item.type === 'system' || !('content' in item) || !item.content) return;

            tempDiv.innerHTML = item.content;
            const textContent = tempDiv.textContent || '';
            const lowerCaseText = textContent.toLowerCase();

            if (lowerCaseText.includes(lowerCaseQuery)) {
                if (!resultsMap.has(item.id)) {
                    resultsMap.set(item.id, {
                        id: item.id,
                        title: item.title,
                        icon: getIconByNodeType(item.type),
                        item: item,
                        matches: []
                    });
                }

                const result = resultsMap.get(item.id)!;
                const regex = new RegExp(`(.{0,30})(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(.{0,30})`, 'gi');
                let match;
                while ((match = regex.exec(textContent)) !== null) {
                    if (result.matches.length >= 5) break; // Limit matches per item
                    const context = `${match[1]}<mark>${match[2]}</mark>${match[3]}`;
                    result.matches.push({ context: `...${context}...` });
                }
            }
        };

        const directoryStore = useDirectoryStore();
        directoryStore.directoryData.forEach(vol => vol.chapters.forEach(processItem));

        const relatedContentStore = useRelatedContentStore();
        const flattenRelated = (nodes: RelatedTree[]) => {
            nodes.forEach(node => {
                processItem(node);
                if (node.children) flattenRelated(node.children);
            });
        };
        flattenRelated(relatedContentStore.relatedData);

        const notesStore = useNotesStore();
        notesStore.notes.forEach(processItem);

        searchResults.value = Array.from(resultsMap.values());
    };

    const clearSearchResults = () => {
        searchResults.value = [];
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
        searchResults,
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
        searchAllDocuments,
        clearSearchResults,
        showReaderMode,
        hideReaderMode,
    };
});