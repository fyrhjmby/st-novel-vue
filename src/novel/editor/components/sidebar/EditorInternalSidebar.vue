<template>
  <aside class="editor-internal-sidebar-container">
    <!-- Tabs for switching between different sidebar views -->
    <div class="tabs-container">
      <div class="tabs tabs-bordered">
        <a
            v-for="tab in internalTabs"
            :key="tab.id"
            role="tab"
            :class="['tab', { 'tab-active text-blue-600': editorStore.uiState.activeInternalTab === tab.id }]"
            @click="editorStore.setActiveInternalTab(tab.id)"
        >
          <i :class="[tab.icon, 'mr-2']"></i>
          <span>{{ tab.name }}</span>
        </a>
      </div>
    </div>

    <!-- Content area for the active tab -->
    <div class="tab-content-container">
      <keep-alive>
        <component :is="activeTabComponent" @show-context-menu="showDirectoryContextMenu" />
      </keep-alive>
    </div>

    <!-- Directory Context Menu Component -->
    <DirectoryContextMenu ref="directoryContextMenuRef" />

  </aside>
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import DirectoryContextMenu from './DirectoryContextMenu.vue';
import type { TreeNode } from './TreeView.vue';

const editorStore = useEditorStore();
const directoryContextMenuRef = ref<InstanceType<typeof DirectoryContextMenu> | null>(null);

const internalTabs = ref([
  { id: 'directory', name: '目录', icon: 'fa-solid fa-list-ul' },
  { id: 'related', name: '相关', icon: 'fa-solid fa-sitemap' },
  { id: 'notes', name: '笔记', icon: 'fa-solid fa-book-medical' },
]);

const showDirectoryContextMenu = (payload: { node: TreeNode, event: MouseEvent }) => {
  directoryContextMenuRef.value?.show(payload.event, payload.node);
};

const tabComponents = {
  directory: defineAsyncComponent(() => import('./DirectoryTab.vue')),
  related: defineAsyncComponent(() => import('./RelatedTab.vue')),
  notes: defineAsyncComponent(() => import('./NotesTab.vue')),
};

const activeTabComponent = computed(() => {
  const tabId = editorStore.uiState.activeInternalTab;
  return tabComponents[tabId as keyof typeof tabComponents] || null;
});
</script>

<style scoped>
.editor-internal-sidebar-container {
  width: 20rem; /* 320px */
  border-right: 1px solid #F3F4F6; /* border-gray-100 */
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background-color: #FAFBFC;
  position: relative;
}
.tabs-container {
  padding: 0 1rem;
  padding-top: 1rem;
  border-bottom: 1px solid #F3F4F6;
  flex-shrink: 0;
}
.tab {
  --tab-bg: transparent;
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
  align-items: center;
}
.tab-content-container {
  flex-grow: 1;
  overflow-y: auto;
  position: relative;
}
.tab-content-container::-webkit-scrollbar { width: 6px; }
.tab-content-container::-webkit-scrollbar-track { background: transparent; }
.tab-content-container::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
.tab-content-container::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }
</style>