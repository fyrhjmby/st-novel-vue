// src/novel/editor/components/sidebar/ReferencesTab.vue
<template>
  <div class="references-tab-container">
    <div class="header">
      <h3 class="title">参考书目</h3>
      <div class="actions">
        <!-- Add button removed to enforce read-only -->
      </div>
    </div>
    <div class="scrollable-content">
      <TreeView
          v-if="referenceTree.length > 0"
          :nodes="referenceTree"
          :active-node-id="activeNodeId"
          :expanded-node-ids="uiStore.uiState.expandedReferenceNodeIds"
          :editing-node-id="editorStore.editingNodeId"
          @select-node="handleSelectNode"
          @toggle-expansion="handleToggleExpansion"
          @context-menu="handleContextMenu"
      />
      <div v-else class="p-4 text-sm text-gray-500">
        没有参考书。
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import TreeView from './TreeView.vue';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import { useReferenceStore } from '@/novel/editor/stores/referenceStore';
import { useUIStore } from '@/novel/editor/stores/uiStore';
import type { TreeNode } from '@/novel/editor/types';

const emit = defineEmits<{
  (e: 'show-context-menu', payload: { node: TreeNode; event: MouseEvent }): void;
}>();

const editorStore = useEditorStore();
const referenceStore = useReferenceStore();
const uiStore = useUIStore();

const activeNodeId = computed(() => editorStore.activeTabId);

const referenceTree = computed((): TreeNode[] => {
  return referenceStore.referenceData;
});

const handleSelectNode = (node: TreeNode) => {
  // If the node has children, it's a container node, so we toggle its expansion.
  if (node.children && node.children.length > 0) {
    uiStore.toggleReferenceNodeExpansion(node.id);
  }
  // If the node has content, it's a leaf node that can be opened.
  else if (node.hasOwnProperty('content')) {
    editorStore.openTab(node.id);
  }
};

const handleToggleExpansion = (id:string) => {
  uiStore.toggleReferenceNodeExpansion(id);
};

const handleContextMenu = (payload: { node: TreeNode; event: MouseEvent }) => {
  emit('show-context-menu', payload);
};
</script>
<style scoped>
.references-tab-container {
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