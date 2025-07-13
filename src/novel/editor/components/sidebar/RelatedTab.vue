<template>
  <div class="related-tab-container">
    <div class="header">
      <h3 class="title">相关内容</h3>
    </div>
    <div class="search-bar">
      <i class="fa-solid fa-magnifying-glass search-icon"></i>
      <input type="text" placeholder="搜索相关内容..." class="search-input">
    </div>
    <div class="tree-wrapper">
      <TreeView
          v-if="relatedTree.length > 0"
          :nodes="relatedTree"
          :active-node-id="activeTabId"
          :expanded-node-ids="uiStore.uiState.expandedRelatedNodeIds"
          :editing-node-id="uiStore.editingNodeId"
      />
      <div v-else class="p-4 text-sm text-gray-500">
        没有相关内容。
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import TreeView, { type TreeNode } from './TreeView.vue';
import { useEditorStore } from '../../stores/editorStore';
import { useRelatedContentStore } from '../../stores/relatedContentStore';
import { useUIStore } from '../../stores/uiStore';
import type { RelatedTree } from '../../types';

const editorStore = useEditorStore();
const relatedContentStore = useRelatedContentStore();
const uiStore = useUIStore();

const activeTabId = computed(() => editorStore.activeTabId);

const relatedTree = computed((): TreeNode[] => {
  const mapNode = (node: RelatedTree): TreeNode => ({
    id: node.id,
    title: node.title,
    icon: node.icon,
    type: node.type,
    originalData: node,
    children: node.children ? node.children.map(mapNode) : []
  });
  return relatedContentStore.relatedData.map(mapNode);
});
</script>
<style scoped>
.related-tab-container { padding: 1rem; display: flex; flex-direction: column; height: 100%; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding: 0 0.5rem; flex-shrink: 0; }
.title { font-size: 0.875rem; font-weight: 500; color: #4B5563; }
.search-bar { position: relative; margin-bottom: 1rem; flex-shrink: 0; }
.search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #9CA3AF; font-size: 0.875rem; }
.search-input { width: 100%; background: white; border: 1px solid #D1D5DB; border-radius: 0.5rem; padding: 0.4rem 0.75rem 0.4rem 2.25rem; font-size: 0.875rem; outline: none; transition: all 0.2s; }
.search-input:focus { border-color: #3B82F6; box-shadow: 0 0 0 1px #3B82F6; }
.tree-wrapper { flex-grow: 1; overflow-y: auto; }
.tree-wrapper::-webkit-scrollbar { width: 6px; }
.tree-wrapper::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
</style>