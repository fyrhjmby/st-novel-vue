<template>
  <div class="sidebar-panel-container">
    <div class="header">
      <h3 class="title">{{ activeTitle }}</h3>
    </div>

    <div class="content-container">
      <keep-alive>
        <component :is="activeTabComponent" @show-context-menu="showDirectoryContextMenu" />
      </keep-alive>
    </div>

    <DirectoryContextMenu ref="directoryContextMenuRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue';
import DirectoryContextMenu from './DirectoryContextMenu.vue';
import type { TreeNode } from '@/novel/editor/types';

type TabId = 'directory' | 'related' | 'notes' | 'references';

const props = defineProps<{
  activeTabId: TabId | null;
}>();

const directoryContextMenuRef = ref<InstanceType<typeof DirectoryContextMenu> | null>(null);

const titles: Record<TabId, string> = {
  directory: '目录大纲',
  related: '相关内容',
  notes: '章节笔记',
  references: '参考书目',
};

const tabComponents: Record<TabId, any> = {
  directory: defineAsyncComponent(() => import('./DirectoryTab.vue')),
  related: defineAsyncComponent(() => import('./RelatedTab.vue')),
  notes: defineAsyncComponent(() => import('./NotesTab.vue')),
  references: defineAsyncComponent(() => import('./ReferencesTab.vue')),
};

const activeTabComponent = computed(() => {
  if (!props.activeTabId) return null;
  return tabComponents[props.activeTabId] || null;
});

const activeTitle = computed(() => {
  if (!props.activeTabId) return '';
  return titles[props.activeTabId] || '';
});

const showDirectoryContextMenu = (payload: { node: TreeNode, event: MouseEvent }) => {
  directoryContextMenuRef.value?.show(payload.event, payload.node);
};
</script>

<style scoped>
.sidebar-panel-container {
  width: 100%;
  background-color: #FAFBFC;
  border-right: 1px solid #F3F4F6;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.header {
  padding: 0 1rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #F3F4F6;
  flex-shrink: 0;
}

.title {
  font-size: 1rem;
  font-weight: 500;
  color: #1F2937;
}

.content-container {
  flex-grow: 1;
  position: relative;
  overflow: hidden;
}
</style>