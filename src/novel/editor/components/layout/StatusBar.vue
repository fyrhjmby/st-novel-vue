<template>
  <footer class="status-bar-container">
    <div class="status-bar-left">
      <div v-if="activeItem && activeItem.type === 'chapter'" class="status-item">
        <i class="fa-solid fa-check-double text-green-500"></i>
        <span>已保存</span>
      </div>
      <div v-if="wordCount > 0" class="status-item">
        <span>{{ wordCount }} 字</span>
      </div>
      <div v-if="readingTime > 0" class="status-item">
        <span>约 {{ readingTime }} 分钟阅读</span>
      </div>
    </div>
    <div class="status-bar-right">
      <div class="status-item">
        <span>Ln 1, Col 1</span>
      </div>
      <div class="status-item">
        <span>UTF-8</span>
      </div>
      <div class="status-item" title="通知">
        <i class="fa-regular fa-bell"></i>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import type { Chapter } from '@/novel/editor/types';

const editorStore = useEditorStore();

const activeItem = computed(() => editorStore.activeTab?.item);

const wordCount = computed(() => {
  if (activeItem.value && activeItem.value.type === 'chapter') {
    return (activeItem.value as Chapter).wordCount || 0;
  }
  return 0;
});

const readingTime = computed(() => {
  if (!wordCount.value) return 0;
  const time = Math.ceil(wordCount.value / 400);
  return time > 0 ? time : 1;
});
</script>

<style scoped>
.status-bar-container {
  height: 28px;
  background-color: #F3F4F6;
  border-top: 1px solid #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  font-size: 0.75rem; /* 12px */
  color: #4B5563;
  flex-shrink: 0;
  user-select: none;
}
.status-bar-left, .status-bar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.status-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
}
.status-item:hover {
  color: #1F2937;
}
</style>