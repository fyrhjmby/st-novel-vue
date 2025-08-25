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
        @dispatch-action="handleAction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, defineAsyncComponent, shallowRef } from 'vue';
import type { TreeNode } from '@/novel/editor/types';
import { useAITaskExecutor } from '@/novel/editor/composables/useAITaskExecutor';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import { useDirectoryStore } from '@/novel/editor/stores/directoryStore';
import { useRelatedContentStore } from '@/novel/editor/stores/relatedContentStore';
import { useNotesStore } from '@/novel/editor/stores/notesStore';
import { usePromptTemplateStore } from '@/novel/editor/stores/promptTemplateStore';
import { useUIStore } from '@/novel/editor/stores/uiStore';
import { useAITaskStore } from '@/novel/editor/stores/ai/aiTaskStore';
import { useDerivedContentStore } from '@/novel/editor/stores/derivedContentStore';

// --- 组件映射 ---
const menuComponentMap = shallowRef({
  'volume': defineAsyncComponent(() => import('./context-menus/VolumeMenu.vue')),
  'chapter': defineAsyncComponent(() => import('./context-menus/ChapterMenu.vue')),
  'group': defineAsyncComponent(() => import('./context-menus/GroupMenu.vue')),
  'item': defineAsyncComponent(() => import('./context-menus/ItemMenu.vue')),
  'root': defineAsyncComponent(() => import('./context-menus/RootMenu.vue')),
  'others': defineAsyncComponent(() => import('./context-menus/OthersMenu.vue')),
  'others_item': defineAsyncComponent(() => import('./context-menus/OthersItemMenu.vue')),
  'custom_related': defineAsyncComponent(() => import('./context-menus/CustomRelatedMenu.vue')),
  'note': defineAsyncComponent(() => import('./context-menus/NoteMenu.vue')),
  'setting_root': defineAsyncComponent(() => import('./context-menus/SettingsRootMenu.vue')),
  'prompt_group': defineAsyncComponent(() => import('./context-menus/PromptGroupMenu.vue')),
  'prompt_item': defineAsyncComponent(() => import('./context-menus/PromptItemMenu.vue')),
});

// --- State and Props ---
const visible = ref(false);
const position = ref({ x: 0, y: 0 });
const node = ref<TreeNode | null>(null);
const menuRef = ref<HTMLElement | null>(null);

// --- Stores and Composables ---
const { executeAITask } = useAITaskExecutor();
const editorStore = useEditorStore();
const directoryStore = useDirectoryStore();
const relatedContentStore = useRelatedContentStore();
const notesStore = useNotesStore();
const promptTemplateStore = usePromptTemplateStore();
const uiStore = useUIStore();
const aiTaskStore = useAITaskStore();
const derivedContentStore = useDerivedContentStore();

// --- Computed ---
const menuComponent = computed(() => {
  if (!node.value) return null;
  const { type, id } = node.value;

  if (type === 'prompt_group' || type === 'prompt_item') return menuComponentMap.value[type];
  if (id.startsWith('custom-others-')) return menuComponentMap.value['others_item'];
  if (id.startsWith('custom-')) return menuComponentMap.value['custom_related'];

  if (type === 'root') {
    if (id === 'setting') return menuComponentMap.value['setting_root'];
    if (id === 'plot' || id === 'analysis') return menuComponentMap.value['root'];
    if (id === 'others') return menuComponentMap.value['others'];
    return null;
  }

  if (type in menuComponentMap.value) return menuComponentMap.value[type as keyof typeof menuComponentMap.value];
  if (type.endsWith('_item')) return menuComponentMap.value['item'];

  return null;
});

