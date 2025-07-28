<template>
  <div v-if="isVisible" class="reader-overlay-container" :class="themeClass">
    <header class="reader-header">
      <button @click="uiStore.hideReaderMode()" class="back-button">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
        <span>返回编辑器</span>
      </button>
    </header>
    <main class="reader-main">
      <div v-if="item && 'content' in item" class="max-w-3xl mx-auto reader-content" v-html="item.content">
      </div>
      <div v-else class="max-w-3xl mx-auto text-center py-20 text-gray-500">
        <h1 class="text-2xl font-bold mb-4">无法加载阅读内容</h1>
        <p>此内容不支持阅读模式，或文档不存在。</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUIStore } from '@novel/editor/stores/uiStore.ts';

const uiStore = useUIStore();

const isVisible = computed(() => uiStore.isReaderModeVisible);
const item = computed(() => uiStore.readerModeItem);

const themeClass = computed(() => {
  if (uiStore.uiState.activeTheme === 'default') return '';
  return `theme-${uiStore.uiState.activeTheme}`;
});

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600&display=swap');

.reader-overlay-container {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background-color: #FDFCF9;
  color: #3a2f2f;
  display: flex;
  flex-direction: column;
  font-family: 'Noto Serif SC', serif;
}

.reader-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  z-index: 10;
}

.reader-overlay-container:hover .reader-header {
  opacity: 1;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #E5E7EB;
  color: #374151;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.reader-main {
  flex-grow: 1;
  overflow-y: auto;
  padding: 4rem 1rem;
}

:deep(.reader-content h1) {
  font-family: 'Noto Serif SC', serif;
  font-size: 2.25rem;
  font-weight: 600;
  margin-bottom: 2.5rem;
  color: #1f2937;
  letter-spacing: 0.05em;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  text-align: center;
}
:deep(.reader-content p) {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.125rem;
  line-height: 2.2;
  color: #374151;
  margin-bottom: 1.75rem;
  text-align: justify;
}

.theme-dark {
  background-color: #18181b;
  color: #e4e4e7;
}

.theme-dark .back-button {
  background-color: rgba(39, 39, 42, 0.6);
  border-color: #3f3f46;
  color: #e4e4e7;
}

.theme-dark .back-button:hover {
  background-color: rgba(39, 39, 42, 0.9);
}

:deep(.theme-dark .reader-content h1) {
  color: #f4f4f5;
  border-bottom-color: rgba(255,255,255,0.1);
}

:deep(.theme-dark .reader-content p) {
  color: #d4d4d8;
}

</style>