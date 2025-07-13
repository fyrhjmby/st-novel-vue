<template>
  <div class="status-bar-container">
    <div class="status-bar-left">
      <div v-if="editorStore.activeTabId" class="status-item">
        <i class="fa-solid fa-check-double text-green-500"></i>
        <span>已保存</span>
      </div>
      <div v-if="editorStore.wordCount > 0" class="status-item">
        <span>{{ editorStore.wordCount }} 字</span>
      </div>
      <div v-if="editorStore.readingTime > 0" class="status-item">
        <span>约 {{ editorStore.readingTime }} 分钟阅读</span>
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
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '../../stores/editorStore';
const editorStore = useEditorStore();
</script>

<style scoped>
.status-bar-container { height: 28px; background-color: #F3F4F6; display: flex; align-items: center; justify-content: space-between; padding: 0 1rem; font-size: 0.75rem; color: #4B5563; flex-shrink: 0; user-select: none; }
.status-bar-left, .status-bar-right { display: flex; align-items: center; gap: 1rem; }
.status-item { display: flex; align-items: center; gap: 0.375rem; cursor: pointer; }
.status-item:hover { color: #1F2937; }
</style>