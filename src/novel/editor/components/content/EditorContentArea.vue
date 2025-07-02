<template>
  <main class="editor-content-area-container" ref="editorWrapperRef">
    <!-- Header: 恢复所有UI元素，并从 activeItem 获取数据 -->
    <header class="header">
      <div v-if="activeItem" class="header-left">
        <span class="item-icon" :class="getIconClass(activeItem).split(' ').slice(2).join(' ')">
            <i :class="getIconClass(activeItem)"></i>
        </span>
        <span class="item-title">{{ activeItem.title }}</span>
        <span v-if="activeItem.type === 'chapter' && activeItem.status === 'editing'" class="item-status-badge">
          已保存
        </span>
      </div>
      <div v-else class="header-left">
        <span class="item-title">请从左侧选择一个文档</span>
      </div>

      <!-- Right side: 恢复字数统计和操作按钮 -->
      <div v-if="activeItem" class="header-right">
        <div class="stats">
          <span v-if="wordCount > 0">字数: {{ wordCount }}</span>
          <template v-if="readingTime > 0">
            <span class="divider">•</span>
            <span>预计阅读: {{ readingTime }}分钟</span>
          </template>
        </div>
        <div class="actions">
          <!-- [修复] 绑定到阅读模式页面 -->
          <router-link to="/novel/read" class="action-btn" title="阅读模式"><i class="fa-solid fa-book-open-reader"></i></router-link>
          <!-- [修复] 绑定到历史版本页面 -->
          <router-link to="/novel/manage/history" class="action-btn" title="历史版本"><i class="fa-solid fa-clock-rotate-left"></i></router-link>
          <button class="action-btn" title="更多选项"><i class="fa-solid fa-ellipsis-vertical"></i></button>
        </div>
      </div>
    </header>

    <!-- Content: 编辑器核心区域 -->
    <div
        class="editor-scroll-wrapper"
        @scroll="handleScroll"
    >
      <!-- [修复] 将右键事件监听移到 TiptapEditor 内部处理更可靠，这里移除 -->

      <!-- Floating Toolbar -->
      <FloatingToolbar ref="floatingToolbarRef" />

      <!-- Context Menu -->
      <EditorContextMenu ref="editorContextMenuRef" />

      <div class="editor-content-wrapper" ref="editorContentRef">
        <TiptapEditor
            v-if="activeItem"
            :key="activeItem.id"
            v-model="activeItemContent"
            @show-context-menu="showEditorContextMenu"
        />
        <div v-else class="placeholder">
          <div class="text-center">
            <i class="fa-regular fa-hand-pointer text-4xl text-gray-300"></i>
            <p class="mt-4 text-gray-500">请从左侧目录选择一个项目进行查看或编辑。</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import TiptapEditor from './TiptapEditor.vue';
import FloatingToolbar from './FloatingToolbar.vue';
import EditorContextMenu from './EditorContextMenu.vue';

const editorStore = useEditorStore();
const editorWrapperRef = ref<HTMLElement | null>(null);
const editorContentRef = ref<HTMLElement | null>(null);
const floatingToolbarRef = ref<InstanceType<typeof FloatingToolbar> | null>(null);
const editorContextMenuRef = ref<InstanceType<typeof EditorContextMenu> | null>(null);

// [修复] activeItem 从 store 中获取
const activeItem = computed(() => editorStore.activeItem);

// [修复] activeItemContent 通过 v-model 与 TiptapEditor 绑定
const activeItemContent = computed({
  get: () => activeItem.value?.content || '',
  set: (newContent: string) => {
    if (activeItem.value) {
      // 通过 action 更新 store 中的内容
      editorStore.updateItemContentById(activeItem.value.id, newContent);
    }
  }
});

const wordCount = computed(() => (activeItem.value?.type === 'chapter' && (activeItem.value as any).wordCount) ? (activeItem.value as any).wordCount : 0);
const readingTime = computed(() => {
  if (!wordCount.value) return 0;
  // 平均阅读速度 300 字/分钟
  const time = Math.ceil(wordCount.value / 300);
  return time > 0 ? time : 1;
});

const getIconClass = (item: any): string => {
  const typeIcons: Record<string, string> = {
    volume: 'fa-solid fa-book-open text-orange-500',
    chapter: 'fa-solid fa-file-lines text-blue-600',
    character_profile: 'fa-solid fa-user text-teal-500',
    worldview_doc: 'fa-solid fa-earth-americas text-sky-500',
    note: 'fa-solid fa-note-sticky text-yellow-500',
  };
  return typeIcons[item.type] || 'fa-solid fa-question text-gray-400';
}

// [修复] showEditorContextMenu 现在由 TiptapEditor emit 的事件触发
const showEditorContextMenu = (event: MouseEvent) => {
  editorContextMenuRef.value?.show(event, editorWrapperRef.value);
};

const handleSelectionChange = () => {
  if (!floatingToolbarRef.value || !editorWrapperRef.value || !editorContentRef.value) return;

  const selection = window.getSelection();
  // 检查选区是否存在、非空，并且是否在编辑器内容区域内
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed || !editorContentRef.value.contains(selection.getRangeAt(0).commonAncestorContainer)) {
    floatingToolbarRef.value.hide();
    return;
  }

  // 显示浮动工具栏，并隐藏右键菜单
  floatingToolbarRef.value.show(selection.getRangeAt(0).getBoundingClientRect(), editorWrapperRef.value.getBoundingClientRect());
  editorContextMenuRef.value?.hide();
};

// 滚动时隐藏所有浮动菜单
const handleScroll = () => {
  floatingToolbarRef.value?.hide();
  editorContextMenuRef.value?.hide();
}

// 全局点击事件，用于隐藏菜单
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
.editor-content-area-container { display: flex; flex-direction: column; flex: 1; overflow: hidden; background-color: #FFFFFF; }
.header { height: 4rem; padding: 0 1.5rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #F3F4F6; flex-shrink: 0; }
.header-left { display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; }
.item-icon { width: 1.25rem; text-align: center; }
.item-title { font-weight: 500; color: #1F2937; }
.item-status-badge { font-size: 0.75rem; font-weight: 500; padding: 0.125rem 0.5rem; border-radius: 9999px; color: #15803D; background-color: #DCFCE7; }
.header-right { display: flex; align-items: center; gap: 1rem; }
.stats { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: #6B7280; }
.stats .divider { color: #D1D5DB; }
.actions { display: flex; align-items: center; gap: 0.25rem; }
.action-btn { width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; color: #6B7280; border-radius: 0.5rem; transition: background-color 0.15s; }
.action-btn:hover { background-color: #F3F4F6; }
.editor-scroll-wrapper { flex: 1; overflow-y: auto; padding: 2rem 0; position: relative; }
.editor-content-wrapper { max-width: 42rem; margin: 0 auto; }
.placeholder { display: flex; align-items: center; justify-content: center; height: 100%; min-height: 200px; color: #6B7280; text-align: center; }
</style>