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
        @rename="handleRename"
        @delete="handleGenericDelete"
        @ai-task="handleAiTask"
        @new-chapter="handleNewChapter"
        @new-volume="handleNewVolume"
        @new-group="handleGenericNewGroup"
        @new-item="handleGenericNewItem"
        @new-prompt="handleNewPrompt"
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
import type { AITask } from '@/novel/editor/types';

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

// --- Stores and Composables ---
const { executeAITask } = useAITaskExecutor();
const editorStore = useEditorStore();
const directoryStore = useDirectoryStore();
const relatedContentStore = useRelatedContentStore();
const notesStore = useNotesStore();
const promptTemplateStore = usePromptTemplateStore();
const uiStore = useUIStore();

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

// --- Event Handlers (New Simplified Structure) ---

// Generic Dispatchers
const handleGenericDelete = () => {
  if (!node.value) return;
  const { type, id } = node.value;

  if (type === 'volume' || type === 'chapter') {
    handleDeleteDirectoryNode();
  } else if (type === 'note') {
    handleDeleteNote();
  } else if (type === 'prompt_item') {
    handleDeletePrompt();
  } else if (id.startsWith('custom-others-')) {
    handleDeleteOthersNode();
  } else if (id.startsWith('custom-')) {
    handleDeleteCustomRelatedNode();
  } else {
    handleDeleteRelatedNode();
  }
};

const handleGenericNewItem = (payload?: 'plot' | 'analysis') => {
  if (!node.value) return;
  const { type, id } = node.value;
  if (type === 'root' && (id === 'plot' || id === 'analysis')) {
    handleNewCustomItem(payload!);
  } else if (id === 'others') {
    handleNewOthersItem();
  } else {
    handleNewSettingsItem();
  }
};

const handleGenericNewGroup = () => {
  handleNewSettingsGroup();
};

// AI Task
const handleAiTask = (taskType: AITask['type'], isBatch = false) => {
  hide();
  if (!node.value) return;
  if (isBatch && node.value.type === 'volume' && 'originalData' in node.value && node.value.originalData.type === 'volume') {
    const aiTaskStore = (async () => (await import('@/novel/editor/stores/ai/aiTaskStore')).useAITaskStore())();
    aiTaskStore.then(store => store.startBatchTaskForVolume(taskType, node.value!.originalData));
  } else {
    executeAITask(taskType, { id: node.value.id, title: node.value.title });
  }
};

const handleRename = () => {
  hide();
  if (node.value) uiStore.setEditingNodeId(node.value.id);
};

// Directory Actions
const handleNewChapter = async () => {
  hide();
  if (node.value) {
    const newChapter = await directoryStore.addChapterToVolume(node.value.id);
    if (newChapter) {
      uiStore.ensureNodeIsExpanded(node.value.id);
      editorStore.openTab(newChapter.id);
      uiStore.setEditingNodeId(newChapter.id);
    }
  }
};
const handleNewVolume = async () => {
  hide();
  const newVolume = await directoryStore.addNewVolume();
  if (newVolume) {
    uiStore.setEditingNodeId(newVolume.id);
  }
};
const handleDeleteDirectoryNode = async () => {
  hide();
  if (node.value) {
    if (await directoryStore.deleteNode(node.value.id)) {
      editorStore.closeTab(node.value.id);
    }
  }
};

// Settings / Related Actions
const handleNewSettingsGroup = () => {
  hide();
  if (node.value) {
    const newNode = relatedContentStore.addRelatedNode(node.value.id, 'group');
    if (newNode) {
      uiStore.ensureRelatedNodeIsExpanded(node.value.id);
      uiStore.setEditingNodeId(newNode.id);
    }
  }
};
const handleNewSettingsItem = () => {
  hide();
  if (node.value) {
    const newNode = relatedContentStore.addRelatedNode(node.value.id, 'item');
    if (newNode) {
      uiStore.ensureRelatedNodeIsExpanded(node.value.id);
      editorStore.openTab(newNode.id);
      uiStore.setEditingNodeId(newNode.id);
    }
  }
};
const handleDeleteRelatedNode = () => {
  hide();
  if (node.value && relatedContentStore.deleteRelatedNode(node.value.id)) {
    editorStore.closeTab(node.value.id);
  }
};

// Custom Plot/Analysis Actions
const handleNewCustomItem = (target: 'plot' | 'analysis') => {
  hide();
  const newNode = relatedContentStore.addCustomRelatedNode(target);
  uiStore.ensureRelatedNodeIsExpanded(target);
  editorStore.openTab(newNode.id);
  uiStore.setEditingNodeId(newNode.id);
};
const handleDeleteCustomRelatedNode = () => {
  hide();
  if (node.value && relatedContentStore.deleteCustomRelatedNode(node.value.id)) {
    editorStore.closeTab(node.value.id);
  }
};

// Others Actions
const handleNewOthersItem = () => {
  hide();
  const newNode = relatedContentStore.addCustomOthersNode();
  uiStore.ensureRelatedNodeIsExpanded('others');
  editorStore.openTab(newNode.id);
  uiStore.setEditingNodeId(newNode.id);
};
const handleDeleteOthersNode = () => {
  hide();
  if (node.value && relatedContentStore.deleteCustomOthersNode(node.value.id)) {
    editorStore.closeTab(node.value.id);
  }
};

// Note Actions
const handleDeleteNote = async () => {
  hide();
  if (node.value) {
    if (await notesStore.deleteNote(node.value.id)) {
      editorStore.closeTab(node.value.id);
    }
  }
};

// Prompt Actions
const handleNewPrompt = () => {
  hide();
  if(!node.value) return;
  const newNode = promptTemplateStore.addPrompt(node.value.id, '新建提示词', '在这里输入你的提示词模板...');
  if (newNode) {
    uiStore.ensureRelatedNodeIsExpanded(node.value.id);
    editorStore.openTab(newNode.id);
    uiStore.setEditingNodeId(newNode.id);
  }
};

const handleDeletePrompt = () => {
  hide();
  if (!node.value) return;
  if (confirm('确定要删除这个提示词模板吗？')) {
    if (promptTemplateStore.deletePrompt(node.value.id)) {
      editorStore.closeTab(node.value.id);
    }
  }
};

// --- Lifecycle ---
onMounted(() => { window.addEventListener('click', hide); });
onBeforeUnmount(() => { window.removeEventListener('click', hide); });

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