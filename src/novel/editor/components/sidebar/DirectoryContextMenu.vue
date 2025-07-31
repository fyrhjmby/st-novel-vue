<!-- 文件: src/novel/editor/components/sidebar/DirectoryContextMenu.vue -->
<template>
  <div
      v-if="visible"
      class="context-menu"
      :style="{ top: `${position.y}px`, left: `${position.x}px` }"
      @click.stop
  >
    <!-- 目录管理：卷 -->
    <template v-if="node?.type === 'volume'">
      <p class="menu-title">目录管理</p>
      <div @click="handleAction('newChapter')" class="context-menu-item"><i class="fa-solid fa-plus w-4 text-center"></i><span>新建章节</span></div>
      <div @click="handleAction('newVolume')" class="context-menu-item"><i class="fa-solid fa-folder-plus w-4 text-center"></i><span>新建卷</span></div>
      <div @click="handleAction('rename')" class="context-menu-item"><i class="fa-solid fa-pencil w-4 text-center"></i><span>重命名</span></div>
      <div class="context-menu-divider"></div>
      <p class="menu-title">AI 批量任务</p>
      <div @click="handleAIAction('分析', node, true)" class="context-menu-item"><i class="fa-solid fa-magnifying-glass-chart w-4 text-center text-[#F59E0B]"></i><span>批量分析章节</span></div>
      <div @click="handleAIAction('剧情生成', node, true)" class="context-menu-item"><i class="fa-solid fa-feather w-4 text-center text-[#EC4899]"></i><span>批量生成剧情</span></div>
      <div @click="handleAIAction('续写', node, true)" class="context-menu-item"><i class="fa-solid fa-wand-magic-sparkles w-4 text-center text-[#4B5563]"></i><span>批量续写章节</span></div>
      <div class="context-menu-divider"></div>
      <div @click="handleAction('delete')" class="context-menu-item danger"><i class="fa-solid fa-trash-can w-4 text-center"></i><span>删除卷</span></div>
    </template>

    <!-- 目录管理：章节 -->
    <template v-else-if="node?.type === 'chapter'">
      <p class="menu-title">文件操作</p>
      <div @click="handleAction('rename')" class="context-menu-item"><i class="fa-solid fa-pencil w-4 text-center"></i><span>重命名</span></div>
      <div class="context-menu-divider"></div>
      <p class="menu-title">AI 助手</p>
      <div @click="handleAIAction('分析', node)" class="context-menu-item"><i class="fa-solid fa-magnifying-glass-chart w-4 text-center text-[#F59E0B]"></i><span>分析内容</span></div>
      <div @click="handleAIAction('剧情生成', node)" class="context-menu-item"><i class="fa-solid fa-feather w-4 text-center text-[#EC4899]"></i><span>生成剧情</span></div>
      <div @click="handleAIAction('续写', node)" class="context-menu-item"><i class="fa-solid fa-wand-magic-sparkles w-4 text-center text-[#4B5563]"></i><span>续写内容</span></div>
      <div @click="handleAIAction('润色', node)" class="context-menu-item"><i class="fa-solid fa-palette w-4 text-center text-[#3B82F6]"></i><span>润色内容</span></div>
      <div class="context-menu-divider"></div>
      <div @click="handleAction('delete')" class="context-menu-item danger"><i class="fa-solid fa-trash-can w-4 text-center"></i><span>删除章节</span></div>
    </template>

    <!-- 相关内容：设定分组 -->
    <template v-else-if="node?.type === 'group'">
      <p class="menu-title">设定管理</p>
      <div @click="handleSettingsAction('newItem')" class="context-menu-item"><i class="fa-solid fa-plus w-4 text-center"></i><span>新建条目</span></div>
      <div @click="handleSettingsAction('newGroup')" class="context-menu-item"><i class="fa-solid fa-folder-plus w-4 text-center"></i><span>新建分组</span></div>
      <div @click="handleSettingsAction('rename')" class="context-menu-item"><i class="fa-solid fa-pencil w-4 text-center"></i><span>重命名</span></div>
      <div @click="handleSettingsAction('delete')" class="context-menu-item danger"><i class="fa-solid fa-trash-can w-4 text-center"></i><span>删除分组</span></div>
    </template>

    <!-- 相关内容：设定条目 (非只读) -->
    <template v-else-if="node?.type && node.type.endsWith('_item') && !node.originalData?.isReadOnly && !node.id.startsWith('custom-')">
      <p class="menu-title">条目管理</p>
      <div @click="handleSettingsAction('rename')" class="context-menu-item"><i class="fa-solid fa-pencil w-4 text-center"></i><span>重命名</span></div>
      <div @click="handleSettingsAction('delete')" class="context-menu-item danger"><i class="fa-solid fa-trash-can w-4 text-center"></i><span>删除条目</span></div>
    </template>

    <!-- 相关内容: 剧情/分析 根节点 -->
    <template v-else-if="node?.id === 'plot' || node?.id === 'analysis'">
      <p class="menu-title">管理</p>
      <div @click="handleCustomRelatedAction('newItem')" class="context-menu-item"><i class="fa-solid fa-plus w-4 text-center"></i><span>新建自定义{{ node.id === 'plot' ? '剧情' : '分析' }}</span></div>
    </template>

    <!-- 相关内容: 自定义剧情/分析条目 -->
    <template v-else-if="node?.id.startsWith('custom-')">
      <p class="menu-title">条目管理</p>
      <div @click="handleCustomRelatedAction('rename')" class="context-menu-item"><i class="fa-solid fa-pencil w-4 text-center"></i><span>重命名</span></div>
      <div @click="handleCustomRelatedAction('delete')" class="context-menu-item danger"><i class="fa-solid fa-trash-can w-4 text-center"></i><span>删除条目</span></div>
    </template>

    <!-- 笔记 -->
    <template v-else-if="node?.type === 'note'">
      <p class="menu-title">笔记管理</p>
      <div @click="handleNoteAction('rename')" class="context-menu-item"><i class="fa-solid fa-pencil w-4 text-center"></i><span>重命名</span></div>
      <div @click="handleNoteAction('delete')" class="context-menu-item danger"><i class="fa-solid fa-trash-can w-4 text-center"></i><span>删除笔记</span></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import type { TreeNode } from './TreeView.vue';
