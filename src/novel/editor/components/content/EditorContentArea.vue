// 文件: src\novel\editor\components\content\EditorContentArea.vue
//

<template>
  <main class="editor-content-area-container" ref="editorWrapperRef">
    <!-- Header: 使用新拆分出的组件 -->
    <EditorHeader :active-item="activeItem" />

    <!-- Content: 编辑器核心区域 -->
    <div
        class="editor-scroll-wrapper"
        @scroll="handleScroll"
    >
      <!-- Floating Toolbar -->
      <FloatingToolbar ref="floatingToolbarRef" />

      <!-- Context Menu -->
      <EditorContextMenu ref="editorContextMenuRef" />

      <div class="editor-content-wrapper" ref="editorContentRef">
        <TiptapEditor
            v-if="activeItem && activeItem.content !== undefined"
            :key="activeItem.id"
            v-model="activeItemContent"
            @show-context-menu="showEditorContextMenu"
        />
        <div v-else class="placeholder">
          <div class="text-center">
            <i class="fa-regular fa-hand-pointer text-4xl text-gray-300"></i>
            <p class="mt-4 text-gray-500">
              {{ activeItem ? '该节点没有可编辑内容。' : '请从左侧目录选择一个项目进行查看或编辑。' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import EditorHeader from './EditorHeader.vue';
import TiptapEditor from './TiptapEditor.vue';
import FloatingToolbar from './FloatingToolbar.vue';
import EditorContextMenu from './EditorContextMenu.vue';

const editorStore = useEditorStore();
const editorWrapperRef = ref<HTMLElement | null>(null);
const editorContentRef = ref<HTMLElement | null>(null);
const floatingToolbarRef = ref<InstanceType<typeof FloatingToolbar> | null>(null);
const editorContextMenuRef = ref<InstanceType<typeof EditorContextMenu> | null>(null);

const activeItem = computed(() => editorStore.activeItem);

const activeItemContent = computed({
  get: () => (activeItem.value && 'content' in activeItem.value ? activeItem.value.content : '') || '',
  set: (newContent: string) => {
    if (activeItem.value) {
      editorStore.updateItemContentById(activeItem.value.id, newContent);
    }
  }
});

const showEditorContextMenu = (event: MouseEvent) => {
  editorContextMenuRef.value?.show(event, editorWrapperRef.value);
};

const handleSelectionChange = () => {
  if (!floatingToolbarRef.value || !editorWrapperRef.value || !editorContentRef.value) return;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed || !editorContentRef.value.contains(selection.getRangeAt(0).commonAncestorContainer)) {
    floatingToolbarRef.value.hide();
    return;
  }

  floatingToolbarRef.value.show(selection.getRangeAt(0).getBoundingClientRect(), editorWrapperRef.value.getBoundingClientRect());
  editorContextMenuRef.value?.hide();
};

const handleScroll = () => {
  floatingToolbarRef.value?.hide();
  editorContextMenuRef.value?.hide();
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.context-menu') && !target.closest('.floating-toolbar')) {
    editorContextMenuRef.value?.hide();
    floatingToolbarRef.value?.hide();
  }
}

onMounted(() => {
  document.addEventListener('selectionchange', handleSelectionChange);
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('selectionchange', handleSelectionChange);
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* [修正] 恢复原始样式，移除卡片化布局 */
.editor-content-area-container { display: flex; flex-direction: column; flex: 1; overflow: hidden; background-color: #F9FAFB; }
.editor-scroll-wrapper { flex: 1; overflow-y: auto; padding: 2rem 0; position: relative; }
.editor-content-wrapper { max-width: 42rem; margin: 0 auto; }
.placeholder { display: flex; align-items: center; justify-content: center; height: 100%; min-height: 200px; color: #6B7280; text-align: center; }

/* 主内容区滚动条样式 */
.editor-scroll-wrapper {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  transition: scrollbar-color 0.3s ease-out;
}
.editor-scroll-wrapper:hover {
  scrollbar-color: #D1D5DB transparent;
}
.editor-scroll-wrapper::-webkit-scrollbar {
  width: 8px;
}
.editor-scroll-wrapper::-webkit-scrollbar-track {
  background: transparent;
}
.editor-scroll-wrapper::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: content-box;
  transition: background-color 0.3s ease-out;
}
.editor-scroll-wrapper:hover::-webkit-scrollbar-thumb {
  background-color: #D1D5DB;
}
.editor-scroll-wrapper:hover::-webkit-scrollbar-thumb:hover {
  background-color: #9CA3AF;
}
</style>