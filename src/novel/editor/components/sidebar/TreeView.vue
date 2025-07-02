<template>
  <ul class="tree-view-list">
    <li v-for="node in nodes" :key="node.id" class="tree-view-item">
      <!-- 节点自身的渲染 -->
      <div
          class="node-content"
          :class="{ 'active': node.id === activeNodeId }"
          @click="emit('select-node', node.id)"
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

        <!-- 节点标题 -->
        <span class="node-title truncate">{{ node.title }}</span>

        <!-- 节点状态徽章 (可选) -->
        <span v-if="node.status" class="node-status-badge">
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
            @select-node="emit('select-node', $event)"
            @toggle-expansion="emit('toggle-expansion', $event)"
            @context-menu="emit('context-menu', $event)"
        />
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

// --- 类型定义 ---
// TreeView组件期望接收的节点数据结构
export interface TreeNode {
  id: string;
  title: string;
  icon: string; // Font Awesome class
  status?: string;
  children?: TreeNode[];
  // 可以包含原始数据以便在事件中传递
  originalData: any;
}

// --- Props & Emits ---
defineProps({
  /**
   * 要渲染的树节点数组
   */
  nodes: {
    type: Array as PropType<TreeNode[]>,
    required: true,
  },
  /**
   * 当前激活的节点ID
   */
  activeNodeId: {
    type: String as PropType<string | null>,
    default: null,
  },
  /**
   * 一个包含所有已展开节点ID的Set
   */
  expandedNodeIds: {
    type: Set as PropType<Set<string>>,
    required: true,
  }
});

const emit = defineEmits<{
  (e: 'select-node', id: string): void;
  (e: 'toggle-expansion', id: string): void;
  (e: 'context-menu', payload: { node: TreeNode, event: MouseEvent }): void;
}>();
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
  padding-left: 1.5rem; /* 24px */
  margin-left: 0.5rem; /* 8px */
  border-left: 1px solid #E5E7EB; /* border-gray-200 */
}
</style>