import { useAITaskStore } from '@/novel/editor/stores/aiTaskStore';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import { useDirectoryStore } from '@/novel/editor/stores/directoryStore';
import { useRelatedContentStore } from '@/novel/editor/stores/relatedContentStore';
import { useNotesStore } from '@/novel/editor/stores/notesStore';
import { useContextMenuStore } from '@/novel/editor/stores/contextPreviewStore';
import type { AITask } from '@/novel/editor/types';
import { useUIStore } from "@novel/editor/stores/uiStore.ts";

const aiTaskStore = useAITaskStore();
const editorStore = useEditorStore();
const directoryStore = useDirectoryStore();
const relatedContentStore = useRelatedContentStore();
const notesStore = useNotesStore();
const contextPreviewStore = useContextMenuStore();
const uiStore = useUIStore();

const visible = ref(false);
const position = ref({ x: 0, y: 0 });
const node = ref<TreeNode | null>(null);

const show = (event: MouseEvent, targetNode: TreeNode) => {
  if (targetNode.originalData?.isReadOnly || targetNode.type.endsWith('_overview') || targetNode.type.endsWith('_volume') || targetNode.type.endsWith('_chapter')) {
    // Don't show menu for read-only derived nodes
    return;
  }
  node.value = targetNode;
  visible.value = true;
  position.value.x = event.clientX;
  position.value.y = event.clientY;
};

const hide = () => {
  visible.value = false;
  node.value = null;
};

const handleAIAction = (taskType: AITask['type'], sourceNode: TreeNode, isBatch = false) => {
  if (!sourceNode) return;
  hide();

  if (isBatch && sourceNode.type === 'volume' && 'chapters' in sourceNode.originalData) {
    aiTaskStore.startBatchTaskForVolume(taskType, sourceNode.originalData);
  } else {
    if (uiStore.uiState.needsPreview) {
      contextPreviewStore.show({
        type: taskType,
        targetItemId: sourceNode.id,
        title: sourceNode.title,
      });
    } else {
      aiTaskStore.startTask(taskType, sourceNode.id);
    }
  }
};

const handleAction = (action: 'newChapter' | 'newVolume' | 'rename' | 'delete') => {
  if (!node.value) return;
  const nodeId = node.value.id;

  switch (action) {
    case 'newChapter': directoryStore.addChapterToVolume(nodeId); break;
    case 'newVolume': directoryStore.addNewVolume(); break;
    case 'rename': editorStore.setEditingNodeId(nodeId); break;
    case 'delete': directoryStore.deleteNode(nodeId); break;
  }
  hide();
};

const handleSettingsAction = (action: 'newGroup' | 'newItem' | 'rename' | 'delete') => {
  if (!node.value) return;
  const nodeId = node.value.id;

  switch (action) {
    case 'newGroup': relatedContentStore.addRelatedNode(nodeId, 'group'); break;
    case 'newItem': relatedContentStore.addRelatedNode(nodeId, 'item'); break;
    case 'rename': editorStore.setEditingNodeId(nodeId); break;
    case 'delete': relatedContentStore.deleteRelatedNode(nodeId); break;
  }
  hide();
};

const handleCustomRelatedAction = (action: 'newItem' | 'rename' | 'delete') => {
  if (!node.value) return;
  const nodeId = node.value.id;
  const target = node.value.id === 'plot' ? 'plot' : 'analysis';

  switch(action) {
    case 'newItem':
      relatedContentStore.addCustomRelatedNode(target);
      break;
    case 'rename':
      editorStore.setEditingNodeId(nodeId);
      break;
    case 'delete':
      relatedContentStore.deleteCustomRelatedNode(nodeId);
      break;
  }
  hide();
};

const handleNoteAction = (action: 'rename' | 'delete') => {
  if (!node.value) return;
  const nodeId = node.value.id;

  switch (action) {
    case 'rename':
      editorStore.setEditingNodeId(nodeId);
      break;
    case 'delete':
      notesStore.deleteNote(nodeId);
      break;
  }
  hide();
};

onMounted(() => {
  window.addEventListener('click', hide);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', hide);
});

defineExpose({ show, hide });
</script>

<style scoped>
.context-menu {
  position: fixed;
  z-index: 1000;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  min-width: 14rem;
}
.context-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s, color 0.15s;
}
.context-menu-item:hover {
  background-color: #f3f4f6;
}
.context-menu-item.danger:hover {
  background-color: #fee2e2;
  color: #b91c1c;
}
.context-menu-divider {
  height: 1px;
  background-color: #f3f4f6;
  margin: 0.5rem 0;
}
.menu-title {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  color: #9CA3AF;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>