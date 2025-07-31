<template>
  <div class="pane-content-dispatcher">
    <template v-if="!activeTab">
      <div class="welcome-screen">
        <i class="fa-solid fa-feather-pointed text-6xl text-gray-300"></i>
        <h1 class="text-2xl font-medium text-gray-600 mt-6">星尘编辑器</h1>
        <p class="text-gray-500 mt-2">从左侧面板选择一个文件开始创作。</p>
      </div>
    </template>
    <template v-else-if="activeTab.item.type === 'system'">
      <component :is="systemViewComponent" :key="activeTab.id" :active-tab="activeTab" class="system-view-wrapper" />
    </template>
    <template v-else>
      <div class="content-area-wrapper" ref="wrapperRef" @scroll="handleScroll">
        <FloatingToolbar ref="floatingToolbarRef" />
        <EditorContextMenu ref="editorContextMenuRef" />
        <div class="editor-content-wrapper" ref="editorContentRef">
          <TiptapEditor
              :key="activeTab.id"
              :model-value="modelValue"
              :is-editable="!isCurrentTabReadOnly"
              @update:modelValue="emit('update:modelValue', $event)"
              @show-context-menu="emit('show-context-menu', $event)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, shallowRef, type PropType } from 'vue';
import type { TabInfo, RelatedTree } from '@/novel/editor/types';
import TiptapEditor from './TiptapEditor.vue';
import FloatingToolbar from './FloatingToolbar.vue';
import EditorContextMenu from './EditorContextMenu.vue';
import SearchView from '@/novel/editor/components/system/SearchView.vue';
import AIChatView from '@/novel/editor/components/ai/AIChatView.vue';
import AITaskPanel from '@/novel/editor/components/ai/AITaskPanel.vue';
import EditorSettings from '@/novel/editor/components/system/settings/EditorSettings.vue';
import ContextSettings from '@/novel/editor/components/system/settings/ContextSettings.vue';
import TaskSettings from '@/novel/editor/components/system/settings/TaskSettings.vue';
import AIConfigSettings from '@/novel/editor/components/system/settings/AIConfigSettings.vue';
import NovelSettings from '@/novel/editor/components/system/settings/NovelSettings.vue';
import ThemeSettings from '@/novel/editor/components/system/settings/ThemeSettings.vue';
import HistoryPanel from '@/novel/editor/components/system/HistoryPanel.vue';

const props = defineProps({
  activeTab: {
    type: Object as PropType<TabInfo | null>,
    default: null
  },
  modelValue: {
    type: String,
    default: ''
  },
  isActivePane: {
    type: Boolean,
    required: true,
  }
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'show-context-menu', event: MouseEvent): void;
}>();

const systemViewMap = shallowRef({
  SearchView,
  AIChatView,
  AITaskPanel,
  EditorSettings,
  ContextSettings,
  TaskSettings,
  AIConfigSettings,
  NovelSettings,
  ThemeSettings,
  HistoryPanel,
});

const systemViewComponent = computed(() => {
  if (props.activeTab?.item.type !== 'system') return null;
  const componentName = (props.activeTab.item as any).component;
  return systemViewMap.value[componentName] || null;
});

const isCurrentTabReadOnly = computed(() => {
  return (props.activeTab?.item as RelatedTree)?.isReadOnly === true;
});

const wrapperRef = ref<HTMLElement | null>(null);
const editorContentRef = ref<HTMLElement | null>(null);
const floatingToolbarRef = ref<InstanceType<typeof FloatingToolbar> | null>(null);
const editorContextMenuRef = ref<InstanceType<typeof EditorContextMenu> | null>(null);

const showContextMenu = (event: MouseEvent, container: HTMLElement | null) => {
  editorContextMenuRef.value?.show(event, container);
};

const handleSelectionChange = () => {
  if (!props.isActivePane || !floatingToolbarRef.value || !wrapperRef.value || !editorContentRef.value) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed || !editorContentRef.value.contains(selection.getRangeAt(0).commonAncestorContainer)) {
    floatingToolbarRef.value.hide();
    return;
  }
  floatingToolbarRef.value.show(selection.getRangeAt(0).getBoundingClientRect(), wrapperRef.value.getBoundingClientRect());
  editorContextMenuRef.value?.hide();
};

const handleScroll = () => {
  floatingToolbarRef.value?.hide();
  editorContextMenuRef.value?.hide();
};

const handleClickOutside = (event: MouseEvent) => {
  if (!wrapperRef.value?.contains(event.target as Node)) return;
  const target = event.target as HTMLElement;
  if (!target.closest('.context-menu') && !target.closest('.floating-toolbar')) {
    editorContextMenuRef.value?.hide();
    floatingToolbarRef.value?.hide();
  }
};

onMounted(() => {
  document.addEventListener('selectionchange', handleSelectionChange);
  document.addEventListener('click', handleClickOutside, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('selectionchange', handleSelectionChange);
  document.removeEventListener('click', handleClickOutside, true);
});

defineExpose({
  showContextMenu
});
</script>

<style scoped>
.pane-content-dispatcher {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #FFFFFF;
}
.system-view-wrapper {
  flex-grow: 1;
  overflow: hidden;
}
.content-area-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  position: relative;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.content-area-wrapper::-webkit-scrollbar {
  display: none;
}
.editor-content-wrapper {
  max-width: 42rem;
  margin: 2rem auto;
}
.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  user-select: none;
}
</style>