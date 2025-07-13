<template>
  <div class="sidebar-panel-container">
    <div class="header">
      <h3 class="title">{{ activeTitle }}</h3>
    </div>
    <div class="content-container">
      <component :is="activeTabComponent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useEditorStore } from '../../stores/editorStore';

const editorStore = useEditorStore();

const titles = {
  directory: '目录大纲',
  related: '相关内容',
  notes: '章节笔记',
};

const tabComponents = {
  directory: defineAsyncComponent(() => import('./DirectoryTab.vue')),
  related: defineAsyncComponent(() => import('./RelatedTab.vue')),
  notes: defineAsyncComponent(() => import('./NotesTab.vue')),
};

const activeTabComponent = computed(() => {
  const activeId = editorStore.activeSidebarPanelId;
  return activeId ? tabComponents[activeId] : null;
});

const activeTitle = computed(() => {
  const activeId = editorStore.activeSidebarPanelId;
  return activeId ? titles[activeId] : '';
});
</script>

<style scoped>
.sidebar-panel-container { width: 100%; background-color: #FAFBFC; display: flex; flex-direction: column; height: 100%; overflow: hidden; }
.header { padding: 0 1rem; height: 3.5rem; display: flex; align-items: center; border-bottom: 1px solid #F0F0F0; flex-shrink: 0; }
.title { font-size: 1rem; font-weight: 500; color: #1F2937; }
.content-container { flex-grow: 1; position: relative; overflow: auto; }
</style>