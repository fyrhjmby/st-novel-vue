// 文件: src/novel/editor/components/sidebar/DirectoryContextMenu.vue
<template>
  <div
      v-if="visible && menuComponent"
      class="context-menu"
      :style="{ top: `${position.y}px`, left: `${position.x}px` }"
      @click.stop
  >
    <component
        :is="menuComponent"
        :node="node!"
        @action="handleAction"
        @ai-action="handleAIAction"
        @settings-action="handleSettingsAction"
        @custom-related-action="handleCustomRelatedAction"
        @note-action="handleNoteAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, defineAsyncComponent, shallowRef } from 'vue';
import type { TreeNode } from '@/novel/editor/types';
import { useAITaskExecutor } from '@/novel/editor/composables/useAITaskExecutor';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import { useDirectoryStore } from '@/novel/editor/stores/directoryStore';
import { useRelatedContentStore } from '@/novel/editor/stores/relatedContentStore';
import { useNotesStore } from '@/novel/editor/stores/notesStore';
import type { AITask } from '@/novel/editor/types';

// --- 组件映射 ---
const menuComponentMap = shallowRef({
  'volume': defineAsyncComponent(() => import('./context-menus/VolumeMenu.vue')),
  'chapter': defineAsyncComponent(() => import('./context-menus/ChapterMenu.vue')),
  'group': defineAsyncComponent(() => import('./context-menus/GroupMenu.vue')),
  'item': defineAsyncComponent(() => import('./context-menus/ItemMenu.vue')),
  'root': defineAsyncComponent(() => import('./context-menus/RootMenu.vue')),
  'custom_related': defineAsyncComponent(() => import('./context-menus/CustomRelatedMenu.vue')),
  'note': defineAsyncComponent(() => import('./context-menus/NoteMenu.vue')),
});

// --- State and Props ---
const visible = ref(false);
const position = ref({ x: 0, y: 0 });
const node = ref<TreeNode | null>(null);

// --- Stores and Composables ---
const { executeAITask } = useAITaskExecutor();
const editorStore = useEditorStore();
const directoryStore = useDirectoryStore();
const relatedContentStore = useRelatedContentStore();
const notesStore = useNotesStore();

// --- Computed ---
const menuComponent = computed(() => {
  if (!node.value) return null;
  const { type, id } = node.value;

  if (menuComponentMap.value[type]) {
    return menuComponentMap.value[type];
  }
  if (type === 'root' && (id === 'plot' || id === 'analysis')) {
    return menuComponentMap.value['root'];
  }
  if (id.startsWith('custom-')) {
    return menuComponentMap.value['custom_related'];
  }
  if (type.endsWith('_item')) {
    return menuComponentMap.value['item'];
  }
  return null;
});

// --- Core Logic ---
const show = (event: MouseEvent, targetNode: TreeNode) => {
  if (targetNode.isReadOnly || targetNode.type.endsWith('_overview')) {
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

// --- Event Handlers ---
const handleAIAction = (taskType: AITask['type'], sourceNode: TreeNode, isBatch = false) => {
  hide();
  if (isBatch && sourceNode.type === 'volume' && 'originalData' in sourceNode && sourceNode.originalData.type === 'volume') {
    const aiTaskStore = (async () => (await import('@/novel/editor/stores/aiTaskStore')).useAITaskStore())();
    aiTaskStore.then(store => store.startBatchTaskForVolume(taskType, sourceNode.originalData));
  } else {
    executeAITask(taskType, { id: sourceNode.id, title: sourceNode.title });
  }
};

const handleAction = (action: string, payload: any) => {
  hide();
  const nodeId = payload?.nodeId;
  switch (action) {
    case 'newChapter': directoryStore.addChapterToVolume(nodeId); break;
    case 'newVolume': directoryStore.addNewVolume(); break;
    case 'rename': editorStore.setEditingNodeId(nodeId); break;
    case 'delete': directoryStore.deleteNode(nodeId); break;
  }
};

const handleSettingsAction = (action: string, payload: any) => {
  hide();
  const nodeId = payload?.nodeId;
  switch (action) {
    case 'newGroup': relatedContentStore.addRelatedNode(nodeId, 'group'); break;
    case 'newItem': relatedContentStore.addRelatedNode(nodeId, 'item'); break;
    case 'rename': editorStore.setEditingNodeId(nodeId); break;
    case 'delete': relatedContentStore.deleteRelatedNode(nodeId); break;
  }
};

const handleCustomRelatedAction = (action: string, payload: any) => {
  hide();
  const nodeId = payload?.nodeId;
  const target = node.value?.id === 'plot' ? 'plot' : 'analysis';
  switch(action) {
    case 'newItem': relatedContentStore.addCustomRelatedNode(target); break;
    case 'rename': editorStore.setEditingNodeId(nodeId); break;
    case 'delete': relatedContentStore.deleteCustomRelatedNode(nodeId); break;
  }
};

const handleNoteAction = (action: string, payload: any) => {
  hide();
  const nodeId = payload?.nodeId;
  switch (action) {
    case 'rename': editorStore.setEditingNodeId(nodeId); break;
    case 'delete': notesStore.deleteNote(nodeId); break;
  }
};

// --- Lifecycle ---
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
</style>