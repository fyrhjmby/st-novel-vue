<template>
  <div class="search-view-container">
    <div class="search-header">
      <div class="search-bar">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input
            v-model="searchStore.searchQuery"
            type="text"
            placeholder="在所有文档中搜索..."
            class="search-input"
        />
        <button v-if="searchStore.searchQuery" @click="searchStore.clearSearch" class="clear-button" title="清空搜索">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
    </div>

    <div class="results-container">
      <div v-if="searchStore.results.length > 0">
        <div v-for="result in searchStore.results" :key="result.id" class="result-group">
          <div @click="toggleExpansion(result.id)" class="result-header">
            <div class="flex items-center gap-3 min-w-0">
              <i class="fa-solid fa-chevron-right expand-icon" :class="{ 'expanded': expandedResultIds.has(result.id) }"></i>
              <i :class="[result.icon, 'text-base']"></i>
              <span class="font-medium truncate">{{ result.title }}</span>
            </div>
            <span class="match-count">{{ result.matches.length }}个匹配</span>
          </div>
          <ul v-show="expandedResultIds.has(result.id)" class="match-list">
            <li
                v-for="(match, index) in result.matches"
                :key="index"
                @click="handleResultClick(result.id)"
                class="match-item"
                v-html="match.context"
            >
            </li>
          </ul>
        </div>
      </div>
      <div v-else-if="searchStore.hasSearched" class="empty-state">
        <i class="fa-regular fa-face-sad-tear text-4xl text-gray-400"></i>
        <p class="mt-4 text-gray-500">未找到与 "{{ searchStore.lastSearchedQuery }}" 相关的内容。</p>
      </div>
      <div v-else class="empty-state">
        <i class="fa-solid fa-text-slash text-4xl text-gray-300"></i>
        <p class="mt-4 text-gray-500">输入关键词开始搜索。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useSearchStore } from '@novel/editor/stores/searchStore.ts';
import { useEditorStore } from '@novel/editor/stores/editorStore.ts';

const searchStore = useSearchStore();
const editorStore = useEditorStore();
const expandedResultIds = ref(new Set<string>());

let debounceTimer: number | undefined;

watch(() => searchStore.searchQuery, (newQuery) => {
  clearTimeout(debounceTimer);
  if (!newQuery.trim()) {
    searchStore.clearSearch();
    return;
  }
  debounceTimer = window.setTimeout(() => {
    expandedResultIds.value.clear(); // Clear old expansions
    searchStore.performSearch(newQuery);
    // Do not auto-expand results to match the new UI. Let the user decide.
  }, 300); // 300ms debounce delay
});

const handleResultClick = (itemId: string) => {
  editorStore.openTab(itemId);
};

const toggleExpansion = (resultId: string) => {
  if (expandedResultIds.value.has(resultId)) {
    expandedResultIds.value.delete(resultId);
  } else {
    expandedResultIds.value.add(resultId);
  }
};
</script>

<style scoped>
.search-view-container { display: flex; flex-direction: column; height: 100%; background-color: #FFFFFF; }
.search-header { display: flex; gap: 0.75rem; padding: 1.5rem 2rem; border-bottom: 1px solid #E5E7EB; flex-shrink: 0; align-items: center; }
.search-bar { position: relative; flex-grow: 1; }
.search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #9CA3AF; }
.search-input { width: 100%; background-color: #F9FAFB; border: 1px solid #D1D5DB; border-radius: 0.5rem; padding: 0.75rem 2.5rem 0.75rem 2.75rem; font-size: 1rem; outline: none; transition: all 0.2s; }
.search-input:focus { border-color: #3B82F6; background-color: #FFFFFF; box-shadow: 0 0 0 1px #3B82F6; }
.clear-button { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); color: #9CA3AF; width: 1.75rem; height: 1.75rem; display: flex; align-items: center; justify-content: center; border-radius: 99px; cursor: pointer; }
.clear-button:hover { background-color: #E5E7EB; color: #4B5563; }
.results-container { flex-grow: 1; overflow-y: auto; padding: 1.5rem 2rem; }
.result-group { margin-bottom: 0.75rem; }
.result-header { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; border-radius: 0.5rem; cursor: pointer; background-color: #F9FAFB; transition: background-color 0.2s; }
.result-header:hover { background-color: #F3F4F6; }
.expand-icon { transition: transform 0.2s ease; color: #9CA3AF; }
.expand-icon.expanded { transform: rotate(90deg); }
.match-count { margin-left: auto; font-size: 0.75rem; background-color: #E5E7EB; color: #4B5563; padding: 0.125rem 0.5rem; border-radius: 99px; flex-shrink: 0; }
.match-list { padding-left: 2rem; margin-top: 0.5rem; border-left: 1px solid #F3F4F6; margin-left: 0.9rem; }
.match-item { font-size: 0.875rem; color: #6B7280; padding: 0.6rem; border-radius: 0.375rem; cursor: pointer; line-height: 1.6; }
.match-item:hover { background-color: #F3F4F6; color: #1F2937; }
.match-item :deep(mark) { background-color: #FEF3C7; color: #92400E; font-weight: 600; padding: 1px 0; border-radius: 2px; }
.empty-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; }
.results-container { scrollbar-width: thin; scrollbar-color: #D1D5DB #ffffff; }
.results-container::-webkit-scrollbar { width: 6px; }
.results-container::-webkit-scrollbar-track { background: transparent; }
.results-container::-webkit-scrollbar-thumb { background-color: #D1D5DB; border-radius: 3px; }
</style>