// --- Core Logic ---
const show = (event: MouseEvent, targetNode: TreeNode) => {
  if (targetNode.isOverview || (targetNode.isReadOnly && targetNode.type !== 'prompt_group') || targetNode.type.startsWith('reference_')) {
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

// --- Centralized Action Handler ---
const handleAction = async (event: { type: string; payload?: any }) => {
  if (!node.value) return; // Guard against race conditions

  const { type, payload } = event;
  const nodeId = node.value.id;
  const nodeType = node.value.type;

  hide(); // Hide menu immediately on action

  switch (type) {
    case 'rename':
      uiStore.setEditingNodeId(nodeId);
      break;

    case 'delete':
      if (nodeType === 'volume' || nodeType === 'chapter') {
        if (await directoryStore.deleteNode(nodeId)) editorStore.closeTab(nodeId);
      } else if (nodeType === 'note') {
        if (await notesStore.deleteNote(nodeId)) editorStore.closeTab(nodeId);
      } else if (nodeType === 'prompt_item') {
        if (confirm('确定要删除这个提示词模板吗？')) {
          if (promptTemplateStore.deletePrompt(nodeId)) editorStore.closeTab(nodeId);
        }
      } else if (nodeId.startsWith('custom-others-')) {
        if (relatedContentStore.deleteCustomOthersNode(nodeId)) editorStore.closeTab(nodeId);
      } else if (nodeId.startsWith('custom-')) {
        if (relatedContentStore.deleteCustomRelatedNode(nodeId)) editorStore.closeTab(nodeId);
      } else if (nodeType === 'plot_item' || nodeType === 'analysis_item') {
        if (await derivedContentStore.deleteDerivedItem(nodeId)) editorStore.closeTab(nodeId);
      } else { // Handles generic settings items (character_item, etc.)
        if (relatedContentStore.deleteRelatedNode(nodeId)) editorStore.closeTab(nodeId);
      }
      break;

    case 'ai-task':
      if (payload.isBatch && nodeType === 'volume' && 'originalData' in node.value) {
        aiTaskStore.startBatchTaskForVolume(payload.taskType, node.value.originalData);
      } else {
        executeAITask(payload.taskType, { id: nodeId, title: node.value.title });
      }
      break;

    case 'new-volume':
      const newVolume = await directoryStore.addNewVolume();
      if (newVolume) uiStore.setEditingNodeId(newVolume.id);
      break;

    case 'new-chapter':
      const newChapter = await directoryStore.addChapterToVolume(nodeId);
      if (newChapter) {
        uiStore.ensureNodeIsExpanded(nodeId);
        editorStore.openTab(newChapter.id);
        uiStore.setEditingNodeId(newChapter.id);
      }
      break;

    case 'new-group':
      const newGroup = relatedContentStore.addRelatedNode(nodeId, 'group');
      if (newGroup) {
        uiStore.ensureRelatedNodeIsExpanded(nodeId);
        uiStore.setEditingNodeId(newGroup.id);
      }
      break;

    case 'new-item':
      if (nodeType === 'root' && (nodeId === 'plot' || nodeId === 'analysis')) {
        const newItem = relatedContentStore.addCustomRelatedNode(payload.target);
        uiStore.ensureRelatedNodeIsExpanded(payload.target);
        editorStore.openTab(newItem.id);
        uiStore.setEditingNodeId(newItem.id);
      } else if (nodeType === 'root' && nodeId === 'others') {
        const newItem = relatedContentStore.addCustomOthersNode();
        uiStore.ensureRelatedNodeIsExpanded('others');
        editorStore.openTab(newItem.id);
        uiStore.setEditingNodeId(newItem.id);
      } else { // Generic new item in a group
        const newItem = relatedContentStore.addRelatedNode(nodeId, 'item');
        if (newItem) {
          uiStore.ensureRelatedNodeIsExpanded(nodeId);
          editorStore.openTab(newItem.id);
          uiStore.setEditingNodeId(newItem.id);
        }
      }
      break;

    case 'new-prompt':
      const newPrompt = promptTemplateStore.addPrompt(nodeId, '新建提示词', '在这里输入你的提示词模板...');
      if (newPrompt) {
        uiStore.ensureRelatedNodeIsExpanded(nodeId);
        editorStore.openTab(newPrompt.id);
        uiStore.setEditingNodeId(newPrompt.id);
      }
      break;
  }
};

// --- Lifecycle & Event Handling ---
const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    hide();
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside, true);
  window.addEventListener('contextmenu', hide, true);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside, true);
  window.removeEventListener('contextmenu', hide, true);
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