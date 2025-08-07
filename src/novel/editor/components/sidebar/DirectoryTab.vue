// src/novel/editor/components/sidebar/DirectoryTab.vue

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
    <div class="scrollable-content">
      <TreeView
          v-if="directoryTree.length > 0"
          :nodes="directoryTree"
          :active-node-id="activeNodeId"
          :expanded-node-ids="uiStore.uiState.expandedNodeIds"
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
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import TreeView from './TreeView.vue';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import { useDirectoryStore } from '@/novel/editor/stores/directoryStore';
import { useUIStore } from '@/novel/editor/stores/uiStore';
import { getIconByNodeType } from '@/novel/editor/utils/iconUtils';
import type { TreeNode, VolumeNode, ChapterNode } from '@/novel/editor/types';

const emit = defineEmits<{
  (e: 'show-context-menu', payload: { node: TreeNode; event: MouseEvent }): void;
}>();

const editorStore = useEditorStore();
const directoryStore = useDirectoryStore();
const uiStore = useUIStore();

const activeNodeId = computed(() => editorStore.activeTabId);

const directoryTree = computed((): VolumeNode[] => {
  return directoryStore.directoryData.map(volume => ({
    id: volume.id,
    title: volume.title,
    icon: getIconByNodeType(volume.type),
    type: 'volume',
    content: volume.content, // 直接暴露 content
    originalData: volume,
    children: volume.chapters.map(chapter => ({
      id: chapter.id,
      title: chapter.title,
      icon: getIconByNodeType(chapter.type),
      type: 'chapter',
      status: chapter.status,
      content: chapter.content, // 直接暴露 content
      originalData: chapter,
    })),
  }));
});

const handleSelectNode = (node: TreeNode) => {
  // 明确判断，卷和章节都可以被打开编辑
  if (node.type === 'chapter' || node.type === 'volume') {
    editorStore.openTab(node.id);
  } else if(node.children && node.children.length > 0) {
    // 对于其他有子节点的节点（理论上这里不会走到），作为备用逻辑
    uiStore.toggleNodeExpansion(node.id);
  }
};

const handleToggleExpansion = (id:string) => {
  uiStore.toggleNodeExpansion(id);
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
.directory-tab-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.header {
  padding: 1rem;
  padding-bottom: 0.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}
.title { font-size: 0.875rem; font-weight: 500; color: #4B5563; }
.actions { display: flex; align-items: center; gap: 0.25rem; }
.action-btn { width: 1.75rem; height: 1.75rem; display: flex; align-items: center; justify-content: center; color: #6B7280; border-radius: 0.375rem; transition: background-color 0.15s; }
.action-btn:hover { background-color: #E5E7EB; }

.scrollable-content {
  flex-grow: 1;
  overflow-y: auto;
  padding: 0.75rem 1rem 1rem;
}
.scrollable-content::-webkit-scrollbar { width: 6px; }
.scrollable-content::-webkit-scrollbar-track { background: transparent; }
.scrollable-content::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
.scrollable-content::-webkit-scrollbar-thumb:hover { background: #9CA3AF; }
</style>