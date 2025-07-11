<template>
  <div
      v-if="visible"
      class="context-menu"
      :style="{ top: `${position.y}px`, left: `${position.x}px` }"
      @click.stop
  >
    <p class="menu-title">AI生成任务</p>
    <a @click="handleExecute('续写')" href="#" class="context-menu-item">
      <i class="fa-solid fa-wand-magic-sparkles w-4 text-center text-[#4B5563]"></i>
      <span>续写内容</span>
    </a>
    <a @click="handleExecute('润色')" href="#" class="context-menu-item">
      <i class="fa-solid fa-palette w-4 text-center text-[#3B82F6]"></i>
      <span>润色内容</span>
    </a>
    <div class="context-menu-divider"></div>
    <p class="menu-title">分析任务</p>
    <a @click="handleExecute('分析')" href="#" class="context-menu-item">
      <i class="fa-solid fa-magnifying-glass-chart w-4 text-center text-[#F59E0B]"></i>
      <span>分析内容</span>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAITaskStore } from '@/novel/editor/stores/aiTaskStore';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import { useUIStore } from '@/novel/editor/stores/uiStore';
import { useContextMenuStore } from '@/novel/editor/stores/contextPreviewStore';

const aiTaskStore = useAITaskStore();
const editorStore = useEditorStore();
const uiStore = useUIStore();
const contextPreviewStore = useContextMenuStore();

const visible = ref(false);
const position = ref({ x: 0, y: 0 });

const show = (event: MouseEvent, container: HTMLElement | null) => {
  const containerRect = container?.getBoundingClientRect() || { top: 0, left: 0 };
  visible.value = true;
  position.value.x = event.clientX - containerRect.left;
  position.value.y = event.clientY - containerRect.top;
};

const hide = () => {
  visible.value = false;
};

const handleExecute = (taskType: '润色' | '续写' | '分析') => {
  const activeItem = editorStore.activeTab?.item;
  if (!activeItem) {
    console.error("无法执行AI任务：没有激活的文档。");
    hide();
    return;
  }

  if (uiStore.uiState.needsPreview) {
    contextPreviewStore.show({
      type: taskType,
      targetItemId: activeItem.id,
      title: activeItem.title
    });
  } else {
    aiTaskStore.startNewTask(taskType, activeItem.id);
  }

  hide();
}

defineExpose({ show, hide });
</script>

<style scoped>
.context-menu { position: absolute; z-index: 1000; background-color: white; border: 1px solid #e5e7eb; border-radius: 0.75rem; padding: 0.5rem; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); width: 16rem; }
.menu-title { padding: 0.25rem 0.75rem; font-size: 0.75rem; color: #9CA3AF; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
.context-menu-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; color: #374151; cursor: pointer; user-select: none; transition: background-color 0.15s; text-decoration: none; }
.context-menu-item:hover { background-color: #f3f4f6; }
.context-menu-divider { height: 1px; background-color: #f3f4f6; margin: 0.5rem 0; }
</style>