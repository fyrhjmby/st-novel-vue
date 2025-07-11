<template>
  <div class="main-pane-container" ref="containerRef">
    <template v-for="(pane, index) in panes" :key="pane.id">
      <PaneInstance
          :pane="pane"
          :is-active="pane.id === paneStore.activePaneId"
          class="pane-instance"
      />
      <div
          v-if="index < panes.length - 1"
          class="pane-resizer"
          @mousedown.prevent="startResize($event, index)"
      ></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePaneStore } from '@/core/stores/paneStore';
import { configService } from '@/core/services/ConfigService';
import PaneInstance from './PaneInstance.vue';

const paneStore = usePaneStore();
const panes = computed(() => paneStore.panes);
const containerRef = ref<HTMLElement | null>(null);

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
  const minWidth = configService.get('pane.minWidth', 200);

  const handleResize = (e: MouseEvent) => {
    const dx = e.clientX - startX;
    let newLeftWidth = leftStartWidth + dx;

    if (newLeftWidth < minWidth) newLeftWidth = minWidth;
    if (totalWidth - newLeftWidth < minWidth) newLeftWidth = totalWidth - minWidth;

    leftPane.style.flexBasis = `${newLeftWidth}px`;
    rightPane.style.flexBasis = `${totalWidth - newLeftWidth}px`;
    leftPane.style.flexGrow = '0';
    rightPane.style.flexGrow = '0';
  };

  const stopResize = () => {
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
    document.body.style.cursor = '';
  };

  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
  document.body.style.cursor = 'col-resize';
};
</script>

<style scoped>
.main-pane-container {
  flex-grow: 1; display: flex; overflow: hidden; background-color: #F3F4F6;
}
.pane-instance { flex: 1 1 0px; min-width: 0; }
.pane-resizer {
  width: 5px; background-color: transparent; cursor: col-resize;
  flex-shrink: 0; z-index: 5; position: relative; transition: background-color 0.2s ease;
}
.pane-resizer:hover { background-color: #3B82F6; }
.pane-resizer::before {
  content: ''; position: absolute; left: 2px; top: 0; width: 1px;
  height: 100%; background-color: #E5E7EB;
}
.pane-resizer:hover::before { background-color: transparent; }
</style>