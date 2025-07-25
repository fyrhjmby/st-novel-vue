<template>
  <div class="directory-tab-container">
    <div class="header">
      <h3 class="title">章节大纲</h3>
      <div class="actions">
        <button @click="commandService.execute('novel.volume.create')" class="action-btn" title="添加新卷">
          <i class="fa-solid fa-folder-plus fa-xs"></i>
        </button>
      </div>
    </div>
    <div class="scrollable-content">
      <TreeView
          v-if="directoryTree.length > 0"
          :nodes="directoryTree"
          :active-node-id="activeTabId"
          :expanded-node-ids="uiStore.uiState.expandedNodeIds"
          :editing-node-id="uiStore.editingNodeId"
      />
      <div v-else class="p-4 text-sm text-gray-500">
        正在加载目录...
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import TreeView, { type TreeNode } from './TreeView.vue';
import { useEditorStore } from '../../stores/editorStore';
import { useDirectoryStore } from '../../stores/directoryStore';
import { useUIStore } from '../../stores/uiStore';
import { getIconByNodeType } from '../../utils/iconUtils';
import { commandService } from '@core/services/CommandService';

const editorStore = useEditorStore();
const directoryStore = useDirectoryStore();
const uiStore = useUIStore();

const activeTabId = computed(() => editorStore.activeTabId);

const directoryTree = computed((): TreeNode[] => {
  return directoryStore.directoryData.map(volume => ({
    id: volume.id,
    title: volume.title,
    icon: getIconByNodeType(volume.type),
    type: 'volume',
    originalData: volume,
    children: volume.chapters.map(chapter => ({
      id: chapter.id,
      title: chapter.title,
      icon: getIconByNodeType(chapter.type),
      status: chapter.status,
      type: 'chapter',
      originalData: chapter,
      children: [],
    })),
  }));
});
</script>
<style scoped>
.directory-tab-container { display: flex; flex-direction: column; height: 100%; width: 100%; overflow: hidden; }
.header { padding: 1rem; padding-bottom: 0.25rem; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
.title { font-size: 0.875rem; font-weight: 500; color: #4B5563; }
.actions { display: flex; align-items: center; gap: 0.25rem; }
.action-btn { width: 1.75rem; height: 1.75rem; display: flex; align-items: center; justify-content: center; color: #6B7280; border-radius: 0.375rem; transition: background-color 0.15s; }
.action-btn:hover { background-color: #E5E7EB; }
.scrollable-content { flex-grow: 1; overflow-y: auto; padding: 0.75rem 1rem 1rem; }
.scrollable-content::-webkit-scrollbar { width: 6px; }
.scrollable-content::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
</style>