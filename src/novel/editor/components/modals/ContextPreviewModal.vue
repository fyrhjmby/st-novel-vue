<template>
  <div v-if="store.isVisible" class="modal-overlay">
    <div class="modal-container">
      <!-- Modal Header -->
      <header class="modal-header">
        <div>
          <h2 class="modal-title">AI 任务确认</h2>
          <p v-if="store.task" class="modal-subtitle">即将为 <span class="font-semibold text-gray-700">《{{ store.task.title }}》</span> 执行 <span class="font-semibold text-gray-700">【{{ store.task.type }}】</span> 任务</p>
        </div>
        <button @click="store.hide()" class="modal-close-button">
          <i class="fa-solid fa-times"></i>
        </button>
      </header>

      <!-- Loading State -->
      <div v-if="store.isLoading" class="modal-loading-state">
        <i class="fa-solid fa-spinner fa-spin text-3xl text-gray-400"></i>
        <p class="mt-4 text-gray-500">正在构建上下文...</p>
      </div>

      <!-- Content State with Collapsible Panels -->
      <div v-else-if="store.previewContent" class="modal-content-wrapper">
        <div v-for="panel in panels" :key="panel.id" class="result-group">
          <div @click="toggleExpansion(panel.id)" class="result-header">
            <div class="flex items-center gap-3 min-w-0">
              <i class="fa-solid fa-chevron-right expand-icon" :class="{ 'expanded': expandedPanelIds.has(panel.id) }"></i>
              <span class="font-medium truncate">{{ panel.name }}</span>
            </div>
            <span class="match-count">{{ formatCharCount(store.previewContent.stats[panel.statKey]) }}</span>
          </div>
          <div v-show="expandedPanelIds.has(panel.id)" class="match-list-style-body">
            <div v-if="panel.id === 'prompt'">
              <pre class="prompt-preview">{{ store.previewContent.prompt }}</pre>
            </div>
            <div v-else class="prose prose-sm max-w-none" v-html="store.previewContent[panel.id] || emptyStateHtml(panel.name)"></div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <footer class="modal-footer">
        <div v-if="store.previewContent" class="stats-summary">
          总计上下文: {{ totalCharCount }} 字
        </div>
        <button @click="store.hide()" class="button-secondary">取消</button>
        <button @click="store.execute()" :disabled="store.isLoading" class="button-primary">
          <i v-if="store.isLoading" class="fa-solid fa-spinner fa-spin mr-2"></i>
          确认执行
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useContextPreviewStore } from '@/novel/editor/stores/contextPreviewStore';
import type { ContextBuildResult } from '@/novel/editor/types';

type PanelId = 'fixed' | 'dynamic' | 'rag' | 'prompt';

const store = useContextPreviewStore();
const expandedPanelIds = ref(new Set<PanelId>());

const panels = ref([
  { id: 'fixed', name: '固定上下文', statKey: 'fixedCharCount' },
  { id: 'dynamic', name: '动态上下文', statKey: 'dynamicCharCount' },
  { id: 'rag', name: 'RAG检索', statKey: 'ragCharCount' },
  { id: 'prompt', name: '最终提示词', statKey: 'promptCharCount' },
] as const);

watch(() => store.previewContent, (newContent) => {
  if (newContent) {
    // Default expand 'fixed' panel only.
    expandedPanelIds.value.clear();
    expandedPanelIds.value.add('fixed');
  }
}, { immediate: true });


const toggleExpansion = (panelId: PanelId) => {
  if (expandedPanelIds.value.has(panelId)) {
    expandedPanelIds.value.delete(panelId);
  } else {
    expandedPanelIds.value.add(panelId);
  }
};

const formatCharCount = (count: number) => {
  if (count > 1000) return `${(count / 1000).toFixed(1)}k`;
  return count;
};

const totalCharCount = computed(() => {
  if (!store.previewContent?.stats) return 0;
  const { fixedCharCount, dynamicCharCount, ragCharCount } = store.previewContent.stats;
  const total = fixedCharCount + dynamicCharCount + ragCharCount;
  return formatCharCount(total);
});

const emptyStateHtml = (contextType: string) => {
  return `<p class="text-gray-400 italic p-4">未配置或未找到${contextType}内容。</p>`;
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(4px);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-container {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  width: 60vw;
  height: 85vh;
  max-width: 960px;
  max-height: 800px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
}

.modal-title { font-size: 1.125rem; font-weight: 600; color: #111827; }
.modal-subtitle { font-size: 0.875rem; color: #6b7280; margin-top: 0.25rem; }
.modal-subtitle .font-semibold { color: #4B5563; }
.modal-close-button { color: #9ca3af; padding: 0.5rem; margin: -0.5rem; border-radius: 9999px; transition: background-color 0.2s, color 0.2s; }
.modal-close-button:hover { background-color: #f3f4f6; color: #1f2937; }

.modal-loading-state {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
}

.modal-content-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  background-color: #FFFFFF;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.modal-content-wrapper::-webkit-scrollbar {
  display: none; /* Chrome, Safari, and Opera */
}

.result-group { margin-bottom: 0.75rem; }
.result-header { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; border-radius: 0.5rem; cursor: pointer; background-color: #F9FAFB; transition: background-color 0.2s; }
.result-header:hover { background-color: #F3F4F6; }
.expand-icon { transition: transform 0.2s ease; color: #9CA3AF; }
.expand-icon.expanded { transform: rotate(90deg); }
.match-count { margin-left: auto; font-size: 0.75rem; background-color: #E5E7EB; color: #4B5563; padding: 0.125rem 0.5rem; border-radius: 99px; flex-shrink: 0; }
.match-list-style-body { padding-left: 2rem; margin-top: 0.5rem; border-left: 1px solid #F3F4F6; margin-left: 0.9rem; padding-bottom: 0.5rem; }

.prompt-preview {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: inherit;
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.6;
  padding-top: 0.5rem;
}
.prose {
  margin-top: 0.75rem;
  padding-left: 0.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
  background-color: #f9fafb;
  flex-shrink: 0;
}
.stats-summary { margin-right: auto; font-size: 0.875rem; color: #6b7280; }
.button-secondary { padding: 0.5rem 1rem; background-color: white; border: 1px solid #d1d5db; border-radius: 0.5rem; font-weight: 500; color: #374151; transition: background-color 0.2s; }
.button-secondary:hover { background-color: #f9fafb; }

.button-primary {
  padding: 0.5rem 1rem;
  background-color: #4B5563;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  font-weight: 500;
  color: white;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
}
.button-primary:hover {
  background-color: #374151;
}
.button-primary:disabled {
  background-color: #9CA3AF;
  cursor: not-allowed;
}
</style>