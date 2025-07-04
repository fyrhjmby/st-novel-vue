<template>
  <div class="directory-tab-container">
    <div class="header">
      <h3 class="title">章节大纲</h3>
      <div class="actions">
        <button @click="handleAddNewVolume" class="action-btn" title="添加新卷">
          <i class="fa-solid fa-folder-plus fa-xs"></i>
        </button>
        <button class="action-btn" title="折叠/展开全部">
          <i class="fa-solid fa-folder-tree fa-xs"></i>
        </button>
      </div>
    </div>

    <TreeView
        v-if="directoryTree.length > 0"
        :nodes="directoryTree"
        :active-node-id="editorStore.activeItemId"
        :expanded-node-ids="editorStore.uiState.expandedNodeIds"
        :editing-node-id="editorStore.editingNodeId"
        @select-node="handleSelectNode"
        @toggle-expansion="handleToggleExpansion"
        @context-menu="handleContextMenu"
        @commit-rename="handleCommitRename"
        @cancel-rename="handleCancelRename"
    />
    <div v-else class="p-4 text-sm text-gray-500">
      正在加载目录...
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TreeView, { type TreeNode } from './TreeView.vue';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import { useDirectoryStore } from '@/novel/editor/stores/directoryStore';
import { getIconByNodeType } from '@/novel/editor/utils/iconUtils';

const emit = defineEmits<{
  (e: 'show-context-menu', payload: { node: TreeNode; event: MouseEvent }): void;
}>();

const editorStore = useEditorStore();
const directoryStore = useDirectoryStore();

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

const handleSelectNode = (id: string) => {
  editorStore.setActiveItem(id);
};

const handleToggleExpansion = (id:string) => {
  editorStore.toggleNodeExpansion(id);
};

const handleContextMenu = (payload: { node: TreeNode; event: MouseEvent }) => {
  emit('show-context-menu', payload);
};

const handleAddNewVolume = () => {
  directoryStore.addNewVolume();
};

const handleCommitRename = (payload: { nodeId: string; newTitle: string }) => {
  directoryStore.renameNode(payload.nodeId, payload.newTitle);
};

const handleCancelRename = () => {
  editorStore.setEditingNodeId(null);
};
</script>

<style scoped>
.directory-tab-container { padding: 1rem; display: flex; flex-direction: column; height: 100%; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding: 0 0.5rem; }
.title { font-size: 0.875rem; font-weight: 500; color: #4B5563; }
.actions { display: flex; align-items: center; gap: 0.25rem; }
.action-btn { width: 1.75rem; height: 1.75rem; display: flex; align-items: center; justify-content: center; color: #6B7280; border-radius: 0.375rem; transition: background-color 0.15s; }
.action-btn:hover { background-color: #E5E7EB; }
</style>