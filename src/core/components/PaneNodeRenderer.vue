<!-- 文件: src/core/components/PaneNodeRenderer.vue -->
<!-- 描述: 递归渲染组件，用于根据树形结构绘制窗格和分割线。 -->
<template>
  <template v-if="node">
    <PaneInstance
        v-if="node.type === 'leaf'"
        :pane="node"
        :is-active="node.id === paneStore.activePaneId"
        class="pane-instance"
    />
    <div
        v-else-if="node.type === 'split'"
        class="split-pane-container"
        :style="{ flexDirection: node.direction === 'horizontal' ? 'row' : 'column' }"
    >
      <template v-for="(child, index) in node.children" :key="child.id">
        <PaneNodeRenderer
            :node="child"
            :style="{ flexBasis: `${node.sizes[index]}%` }"
            class="pane-node-renderer"
        />
        <div
            v-if="index < node.children.length - 1"
            class="pane-resizer"
            :class="node.direction"
            @mousedown.prevent="startResize($event, index)"
        ></div>
      </template>
    </div>
  </template>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { usePaneStore } from '@/core/stores/paneStore';
import { useResizable } from '@/core/composables/useResizable';
import type { PaneNode } from '@/core/types';
import PaneInstance from './PaneInstance.vue';

const props = defineProps({
  node: {
    type: Object as PropType<PaneNode>,
    required: true,
  },
});

const paneStore = usePaneStore();

const startResize = (event: MouseEvent, index: number) => {
  if (props.node.type !== 'split') return;

  const resizerElement = event.currentTarget as HTMLElement;
  const container = resizerElement.parentElement as HTMLElement;
  const firstElement = container.children[index * 2] as HTMLElement;
  const secondElement = container.children[index * 2 + 2] as HTMLElement;

  const isHorizontal = props.node.direction === 'horizontal';
  const totalSize = isHorizontal ? firstElement.offsetWidth + secondElement.offsetWidth : firstElement.offsetHeight + secondElement.offsetHeight;
  const initialSizes = [...props.node.sizes];

  const { startResize: start } = useResizable({
    cursor: isHorizontal ? 'col-resize' : 'row-resize',
    onResize: ({ dx, dy }) => {
      if (props.node.type !== 'split') return;
      const delta = isHorizontal ? dx : dy;
      const deltaPercent = (delta / totalSize) * 100;

      const newSizes = [...initialSizes];
      newSizes[index] += deltaPercent;
      newSizes[index + 1] -= deltaPercent;

      const minSize = 10; // Minimum 10%
      if (newSizes[index] < minSize || newSizes[index + 1] < minSize) {
        return;
      }

      paneStore.updatePaneNodeSize(props.node.id, newSizes);
    }
  });

  start(event);
};
</script>

<style scoped>
.split-pane-container {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.pane-node-renderer {
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
.pane-resizer {
  flex-shrink: 0;
  background-color: transparent;
  transition: background-color 0.2s ease;
  z-index: 5;
  position: relative;
}
.pane-resizer.horizontal {
  width: 5px;
  cursor: col-resize;
}
.pane-resizer.vertical {
  height: 5px;
  cursor: row-resize;
}
.pane-resizer:hover {
  background-color: #3B82F6;
}
.pane-resizer.horizontal::before {
  content: ''; position: absolute; left: 2px; top: 0; width: 1px;
  height: 100%; background-color: #E5E7EB;
}
.pane-resizer.vertical::before {
  content: ''; position: absolute; top: 2px; left: 0; height: 1px;
  width: 100%; background-color: #E5E7EB;
}
.pane-resizer:hover::before {
  background-color: transparent;
}
</style>