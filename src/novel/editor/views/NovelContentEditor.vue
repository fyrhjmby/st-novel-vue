<template>
  <div class="novel-content-editor-wrapper" ref="wrapperRef" @contextmenu.prevent="showContextMenu">
    <FloatingToolbar ref="floatingToolbarRef" />
    <div class="editor-content-wrapper" ref="editorContentRef">
      <TiptapEditor
          :key="tab.id"
          v-model="editableContent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType, onMounted, onBeforeUnmount, watch } from 'vue';
import type { CoreItem, Tab } from '@core/types';
import { useEditableView } from '@core/editor/composables/useEditableView';
import { contextMenuService } from '@core/panes/service/ContextMenuService';

import TiptapEditor from '../components/content/TiptapEditor.vue';
import FloatingToolbar from '../components/content/FloatingToolbar.vue';

const props = defineProps({
  item: {
    type: Object as PropType<CoreItem>,
    required: true,
  },
  tab: {
    type: Object as PropType<Tab>,
    required: true,
  }
});

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
  if (!floatingToolbarRef.value || !wrapperRef.value || !editorContentRef.value) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed || !editorContentRef.value.contains(selection.getRangeAt(0).commonAncestorContainer)) {
    floatingToolbarRef.value.hide();
    return;
  }

  const paneStore = (window as any).pinia.state.value['core-pane'];
  if(paneStore.activePane?.activeTabId !== props.tab.id) {
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
.novel-content-editor-wrapper {
  flex-grow: 1;
  overflow-y: auto;
  position: relative;
  height: 100%;
}
.editor-content-wrapper {
  max-width: 42rem;
  margin: 2rem auto;
}
</style>