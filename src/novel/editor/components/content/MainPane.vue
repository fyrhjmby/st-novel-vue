// 文件: src\novel\editor\components\content\MainPane.vue

<template>
  <div class="main-pane-container" ref="containerRef">
    <template v-for="(pane, index) in panes" :key="pane.id">
      <EditorInstance :pane="pane" :is-active="pane.id === editorStore.activePaneId" class="pane-instance" />
      <div
          v-if="index < panes.length - 1"
          class="pane-resizer"
          @mousedown.prevent="startResize($event, index)"
      ></div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import EditorInstance from './EditorInstance.vue';

const editorStore = useEditorStore();
const panes = computed(() => editorStore.panes);
const containerRef = ref<HTMLElement | null>(null);

watch(() => panes.value.length, (newLength, oldLength) => {
  if (newLength < oldLength) {
    nextTick(() => {
      if (!containerRef.value) return;
      const remainingPanes = containerRef.value.querySelectorAll('.pane-instance') as NodeListOf<HTMLElement>;
      remainingPanes.forEach(el => {
        el.style.flex = '';
      });
    });
  }
});

const startResize = (event: MouseEvent, paneIndex: number) => {
  const container = containerRef.value;
  if (!container) return;

  const paneElements = Array.from(container.querySelectorAll('.pane-instance')) as HTMLElement[];
  const leftPane = paneElements[paneIndex];
  const rightPane = paneElements[paneIndex + 1];

  if (!leftPane || !rightPane) return;

  const startX = event.clientX;
  const leftStartWidth = leftPane.offsetWidth;
  const rightStartWidth = rightPane.offsetWidth;
  const totalWidth = leftStartWidth + rightStartWidth;

  const handleResize = (e: MouseEvent) => {
    const dx = e.clientX - startX;
    let newLeftWidth = leftStartWidth + dx;

    const minWidth = 200;
    if (newLeftWidth < minWidth) {
      newLeftWidth = minWidth;
    }
    if (totalWidth - newLeftWidth < minWidth) {
      newLeftWidth = totalWidth - minWidth;
    }

    const newLeftBasis = (newLeftWidth / totalWidth) * 100;
    const newRightBasis = 100 - newLeftBasis;

    leftPane.style.flex = `0 0 ${newLeftBasis}%`;
    rightPane.style.flex = `0 0 ${newRightBasis}%`;
  };

  const stopResize = () => {
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
    document.body.style.cursor = '';
    document.body.style.userSelect = 'none';
  };

  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
};
</script>
<style scoped>
.main-pane-container {
  flex-grow: 1;
  display: flex;
  overflow: hidden;
  background-color: #F3F4F6;
}
.pane-instance {
  flex: 1 1 0;
  min-width: 200px;
}
.pane-resizer {
  width: 5px;
  background-color: transparent;
  cursor: col-resize;
  flex-shrink: 0;
  z-index: 5;
  position: relative;
  transition: background-color 0.2s ease;
}
.pane-resizer:hover {
  background-color: #3B82F6;
}
.pane-resizer::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 0;
  width: 1px;
  height: 100%;
  background-color: #E5E7EB;
}
.pane-resizer:hover::before {
  background-color: transparent;
}
</style>