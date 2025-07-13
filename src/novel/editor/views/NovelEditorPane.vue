<template>
  <div class="novel-editor-pane-container">
    <!-- Level 1: Breadcrumbs and Pane Actions (Replicates old EditorInstance top bar) -->
    <div class="top-header-bar">
      <BreadcrumbsBar :active-tab="tab" :is-active="isActivePane" />
      <PaneActions :pane-id="paneId" :is-active="isActivePane" />
    </div>

    <!-- Level 2: Content Area with Editor and Floating Toolbar -->
    <div class="content-area-wrapper" ref="wrapperRef" @contextmenu.prevent="showContextMenu">
      <FloatingToolbar ref="floatingToolbarRef" />
      <div class="editor-content-wrapper" ref="editorContentRef">
        <TiptapEditor
            :key="tab.id"
            v-model="editableContent"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onBeforeUnmount, type PropType } from 'vue';
import type { CoreItem, Tab } from '@core/types';
import { useEditableView } from '@core/editor/composables/useEditableView';
import { contextMenuService } from '@core/panes/service/ContextMenuService';
import { usePaneStore } from '@core/panes/stores/paneStore';

import TiptapEditor from '../components/content/TiptapEditor.vue';
import FloatingToolbar from '../components/content/FloatingToolbar.vue';
import BreadcrumbsBar from '../components/layout/BreadcrumbsBar.vue';
import PaneActions from '../components/layout/PaneActions.vue';

const props = defineProps({
  item: { type: Object as PropType<CoreItem>, required: true },
  tab: { type: Object as PropType<Tab>, required: true },
  // pane and isActivePane are not directly passed from core, but we can get them.
});

const paneStore = usePaneStore();
const paneId = computed(() => paneStore.findLeafContainingTab(props.tab.id)?.id ?? '');
const isActivePane = computed(() => paneStore.activePaneId === paneId.value);


const editableContent = ref(props.item.metadata.content || '');
useEditableView({
  tab: ref(props.tab),
  coreItem: ref(props.item),
  content: editableContent,
});


const wrapperRef = ref<HTMLElement | null>(null);
const editorContentRef = ref<HTMLElement | null>(null);
const floatingToolbarRef = ref<InstanceType<typeof FloatingToolbar> | null>(null);

const showContextMenu = (event: MouseEvent) => {
  contextMenuService.show(event, 'novel-editor-content', { itemId: props.item.id });
};

const handleSelectionChange = () => {
  if (!isActivePane.value || !floatingToolbarRef.value || !wrapperRef.value || !editorContentRef.value) {
    floatingToolbarRef.value?.hide();
    return;
  }
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed || !editorContentRef.value.contains(selection.getRangeAt(0).commonAncestorContainer)) {
    floatingToolbarRef.value.hide();
    return;
  }
  floatingToolbarRef.value.show(selection.getRangeAt(0).getBoundingClientRect(), wrapperRef.value.getBoundingClientRect());
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (floatingToolbarRef.value && !target.closest('.floating-toolbar')) {
    floatingToolbarRef.value.hide();
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
</script>

<style scoped>
.novel-editor-pane-container { display: flex; flex-direction: column; height: 100%; overflow: hidden; }
.top-header-bar { display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; background-color: #FFFFFF; border-bottom: 1px solid #E5E7EB; }
.content-area-wrapper { flex-grow: 1; overflow-y: auto; position: relative; }
.editor-content-wrapper { max-width: 42rem; margin: 2rem auto; }
</style>