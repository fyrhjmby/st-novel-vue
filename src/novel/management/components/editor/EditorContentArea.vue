// =
// 文件: ..\src\novel\management\components\editor\EditorContentArea.vue
//
<template>
  <main class="flex-1 flex flex-col overflow-hidden bg-white">
    <!-- Header with all UI elements -->
    <div class="h-16 px-6 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
      <!-- Left side: Icon and Title -->
      <div class="flex items-center gap-3 text-sm">
        <span v-if="activeItem.icon" class="w-5 h-5 flex items-center justify-center" :class="typeToColorClass(activeItem.type)" v-html="renderIcon(activeItem.icon)"></span>
        <span class="font-medium text-[#374151]">{{ activeItem.title }}</span>
        <span v-if="activeItem.status === 'editing'" class="text-xs font-medium px-2 py-0.5 rounded-full text-green-700 bg-green-100">已保存</span>
      </div>

      <!-- Right side: Stats and Action Buttons -->
      <div class="flex items-center gap-4">
        <!-- Stats -->
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <span v-if="activeItem.wordCount">字数: {{ activeItem.wordCount }}</span>
          <template v-if="readingTime > 0">
            <span class="text-gray-300">•</span>
            <span>预计阅读: {{ readingTime }}分钟</span>
          </template>
        </div>
        <!-- Action Buttons from UI Mockup -->
        <div class="flex items-center gap-1">
          <button class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="阅读模式">
            <i class="fa-solid fa-book-open-reader"></i>
          </button>
          <button class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="历史版本">
            <i class="fa-solid fa-clock-rotate-left"></i>
          </button>
          <button class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="更多选项">
            <i class="fa-solid fa-ellipsis-vertical"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Content Area Wrapper for Events -->
    <div
        ref="editorWrapperRef"
        @contextmenu.prevent="showContextMenu"
        class="flex-1 p-8 overflow-y-auto hide-scrollbar relative"
    >
      <!-- Floating Toolbar for Text Selection -->
      <div
          v-if="isToolbarVisible"
          :style="{ top: `${toolbarPosition.top}px`, left: `${toolbarPosition.left}px` }"
          class="absolute z-10 bg-white border border-gray-200 rounded-lg p-1.5 shadow-md flex gap-1"
      >
        <button title="分析内容" class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md transition-colors"><i class="fa-solid fa-magnifying-glass-chart"></i></button>
        <button title="AI生成" class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md transition-colors"><i class="fa-solid fa-wand-magic-sparkles"></i></button>
        <button title="润色文本" class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md transition-colors"><i class="fa-solid fa-spell-check"></i></button>
      </div>

      <!-- [重构] Custom Context Menu -->
      <div
          v-if="isContextMenuVisible"
          :style="{ top: `${contextMenuPosition.top}px`, left: `${contextMenuPosition.left}px` }"
          class="absolute z-20 w-64 bg-white rounded-xl shadow-2xl p-2 border border-gray-100"
          @click.stop
      >
      <p class="px-3 pt-1 pb-1 text-xs text-[#9CA3AF] font-medium uppercase tracking-wider">AI生成任务</p>
      <a @click="hideAllMenus" href="#" class="context-menu-item">
        <i class="fa-solid fa-wand-magic-sparkles w-4 text-center text-[#4B5563]"></i>
        <span>续写内容</span>
      </a>
      <a @click="hideAllMenus" href="#" class="context-menu-item">
        <i class="fa-solid fa-palette w-4 text-center text-[#3B82F6]"></i>
        <span>改写风格</span>
      </a>
      <a @click="hideAllMenus" href="#" class="context-menu-item">
        <i class="fa-solid fa-expand w-4 text-center text-[#10B981]"></i>
        <span>扩充内容</span>
      </a>

      <div class="h-px bg-gray-100 my-2"></div>

      <p class="px-3 pt-1 pb-1 text-xs text-[#9CA3AF] font-medium uppercase tracking-wider">分析任务</p>
      <a @click="hideAllMenus" href="#" class="context-menu-item">
        <i class="fa-solid fa-magnifying-glass-chart w-4 text-center text-[#F59E0B]"></i>
        <span>情感分析</span>
      </a>
      <a @click="hideAllMenus" href="#" class="context-menu-item">
        <i class="fa-solid fa-check-double w-4 text-center text-[#4B5563]"></i>
        <span>逻辑检查</span>
      </a>
    </div>

    <!-- Rendered Content -->
    <div class="max-w-prose mx-auto" ref="editorContentRef">
      <div class="prose prose-lg max-w-none" v-html="activeItem.content"></div>
    </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

