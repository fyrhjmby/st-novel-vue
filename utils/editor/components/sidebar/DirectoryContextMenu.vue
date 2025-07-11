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
      <div @click="handleAIAction('续写', node)" class="context-menu-item"><i class="fa-solid fa-wand-magic-sparkles w-4 text-center text-[#4B5563]"></i><span>续写内容</span></div>
      <div class="context-menu-divider"></div>
      <div @click="handleAction('delete')" class="context-menu-item danger"><i class="fa-solid fa-trash-can w-4 text-center"></i><span>删除章节</span></div>
    </template>

    <!-- 笔记 -->
    <template v-else-if="node?.type === 'note'">
      <p class="menu-title">笔记操作</p>
      <div @click="handleNoteAction('rename')" class="context-menu-item"><i class="fa-solid fa-pencil w-4 text-center"></i><span>重命名</span></div>
      <div class="context-menu-divider"></div>
      <div @click="handleNoteAction('delete')" class="context-menu-item danger"><i class="fa-solid fa-trash-can w-4 text-center"></i><span>删除笔记</span></div>
    </template>

    <!-- 派生节点 (剧情/分析) -->
    <template v-else-if="node?.type.startsWith('plot_') || node?.type.startsWith('analysis_')">
      <!-- 用户自定义的条目 -->
      <template v-if="node.id.startsWith('custom-')">
        <p class="menu-title">条目操作</p>
        <div @click="handleCustomRelatedAction('rename')" class="context-menu-item"><i class="fa-solid fa-pencil w-4 text-center"></i><span>重命名</span></div>
        <div class="context-menu-divider"></div>
        <div @click="handleCustomRelatedAction('delete')" class="context-menu-item danger"><i class="fa-solid fa-trash-can w-4 text-center"></i><span>删除</span></div>
        <div class="context-menu-divider"></div>
      </template>
      <p class="menu-title">AI 助手</p>
      <div @click="handleAIAction('分析', node)" class="context-menu-item"><i class="fa-solid fa-magnifying-glass-chart w-4 text-center text-[#F59E0B]"></i><span>分析内容</span></div>
      <div @click="handleAIAction('续写', node)" class="context-menu-item"><i class="fa-solid fa-wand-magic-sparkles w-4 text-center text-[#4B5563]"></i><span>生成内容</span></div>
    </template>

    <!-- "相关"中的根节点 -->
    <template v-else-if="node?.type === 'root'">
      <!-- 设定根节点 -->
      <template v-if="node.id === 'settings'">
        <p class="menu-title">内容管理</p>
        <div @click="handleSettingsAction('newGroup')" class="context-menu-item"><i class="fa-solid fa-folder-plus w-4 text-center"></i><span>新建分组</span></div>
        <div @click="handleSettingsAction('newItem')" class="context-menu-item"><i class="fa-solid fa-plus w-4 text-center"></i><span>新建条目</span></div>
      </template>
      <!-- 剧情/分析根节点 -->
      <template v-else-if="node.id === 'plot' || node.id === 'analysis'">
        <p class="menu-title">内容管理</p>
        <div @click="handleCustomRelatedAction('newItem')" class="context-menu-item"><i class="fa-solid fa-plus w-4 text-center"></i><span>新建自定义条目</span></div>
      </template>
    </template>

    <!-- "相关"中的分组或设定条目 -->
    <template v-else-if="node">
      <template v-if="node.type === 'group' || node.type.endsWith('_item')">
        <p class="menu-title">内容管理</p>
        <div v-if="node.type === 'group'" @click="handleSettingsAction('newItem')" class="context-menu-item"><i class="fa-solid fa-plus w-4 text-center"></i><span>新建条目</span></div>
        <div class="context-menu-divider"></div>
        <p class="menu-title">节点操作</p>
        <div @click="handleSettingsAction('rename')" class="context-menu-item"><i class="fa-solid fa-pencil w-4 text-center"></i><span>重命名</span></div>
        <div class="context-menu-divider"></div>
        <div @click="handleSettingsAction('delete')" class="context-menu-item danger"><i class="fa-solid fa-trash-can w-4 text-center"></i><span>删除</span></div>
      </template>
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

const aiTaskStore = useAITaskStore();
const editorStore = useEditorStore();
const directoryStore = useDirectoryStore();
const relatedContentStore = useRelatedContentStore();
const notesStore = useNotesStore();
const contextPreviewStore = useContextMenuStore();

const visible = ref(false);
const position = ref({ x: 0, y: 0 });
const node = ref<TreeNode | null>(null);

const show = (event: MouseEvent, targetNode: TreeNode) => {
  node.value = targetNode;
  visible.value = true;
  position.value.x = event.clientX;
  position.value.y = event.clientY;
};

const hide = () => {
  visible.value = false;
  node.value = null;
};

const handleAIAction = (taskType: '续写' | '润色' | '分析', targetNode: TreeNode, isBatch = false) => {
  if (!targetNode) return;
  hide();

  if (isBatch && targetNode.type === 'volume' && 'chapters' in targetNode.originalData) {
    aiTaskStore.startBatchTaskForVolume(taskType, targetNode.originalData);
  } else {
    editorStore.openTab(targetNode.id);

    // 假设 openTab 后，目标项会成为 activeTab。
    // AI 任务可以基于这个 ID 启动。
    if (editorStore.uiState.needsPreview) {
      contextPreviewStore.show({
        type: taskType,
        targetItemId: targetNode.id,
        title: targetNode.title
      });
    } else {
      aiTaskStore.startNewTask(taskType, targetNode.id);
    }
  }
}

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

  switch(action) {
    case 'newItem':
      relatedContentStore.addCustomRelatedNode(nodeId as 'plot' | 'analysis');
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