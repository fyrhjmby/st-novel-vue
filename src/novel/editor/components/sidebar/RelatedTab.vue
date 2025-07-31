// 文件: src/novel/editor/components/sidebar/RelatedTab.vue
<template>
  <div class="related-tab-container">
    <div class="header">
      <h3 class="title">相关内容</h3>
      <div class="actions">
        <button @click="handleAddNewCustomPlot" class="action-btn" title="新建自定义剧情">
          <i class="fa-solid fa-feather-pointed fa-xs"></i>
        </button>
        <button @click="handleAddNewCustomAnalysis" class="action-btn" title="新建自定义分析">
          <i class="fa-solid fa-magnifying-glass-chart fa-xs"></i>
        </button>
      </div>
    </div>
    <div class="search-bar">
      <i class="fa-solid fa-magnifying-glass search-icon"></i>
      <input type="text" placeholder="搜索相关内容..." class="search-input">
    </div>
    <TreeView
        v-if="relatedTree.length > 0"
        :nodes="relatedTree"
        :active-node-id="activeNodeId"
        :expanded-node-ids="uiStore.uiState.expandedRelatedNodeIds"
        :editing-node-id="editorStore.editingNodeId"
        @select-node="handleSelectNode"
        @toggle-expansion="handleToggleExpansion"
        @context-menu="handleContextMenu"
        @commit-rename="handleCommitRename"
        @cancel-rename="handleCancelRename"
    />
    <div v-else class="p-4 text-sm text-gray-500">
      没有相关内容。
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import TreeView from './TreeView.vue';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import { useRelatedContentStore } from '@/novel/editor/stores/relatedContentStore';
import { useUIStore } from '@/novel/editor/stores/uiStore';
import type { TreeNode } from '@/novel/editor/types';

const emit = defineEmits<{
  (e: 'show-context-menu', payload: { node: TreeNode; event: MouseEvent }): void;
}>();

const editorStore = useEditorStore();
const relatedContentStore = useRelatedContentStore();
const uiStore = useUIStore();

const activeNodeId = computed(() => editorStore.activeTabId);

const relatedTree = computed((): TreeNode[] => {
  return relatedContentStore.relatedData;
});

const handleSelectNode = (node: TreeNode) => {
  // 只有在节点有内容时才打开tab，否则切换展开状态
  if ('content' in node && node.content !== undefined) {
    editorStore.openTab(node.id);
  } else if(node.children && node.children.length > 0) {
    uiStore.toggleRelatedNodeExpansion(node.id);
  }
};

const handleToggleExpansion = (id: string) => {
  uiStore.toggleRelatedNodeExpansion(id);
};

const handleContextMenu = (payload: { node: TreeNode; event: MouseEvent }) => {
  emit('show-context-menu', payload);
};

const handleCommitRename = (payload: { nodeId: string; newTitle: string }) => {
  if (payload.nodeId.startsWith('custom-')) {
    relatedContentStore.renameCustomRelatedNode(payload.nodeId, payload.newTitle);
  } else {
    relatedContentStore.renameRelatedNode(payload.nodeId, payload.newTitle);
  }
};

const handleCancelRename = () => {
  editorStore.setEditingNodeId(null);
};

const handleAddNewCustomPlot = () => {
  relatedContentStore.addCustomRelatedNode('plot');
};

const handleAddNewCustomAnalysis = () => {
  relatedContentStore.addCustomRelatedNode('analysis');
};

</script>
<style scoped>
.related-tab-container { padding: 1rem; overflow-y: auto; height: 100%; display: flex; flex-direction: column; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding: 0 0.5rem; flex-shrink: 0; }
.title { font-size: 0.875rem; font-weight: 500; color: #4B5563; }
.actions { display: flex; align-items: center; gap: 0.25rem; }
.action-btn { width: 1.75rem; height: 1.75rem; display: flex; align-items: center; justify-content: center; color: #6B7280; border-radius: 0.375rem; transition: background-color 0.15s; }
.action-btn:hover { background-color: #E5E7EB; }
.search-bar { position: relative; margin-bottom: 1rem; flex-shrink: 0; }
.search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #9CA3AF; font-size: 0.875rem; }
.search-input { width: 100%; background: white; border: 1px solid #D1D5DB; border-radius: 0.5rem; padding: 0.4rem 0.75rem 0.4rem 2.25rem; font-size: 0.875rem; outline: none; transition: all 0.2s; }
.search-input:focus { border-color: #3B82F6; box-shadow: 0 0 0 1px #3B82F6; }
</style>