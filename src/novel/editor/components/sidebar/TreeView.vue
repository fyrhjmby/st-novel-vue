// 文件: src/novel/editor/components/sidebar/TreeView.vue

<template>
  <ul class="tree-view-list">
    <li v-for="node in nodes" :key="node.id" class="tree-view-item">
      <!-- 节点自身的渲染 -->
      <div
          class="node-content"
          :class="{ 'active': node.id === activeNodeId }"
          @click="handleNodeClick(node)"
          @contextmenu.prevent="emit('context-menu', { node, event: $event })"
      >
        <!-- 展开/折叠图标 -->
        <div
            class="expand-icon"
            :class="{ 'invisible': !node.children || node.children.length === 0 }"
            @click.stop="emit('toggle-expansion', node.id)"
        >
          <i class="fa-solid fa-chevron-right transition-transform" :class="{ 'rotate-90': expandedNodeIds.has(node.id) }"></i>
        </div>

        <!-- 节点类型图标 -->
        <div class="node-type-icon">
          <i :class="node.icon"></i>
        </div>

        <!-- 节点标题或重命名输入框 -->
        <template v-if="editingNodeId === node.id">
          <input
              ref="renameInput"
              type="text"
              :value="node.title"
              class="rename-input"
              @blur="handleRenameCommit($event, node.id)"
              @keydown.enter.prevent="handleRenameCommit($event, node.id)"
              @keydown.esc.prevent="handleRenameCancel"
              @click.stop
          />
        </template>
        <template v-else>
          <span class="node-title truncate">{{ node.title }}</span>
        </template>

        <!-- 节点状态徽章 (可选) -->
        <span v-if="'status' in node && node.status" class="node-status-badge">
          {{ node.status === 'editing' ? '编辑中' : '' }}
        </span>
      </div>

      <!-- 递归渲染子节点 -->
      <div v-if="node.children && node.children.length > 0" class="children-container">
        <TreeView
            v-show="expandedNodeIds.has(node.id)"
            :nodes="node.children"
            :active-node-id="activeNodeId"
            :expanded-node-ids="expandedNodeIds"
            :editing-node-id="editingNodeId"
            @select-node="emit('select-node', $event)"
            @toggle-expansion="emit('toggle-expansion', $event)"
            @context-menu="emit('context-menu', $event)"
            @commit-rename="emit('commit-rename', $event)"
            @cancel-rename="emit('cancel-rename')"
        />
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import type { PropType } from 'vue';
import type { TreeNode } from '@/novel/editor/types';

// --- Props & Emits ---
const props = defineProps({
  nodes: {
    type: Array as PropType<TreeNode[]>,
    required: true,
  },
  activeNodeId: {
    type: String as PropType<string | null>,
    default: null,
  },
  expandedNodeIds: {
    type: Set as PropType<Set<string>>,
    required: true,
  },
  editingNodeId: {
    type: String as PropType<string | null>,
    default: null,
  },
});

const emit = defineEmits<{
  (e: 'select-node', node: TreeNode): void;
  (e: 'toggle-expansion', id: string): void;
  (e: 'context-menu', payload: { node: TreeNode, event: MouseEvent }): void;
  (e: 'commit-rename', payload: { nodeId: string, newTitle: string }): void;
  (e: 'cancel-rename'): void;
}>();

const renameInput = ref<HTMLInputElement[] | null>(null);

watch(() => props.editingNodeId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    nextTick(() => {
      if (renameInput.value && renameInput.value.length > 0) {
        renameInput.value[0].focus();
        renameInput.value[0].select();
      }
    });
  }
});

const handleNodeClick = (node: TreeNode) => {
  if (props.editingNodeId === node.id) return;
  emit('select-node', node);
};

const handleRenameCommit = (event: Event, nodeId: string) => {
  const input = event.target as HTMLInputElement;
  const newTitle = input.value;
  emit('commit-rename', { nodeId, newTitle });
};

const handleRenameCancel = () => {
  emit('cancel-rename');
};

</script>

<style scoped>
.tree-view-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}
.node-content {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* 8px */
  padding: 0.5rem 0.75rem; /* 8px 12px */
  border-radius: 0.5rem; /* 8px */
  cursor: pointer;
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
  font-size: 0.875rem; /* 14px */
  color: #374151; /* text-gray-700 */
  user-select: none;
}
.node-content:hover {
  background-color: #F3F4F6; /* hover:bg-gray-100 */
}
.node-content.active {
  background-color: #E0E7FF; /* bg-indigo-100 */
  color: #3730A3; /* text-indigo-800 */
  font-weight: 500;
}
.expand-icon {
  width: 1rem; /* 16px */
  height: 1rem; /* 16px */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9CA3AF; /* text-gray-400 */
  flex-shrink: 0;
}
.expand-icon.invisible {
  visibility: hidden;
}
.node-type-icon {
  width: 1.25rem; /* 20px */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6B7280; /* text-gray-500 */
}
.node-content.active .node-type-icon {
  color: #4338CA; /* active:text-indigo-700 */
}
.node-title {
  flex-grow: 1;
}
.node-status-badge {
  margin-left: auto;
  font-size: 0.75rem; /* 12px */
  padding: 0.125rem 0.5rem; /* 2px 8px */
  background-color: #DCFCE7; /* bg-green-100 */
  color: #166534; /* text-green-800 */
  border-radius: 9999px;
  font-weight: 500;
}
.children-container {
  padding-left: 1.5rem;
  margin-left: 0.5rem;
  border-left: 1px solid #E5E7EB;
}
.rename-input {
  flex-grow: 1;
  background-color: white;
  border: 1px solid #3B82F6;
  border-radius: 4px;
  padding: 1px 4px;
  font-size: 0.875rem;
  color: #1F2937;
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
</style>