const props = defineProps({
  activeItem: {
    type: Object,
    required: true,
    default: () => ({ title: '未选择', content: '请从左侧选择一个项目进行查看或编辑。' })
  }
});

// --- Refs for DOM elements ---
const editorWrapperRef = ref<HTMLElement | null>(null);
const editorContentRef = ref<HTMLElement | null>(null);

// --- Computed Property for Reading Time ---
const readingTime = computed(() => {
  if (!props.activeItem.wordCount || props.activeItem.wordCount === 0) return 0;
  // Using an average reading speed of 300 words per minute
  const time = Math.ceil(props.activeItem.wordCount / 300);
  return time > 0 ? time : 1; // Show at least 1 minute for any content
});

// --- State for Toolbar and Context Menu ---
const isToolbarVisible = ref(false);
const toolbarPosition = ref({ top: 0, left: 0 });
const isContextMenuVisible = ref(false);
const contextMenuPosition = ref({ top: 0, left: 0 });

// --- Event Handlers ---
const handleSelectionChange = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed || !editorContentRef.value) {
    isToolbarVisible.value = false;
    return;
  }

  const range = selection.getRangeAt(0);
  if (!editorContentRef.value.contains(range.commonAncestorContainer)) {
    isToolbarVisible.value = false;
    return;
  }

  const rect = range.getBoundingClientRect();
  const wrapperRect = editorWrapperRef.value!.getBoundingClientRect();

  toolbarPosition.value = {
    top: rect.top - wrapperRect.top - 48, // Position above the selection
    left: rect.left - wrapperRect.left + rect.width / 2 - 60, // Center the toolbar
  };
  isToolbarVisible.value = true;
  isContextMenuVisible.value = false; // Hide context menu if text is selected
};

const showContextMenu = (event: MouseEvent) => {
  const wrapperRect = editorWrapperRef.value!.getBoundingClientRect();
  contextMenuPosition.value = {
    top: event.clientY - wrapperRect.top,
    left: event.clientX - wrapperRect.left,
  };
  isContextMenuVisible.value = true;
  isToolbarVisible.value = false; // Hide toolbar when context menu is shown
};

const hideAllMenus = () => {
  isToolbarVisible.value = false;
  isContextMenuVisible.value = false;
};

// --- Lifecycle Hooks for global listeners ---
onMounted(() => {
  document.addEventListener('selectionchange', handleSelectionChange);
  // [重构] 简化事件监听逻辑，点击文档中任何地方都会关闭菜单
  document.addEventListener('click', hideAllMenus);
  editorWrapperRef.value?.addEventListener('scroll', hideAllMenus, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('selectionchange', handleSelectionChange);
  document.removeEventListener('click', hideAllMenus);
  editorWrapperRef.value?.removeEventListener('scroll', hideAllMenus, true);
});


// --- Helper Functions ---
const renderIcon = (iconClass: string) => `<i class="${iconClass}"></i>`;
const typeToColorClass = (type: string) => {
  if (type?.startsWith('character')) return 'text-teal-500';
  if (type?.startsWith('worldview')) return 'text-sky-500';
  if (type?.startsWith('note')) return 'text-yellow-500';
  return 'text-gray-500';
};
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* [重构] 新增右键菜单项的样式 */
.context-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem; /* 12px */
  padding: 0.5rem 0.75rem; /* 8px 12px */
  font-size: 0.875rem; /* 14px */
  color: #374151; /* text-gray-700 */
  border-radius: 0.5rem; /* rounded-lg */
  transition: background-color 0.15s ease-in-out;
  cursor: pointer;
  text-decoration: none;
}
.context-menu-item:hover {
  background-color: #F3F4F6; /* hover:bg-gray-100 */
}
</style>