import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { SearchResult } from '@/novel/editor/types';
import { searchService } from '@/novel/editor/services/searchService';

export const useSearchStore = defineStore('search', () => {
    const searchQuery = ref('');
    const lastSearchedQuery = ref('');
    const hasSearched = ref(false);
    const results = ref<SearchResult[]>([]);

    const performSearch = (query: string) => {
        hasSearched.value = true;
        lastSearchedQuery.value = query;
        results.value = searchService.search(query);
    };

    const clearSearch = () => {
        searchQuery.value = '';
        lastSearchedQuery.value = '';
        hasSearched.value = false;
        results.value = [];
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