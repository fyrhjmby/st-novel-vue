import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { useDirectoryStore } from './directoryStore';
import { useRelatedContentStore } from './relatedContentStore';
import { useNotesStore } from './notesStore';
import { getIconByNodeType } from '../utils/iconUtils';
import type { SearchResult, ContextItem, RelatedTree } from '../types';

type AnyItem = RelatedTree | ReturnType<typeof useDirectoryStore>['directoryData'][0]['chapters'][0] | ReturnType<typeof useNotesStore>['notes'][0];

export const useUIStore = defineStore('novel-ui', () => {
    const editingNodeId = ref<string | null>(null);
    const searchResults = ref<SearchResult[]>([]);

    const uiState = reactive({
        expandedNodeIds: new Set<string>(),
        expandedRelatedNodeIds: new Set<string>(),
        needsPreview: false,
        customContextContent: '',
        dynamicContextSettings: { prevChapters: 3, nextChapters: 2 },
        isRagEnabled: true,
        selectedContextItems: [] as ContextItem[],
    });

    function setEditingNodeId(id: string | null) {
        editingNodeId.value = id;
    }

    function toggleNodeExpansion(nodeId: string) {
        if (uiState.expandedNodeIds.has(nodeId)) {
            uiState.expandedNodeIds.delete(nodeId);
        } else {
            uiState.expandedNodeIds.add(nodeId);
        }
    }

    function toggleRelatedNodeExpansion(nodeId: string) {
        if (uiState.expandedRelatedNodeIds.has(nodeId)) {
            uiState.expandedRelatedNodeIds.delete(nodeId);
        } else {
            uiState.expandedRelatedNodeIds.add(nodeId);
        }
    }

    function addFixedContextItem(item: ContextItem) {
        if (!uiState.selectedContextItems.some(i => i.id === item.id)) {
            uiState.selectedContextItems.push({
                ...item,
                wordCount: item.content.length
            });
        }
    }

    function removeFixedContextItem(index: number) {
        uiState.selectedContextItems.splice(index, 1);
    }

    function searchAllDocuments(query: string) {
        searchResults.value = [];
        if (!query || query.trim().length < 1) return;

        const lowerCaseQuery = query.toLowerCase();
        const resultsMap = new Map<string, SearchResult>();
        const tempDiv = document.createElement('div');

        const processItem = (item: AnyItem) => {
            if (!('content' in item) || !item.content) return;

            tempDiv.innerHTML = item.content;
            const textContent = tempDiv.textContent || '';

            if (textContent.toLowerCase().includes(lowerCaseQuery)) {
                if (!resultsMap.has(item.id)) {
                    resultsMap.set(item.id, {
                        id: item.id,
                        title: item.title,
                        icon: getIconByNodeType(item.type),
                        matches: []
                    });
                }
                const result = resultsMap.get(item.id)!;
                const regex = new RegExp(`(.{0,30})(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(.{0,30})`, 'gi');
                let match;
                while ((match = regex.exec(textContent)) !== null) {
                    if (result.matches.length >= 5) break;
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
    }

    function clearSearchResults() {
        searchResults.value = [];
    }

    return {
        editingNodeId,
        searchResults,
        uiState,
        setEditingNodeId,
        toggleNodeExpansion,
        toggleRelatedNodeExpansion,
        addFixedContextItem,
        removeFixedContextItem,
        searchAllDocuments,
        clearSearchResults
    };
});