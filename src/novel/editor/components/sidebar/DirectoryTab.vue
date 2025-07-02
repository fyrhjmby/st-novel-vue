// =
// 文件: ..\src\novel\editor\components\sidebar\DirectoryTab.vue
//

<template>
  <div class="directory-tab-container">
    <div class="header">
      <h3 class="title">章节大纲</h3>
      <div class="actions">
        <button class="action-btn" title="添加新章节">
          <i class="fa-solid fa-plus fa-xs"></i>
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
        @select-node="handleSelectNode"
        @toggle-expansion="handleToggleExpansion"
        @context-menu="handleContextMenu"
    />
    <div v-else class="p-4 text-sm text-gray-500">
      正在加载目录...
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TreeView, { type TreeNode } from './TreeView.vue';
import { useEditorStore, type Volume, type Chapter } from '@/novel/editor/stores/editorStore';

// [修复] 定义 emit，以便可以向父组件发送事件
const emit = defineEmits<{
  (e: 'show-context-menu', payload: { node: TreeNode; event: MouseEvent }): void;
}>();

const editorStore = useEditorStore();

// [修复] directoryTree 现在完全由 editorStore.directoryData 驱动
const directoryTree = computed((): TreeNode[] => {
  return editorStore.directoryData.map((volume: Volume) => ({
    id: volume.id,
    title: volume.title,
    icon: 'fa-solid fa-book-open text-orange-500',
    type: 'volume', // 添加类型以供右键菜单判断
    originalData: volume, // 传递原始数据
    children: volume.chapters.map((chapter: Chapter) => ({
      id: chapter.id,
      title: chapter.title,
      icon: 'fa-solid fa-file-lines',
      status: chapter.status,
      type: 'chapter', // 添加类型以供右键菜单判断
      originalData: chapter, // 传递原始数据
      children: [],
    })),
  }));
});

// [修复] handleSelectNode 调用 editorStore 的 action 来设置激活项
const handleSelectNode = (id: string) => {
  editorStore.setActiveItem(id);
};

// [修复] handleToggleExpansion 调用 editorStore 的 action 来切换展开状态
const handleToggleExpansion = (id:string) => {
  editorStore.toggleNodeExpansion(id);
};

// [修复] handleContextMenu 将事件和数据向上 emit 给父组件
const handleContextMenu = (payload: { node: TreeNode; event: MouseEvent }) => {
  emit('show-context-menu', payload);
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