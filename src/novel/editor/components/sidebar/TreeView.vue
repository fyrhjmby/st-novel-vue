<template>
  <ul class="tree-view-list">
    <li v-for="(node, index) in nodes" :key="node.id" class="tree-view-item">
      <div
          class="node-content"
          :class="{ 'active': node.id === activeNodeId }"
          @click="handleNodeClick(node)"
          @contextmenu.prevent="handleContextMenu(node, $event)"
      >
        <div
            class="expand-icon"
            :class="{ 'invisible': !node.children || node.children.length === 0 }"
            @click.stop="uiStore.toggleRelatedNodeExpansion(node.id)"
        >
          <i class="fa-solid fa-chevron-right transition-transform" :class="{ 'rotate-90': expandedNodeIds.has(node.id) }"></i>
        </div>

        <div class="node-type-icon"> <i :class="node.icon"></i> </div>

        <template v-if="editingNodeId === node.id">
          <input
              :ref="el => { if (el) renameInputs[index] = el as HTMLInputElement }"
              type="text"
              :value="node.title"
              class="rename-input"
              @blur="commitRename($event, node)"
              @keydown.enter.prevent="commitRename($event, node)"
              @keydown.esc.prevent="cancelRename"
              @click.stop
          />
        </template>
        <template v-else>
          <span class="node-title truncate">{{ node.title }}</span>
        </template>

      </div>

      <div v-if="node.children && node.children.length > 0" class="children-container">
        <TreeView
            v-show="expandedNodeIds.has(node.id)"
            :nodes="node.children"
            :active-node-id="activeNodeId"
            :expanded-node-ids="expandedNodeIds"
            :editing-node-id="editingNodeId"
        />
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, type PropType, onBeforeUpdate } from 'vue';
import { useUIStore } from '../../stores/uiStore';
import { useDirectoryStore } from '../../stores/directoryStore';
import { useRelatedContentStore } from '../../stores/relatedContentStore';
import { tabManagementService } from '@core/tabs/service/TabManagementService';
import { contextMenuService } from '@core/panes/service/ContextMenuService';

export interface TreeNode {
  id: string;
  title: string;
  icon: string;
  status?: string;
  type: string;
  children?: TreeNode[];
  originalData: any;
}

const props = defineProps({
  nodes: { type: Array as PropType<TreeNode[]>, required: true },
  activeNodeId: { type: String as PropType<string | null>, default: null },
  expandedNodeIds: { type: Set as PropType<Set<string>>, required: true },
  editingNodeId: { type: String as PropType<string | null>, default: null },
});

const uiStore = useUIStore();
const directoryStore = useDirectoryStore();
const relatedContentStore = useRelatedContentStore();
const renameInputs = ref<HTMLInputElement[]>([]);

watch(() => props.editingNodeId, (newId) => {
  if (newId) {
    nextTick(() => {
      const nodeIndex = props.nodes.findIndex(n => n.id === newId);
      if (nodeIndex !== -1 && renameInputs.value[nodeIndex]) {
        renameInputs.value[nodeIndex].focus();
        renameInputs.value[nodeIndex].select();
      }
    });
  }
});

onBeforeUpdate(() => {
  renameInputs.value = [];
});

const handleNodeClick = (node: TreeNode) => {
  if (props.editingNodeId === node.id) return;
  if (node.type === 'volume' || node.type === 'group') {
    uiStore.toggleNodeExpansion(node.id);
    uiStore.toggleRelatedNodeExpansion(node.id);
  } else {
    tabManagementService.openTab(node.id);
  }
};

const handleContextMenu = (node: TreeNode, event: MouseEvent) => {
  contextMenuService.show(event, 'novel-directory-node', { node });
};

const commitRename = (event: Event, node: TreeNode) => {
  const newTitle = (event.target as HTMLInputElement).value;
  if (node.type === 'volume' || node.type === 'chapter') {
    directoryStore.renameNode(node.id, newTitle);
  } else {
    relatedContentStore.renameRelatedNode(node.id, newTitle);
  }
  cancelRename();
};

const cancelRename = () => {
  uiStore.setEditingNodeId(null);
};

</script>

<style scoped>
.tree-view-list { list-style: none; padding: 0; margin: 0; width: 100%; }
.node-content { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; border-radius: 0.5rem; cursor: pointer; transition: background-color 0.15s, color 0.15s; font-size: 0.875rem; color: #374151; user-select: none; }
.node-content:hover { background-color: #F3F4F6; }
.node-content.active { background-color: #E0E7FF; color: #3730A3; font-weight: 500; }
.expand-icon { width: 1rem; height: 1rem; display: flex; align-items: center; justify-content: center; color: #9CA3AF; flex-shrink: 0; }
.expand-icon.invisible { visibility: hidden; }
.node-type-icon { width: 1.25rem; display: flex; align-items: center; justify-content: center; color: #6B7280; }
.node-content.active .node-type-icon { color: #4338CA; }
.node-title { flex-grow: 1; }
.children-container { padding-left: 1.5rem; margin-left: 0.5rem; border-left: 1px solid #E5E7EB; }
.rename-input { flex-grow: 1; background-color: white; border: 1px solid #3B82F6; border-radius: 4px; padding: 1px 4px; font-size: 0.875rem; color: #1F2937; outline: none; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
</style>