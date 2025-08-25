// 文件: ..\src\novel\editor\views\HistoryPanel.vue

<template>
  <div class="flex-1 flex flex-col bg-white h-full">
    <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
      <div>
        <h1 class="text-lg font-medium text-[#374151] truncate" :title="historyStore.headerTitle">{{ historyStore.headerTitle }}</h1>
        <p v-if="historyStore.selectedVersion" class="text-sm text-[#6B7280] mt-1">
          当前版本 vs {{ historyStore.selectedVersion.label }} ({{ historyStore.selectedVersion.timestamp }})
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-colors flex items-center gap-2">
          <i class="fa-solid fa-code-compare"></i>
          切换对比
        </button>
        <button
            @click="historyStore.restoreSelectedVersion"
            class="px-4 py-2 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          恢复此版本
        </button>
      </div>
    </header>

    <div class="px-8 py-3 border-b border-gray-100 bg-[#F9FAFB]">
      <div class="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar-horizontal">
        <button class="w-7 h-7 flex-shrink-0 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <div class="flex gap-2">
          <div class="text-xs font-medium px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 flex items-center gap-1.5 cursor-pointer flex-shrink-0">
            <svg class="w-2 h-2" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4"/></svg>
            当前版本
          </div>
          <div
              v-for="version in historyStore.versions"
              :key="version.id"
              @click="historyStore.selectVersion(version.id)"
              class="text-xs font-medium px-2.5 py-1 rounded-md cursor-pointer transition-colors flex-shrink-0"
              :class="historyStore.selectedVersionId === version.id ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            {{ version.label }} • {{ version.timestamp }}
          </div>
        </div>
        <button class="w-7 h-7 flex-shrink-0 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <div class="flex-1 p-8 overflow-y-auto custom-scrollbar">
      <div v-if="historyStore.isLoading" class="text-center text-gray-400 py-10">
        <i class="fa-solid fa-spinner fa-spin mr-2"></i> 加载中...
      </div>
      <div v-else-if="historyStore.targetDocument" class="max-w-3xl mx-auto">
        <div class="text-[#374151] leading-relaxed text-base" v-html="historyStore.diffHtml"></div>
      </div>
      <div v-else class="text-center text-gray-500 py-10">
        无法加载文档历史记录。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType, onMounted } from 'vue';
import { useHistoryStore } from '@novel/editor/stores/historyStore';
import type { TabInfo } from '@novel/editor/types';

const props = defineProps({
  activeTab: {
    type: Object as PropType<TabInfo | null>,
    required: true,
  },
});

const historyStore = useHistoryStore();

const targetDocumentId = computed(() => {
  if (!props.activeTab) return null;
  const parts = props.activeTab.id.split(':');
  return parts.length === 3 ? parts[2] : null;
});

onMounted(() => {
  if (targetDocumentId.value) {
    historyStore.loadHistory(targetDocumentId.value);
  }
});

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  display: block;
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.custom-scrollbar-horizontal::-webkit-scrollbar {
  height: 4px;
}

:deep(.diff-del) {
  background-color: #FEE2E2;
  text-decoration: line-through;
  text-decoration-color: #F87171;
  padding: 2px 1px;
}
:deep(.diff-add) {
  background-color: #D1FAE5;
  text-decoration: none;
  padding: 2px 1px;
}
</style>