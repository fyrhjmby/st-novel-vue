<template>
  <div class="search-view-container">
    <div class="search-header">
      <div class="search-bar">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="在所有文档中搜索..."
            class="search-input"
            @keydown.enter="performSearch"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-button" title="清空搜索">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
      <button @click="performSearch" class="search-button">
        搜索
      </button>
    </div>

    <div class="results-container">
      <div v-if="results.length > 0">
        <div v-for="result in results" :key="result.id" class="result-group">
          <div @click="handleResultClick(result.id)" class="result-header">
            <i :class="[result.icon, 'mr-2']"></i>
            <span class="font-medium">{{ result.title }}</span>
            <span class="match-count">{{ result.matches.length }}</span>
          </div>
          <ul class="match-list">
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
      <div v-else-if="hasSearched" class="empty-state">
        <i class="fa-regular fa-face-sad-tear text-4xl text-gray-400"></i>
        <p class="mt-4 text-gray-500">未找到与 "{{ lastSearchedQuery }}" 相关的内容。</p>
      </div>
      <div v-else class="empty-state">
        <i class="fa-solid fa-text-slash text-4xl text-gray-300"></i>
        <p class="mt-4 text-gray-500">输入关键词开始搜索。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUIStore } from '../../stores/uiStore';
import { tabManagementService } from '@core/tabs/service/TabManagementService';

const uiStore = useUIStore();
const searchQuery = ref('');
const lastSearchedQuery = ref('');
const hasSearched = ref(false);
const results = computed(() => uiStore.searchResults);

const performSearch = () => {
  if (!searchQuery.value) return;
  lastSearchedQuery.value = searchQuery.value;
  hasSearched.value = true;
  uiStore.searchAllDocuments(searchQuery.value);
};

const handleResultClick = (itemId: string) => {
  tabManagementService.openTab(itemId);
};

const clearSearch = () => {
  searchQuery.value = '';
  lastSearchedQuery.value = '';
  hasSearched.value = false;
  uiStore.clearSearchResults();
};
</script>

<style scoped>
.search-view-container { display: flex; flex-direction: column; height: 100%; background-color: #FFFFFF; }
.search-header { display: flex; gap: 0.75rem; padding: 1.5rem 2rem; border-bottom: 1px solid #E5E7EB; flex-shrink: 0; align-items: center; }
.search-bar { position: relative; flex-grow: 1; }
.search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #9CA3AF; }
.search-input { width: 100%; background-color: #F9FAFB; border: 1px solid #D1D5DB; border-radius: 0.5rem; padding: 0.75rem 2.5rem 0.75rem 2.75rem; font-size: 1rem; outline: none; transition: all 0.2s; }
.search-input:focus { border-color: #3B82F6; background-color: #FFFFFF; box-shadow: 0 0 0 1px #3B82F6; }
.clear-button { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); color: #9CA3AF; width: 1.75rem; height: 1.75rem; display: flex; align-items: center; justify-content: center; border-radius: 99px; }
.clear-button:hover { background-color: #E5E7EB; color: #4B5563; }
.search-button { padding: 0.75rem 1.5rem; background-color: #2563EB; color: white; border-radius: 0.5rem; font-weight: 500; transition: background-color 0.2s; }
.search-button:hover { background-color: #1D4ED8; }
.results-container { flex-grow: 1; overflow-y: auto; padding: 1.5rem 2rem; scrollbar-width: thin; scrollbar-color: #D1D5DB #ffffff; }
.results-container::-webkit-scrollbar { width: 6px; }
.result-group { margin-bottom: 1.5rem; }
.result-header { display: flex; align-items: center; padding: 0.5rem; border-radius: 0.375rem; cursor: pointer; background-color: #F9FAFB; margin-bottom: 0.5rem; }
.result-header:hover { background-color: #F3F4F6; }
.match-count { margin-left: auto; font-size: 0.75rem; background-color: #E5E7EB; color: #4B5563; padding: 0.125rem 0.5rem; border-radius: 99px; }
.match-list { padding-left: 1rem; margin-top: 0.25rem; }
.match-item { font-size: 0.875rem; color: #6B7280; padding: 0.5rem; border-radius: 0.375rem; cursor: pointer; line-height: 1.6; }
.match-item:hover { background-color: #F3F4F6; }
.match-item :deep(mark) { background-color: #FEF3C7; color: #92400E; font-weight: 600; padding: 1px 0; border-radius: 2px; }
.empty-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 2rem; }
</style>