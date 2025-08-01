import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { SearchResult, EditorItem, TreeNode } from '@/novel/editor/types';
import { useDirectoryStore } from './directoryStore';
import { useRelatedContentStore } from './relatedContentStore';
import { useNotesStore } from './notesStore';
import { getIconByNodeType } from '@/novel/editor/utils/iconUtils';

export const useSearchStore = defineStore('search', () => {
    const searchQuery = ref('');
    const lastSearchedQuery = ref('');
    const hasSearched = ref(false);
    const results = ref<SearchResult[]>([]);

    const clearSearch = () => {
        searchQuery.value = '';
        lastSearchedQuery.value = '';
        hasSearched.value = false;
        results.value = [];
    };

    const performSearch = (query: string) => {
        results.value = [];
        hasSearched.value = true;
        lastSearchedQuery.value = query;

        if (!query || query.trim().length < 1) {
            return;
        }

        const lowerCaseQuery = query.toLowerCase();
        const resultsMap = new Map<string, SearchResult>();
        const tempDiv = document.createElement('div');

        const directoryStore = useDirectoryStore();
        const relatedContentStore = useRelatedContentStore();
        const notesStore = useNotesStore();

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

        directoryStore.directoryData.forEach(vol => vol.chapters.forEach(processItem));

        const flattenRelated = (nodes: TreeNode[]) => {
            nodes.forEach(node => {
                if ('content' in node && node.content) {
                    processItem(node as EditorItem);
                }
                if (node.children) flattenRelated(node.children);
            });
        };
        flattenRelated(relatedContentStore.settingsData);
        flattenRelated(relatedContentStore.plotCustomData);
        flattenRelated(relatedContentStore.analysisCustomData);

        notesStore.notes.forEach(processItem);

        results.value = Array.from(resultsMap.values());
    };

    return {
        searchQuery,
        lastSearchedQuery,
        hasSearched,
        results,
        performSearch,
        clearSearch
    };
});