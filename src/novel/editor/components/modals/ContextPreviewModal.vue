<template>
  <div v-if="store.isVisible" class="modal-overlay">
    <div class="modal-container">
      <!-- Modal Header -->
      <header class="modal-header">
        <div>
          <h2 class="modal-title">AI 任务确认</h2>
          <p class="modal-subtitle">即将为 <span class="font-semibold text-indigo-500">《{{ store.task?.title }}》</span> 执行 <span class="font-semibold text-indigo-500">【{{ store.task?.type }}】</span> 任务</p>
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

      <!-- Content State -->
      <div v-else-if="store.previewContent" class="modal-content-wrapper">
        <!-- Tabs -->
        <nav class="content-tabs">
          <a
              v-for="tab in tabs"
              :key="tab.id"
              href="#"
              @click.prevent="activeTab = tab.id"
              :class="['tab-item', { 'active': activeTab === tab.id }]"
          >
            <span>{{ tab.name }}</span>
            <span class="tab-badge">{{ formatCharCount(store.previewContent.stats[tab.statKey]) }}</span>
          </a>
        </nav>

        <!-- Tab Content -->
        <div class="content-display custom-scrollbar">
          <div v-show="activeTab === 'fixed'" class="prose prose-sm max-w-none" v-html="store.previewContent.fixed || emptyStateHtml('固定上下文')"></div>
          <div v-show="activeTab === 'dynamic'" class="prose prose-sm max-w-none" v-html="store.previewContent.dynamic || emptyStateHtml('动态上下文')"></div>
          <div v-show="activeTab === 'rag'" class="prose prose-sm max-w-none" v-html="store.previewContent.rag || emptyStateHtml('RAG检索')"></div>
          <div v-show="activeTab === 'prompt'">
            <pre class="prompt-preview">{{ store.previewContent.prompt }}</pre>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <footer class="modal-footer">
        <div v-if="store.previewContent" class="stats-summary">
          总计: {{ totalCharCount }} 字
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
import { ref, computed } from 'vue';
import { useContextPreviewStore } from '@/novel/editor/stores/contextPreviewStore';

const store = useContextPreviewStore();
const activeTab = ref<'fixed' | 'dynamic' | 'rag' | 'prompt'>('fixed');

const tabs = ref([
  { id: 'fixed', name: '固定上下文', statKey: 'fixedCharCount' },
  { id: 'dynamic', name: '动态上下文', statKey: 'dynamicCharCount' },
  { id: 'rag', name: 'RAG检索', statKey: 'ragCharCount' },
  { id: 'prompt', name: '最终提示词', statKey: 'promptCharCount' },
] as const);

const formatCharCount = (count: number) => {
  return count > 1000 ? `${(count / 1000).toFixed(1)}k` : count;
};

const totalCharCount = computed(() => {
  if (!store.previewContent?.stats) return 0;
  console.log(store.previewContent)
  const { fixedCharCount, dynamicCharCount, ragCharCount } = store.previewContent.stats;
  return formatCharCount(fixedCharCount + dynamicCharCount + ragCharCount);
});

const emptyStateHtml = (contextType: string) => {
  return `<p class="text-gray-400 italic">未配置或未找到${contextType}内容。</p>`;
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
  width: 100%;
  max-width: 48rem; /* 768px */
  display: flex;
  flex-direction: column;
  max-height: 90vh;
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

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.modal-close-button {
  color: #9ca3af;
  padding: 0.5rem;
  margin: -0.5rem;
  border-radius: 9999px;
  transition: background-color 0.2s, color 0.2s;
}
.modal-close-button:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.modal-loading-state {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  min-height: 300px;
}

.modal-content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 300px;
  overflow: hidden;
}

.content-tabs {
  display: flex;
  gap: 0.25rem;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  color: #4b5563;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
}

.tab-item:hover {
  background-color: #f3f4f6;
}

.tab-item.active {
  background-color: #eef2ff;
  color: #4f46e5;
}

.tab-badge {
  font-size: 0.75rem;
  background-color: #e5e7eb;
  color: #4b5563;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-variant-numeric: tabular-nums;
}

.tab-item.active .tab-badge {
  background-color: #c7d2fe;
  color: #4338ca;
}

.content-display {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background-color: #f9fafb;
}

.prompt-preview {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 0.8rem;
  color: #4b5563;
  line-height: 1.6;
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
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

.stats-summary {
  margin-right: auto;
  font-size: 0.875rem;
  color: #6b7280;
}

.button-secondary {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-weight: 500;
  color: #374151;
  transition: background-color 0.2s;
}
.button-secondary:hover {
  background-color: #f9fafb;
}

.button-primary {
  padding: 0.5rem 1rem;
  background-color: #4f46e5;
  border: 1px solid #4f46e5;
  border-radius: 0.5rem;
  font-weight: 500;
  color: white;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
}
.button-primary:hover {
  background-color: #4338ca;
}
.button-primary:disabled {
  background-color: #a5b4fc;
  cursor: not-allowed;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
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
</style>