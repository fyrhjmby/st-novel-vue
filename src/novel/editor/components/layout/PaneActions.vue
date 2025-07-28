<template>
  <div class="pane-actions-container" :class="{'is-active-pane': isActive}">
    <button @click="editorStore.toggleAIPanel(paneId)" class="toolbar-btn" title="AI 任务面板">
      <i class="fa-solid fa-list-check"></i>
    </button>
    <button @click="handleShowHistory" class="toolbar-btn" title="版本历史">
      <i class="fa-solid fa-code-compare"></i>
    </button>
    <div class="divider"></div>
    <button @click="handleSplitPane" class="toolbar-btn" title="分屏">
      <i class="fa-solid fa-columns"></i>
    </button>
    <button v-if="editorStore.panes.length > 1" @click="editorStore.closePane(paneId)" class="toolbar-btn" title="关闭窗格">
      <i class="fa-solid fa-xmark"></i>
    </button>
    <button @click="handleShowReader" class="toolbar-btn" title="阅读模式">
      <i class="fa-solid fa-book-open"></i>
    </button>
  </div>
</template>
<script setup lang="ts">
import { useEditorStore } from '@/novel/editor/stores/editorStore';

const props = defineProps<{
  paneId: string;
  isActive: boolean;
}>();

const editorStore = useEditorStore();

const handleSplitPane = () => {
  editorStore.splitPane(props.paneId);
}

const handleShowHistory = () => {
  editorStore.toggleHistoryPanel(props.paneId);
};

const handleShowReader = () => {
  editorStore.openReaderView();
};
</script>
<style scoped>
.pane-actions-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1rem;
  flex-shrink: 0;
  transition: color 0.2s;
}
.toolbar-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6B7280;
  border-radius: 0.375rem;
  transition: all 0.2s;
}
.pane-actions-container.is-active-pane .toolbar-btn:hover {
  background-color: #E5E7EB;
  color: #1F2937;
}
.pane-actions-container:not(.is-active-pane) .toolbar-btn {
  color: #B0B3B8;
}
.divider {
  width: 1px;
  height: 16px;
  background-color: #E5E7EB;
  margin: 0 0.25rem;
}
</style>