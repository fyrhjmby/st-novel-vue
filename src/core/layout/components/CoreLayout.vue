<template>
  <div class="core-layout-container" :class="{'sidebar-hidden': !isSidebarVisible}">
    <div class="activity-bar-area">
      <slot name="activity-bar"></slot>
    </div>
    <div v-if="isSidebarVisible" class="sidebar-area" :style="{ width: `${sidebarWidth}px` }">
      <slot name="sidebar">
        <SidebarPanel />
      </slot>
    </div>
    <div v-if="isSidebarVisible" class="sidebar-resizer" @mousedown="startResizeWrapper"></div>

    <div class="main-content-area">
      <MainPane />
    </div>

    <div class="status-bar-area">
      <slot name="status-bar"></slot>
    </div>

    <div class="global-components-area">
      <slot name="global">
        <NotificationCenter />
        <CommandPalette />
        <ContextMenu />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useLayoutStore } from '@core/layout/stores/layoutStore.ts';
import { storeToRefs } from 'pinia';
import type { EditorKernel } from '@core/services/EditorKernel.ts';
import { useResizable } from '@core/common/composables/useResizable.ts';

import MainPane from '../../panes/components/MainPane.vue';
import SidebarPanel from './SidebarPanel.vue';
import NotificationCenter from './NotificationCenter.vue';
import CommandPalette from '../../palette/components/CommandPalette.vue';
import ContextMenu from '../../panes/components/ContextMenu.vue';

const props = defineProps<{
  kernel: EditorKernel;
}>();

const layoutStore = useLayoutStore();
const { isSidebarVisible, sidebarWidth } = storeToRefs(layoutStore);

onMounted(() => {
  props.kernel.startup();
});

onUnmounted(() => {
  props.kernel.shutdown();
});

let initialWidth = 0;
const { startResize } = useResizable({
  onResize: ({ dx }) => {
    layoutStore.setSidebarWidth(initialWidth + dx);
  },
});

const startResizeWrapper = (event: MouseEvent) => {
  initialWidth = sidebarWidth.value;
  startResize(event);
};
</script>

<style scoped>
.core-layout-container {
  display: flex; height: 100%; width: 100%; overflow: hidden; background-color: #FFFFFF;
}
.activity-bar-area, .sidebar-area { flex-shrink: 0; height: 100%; }
.activity-bar-area { z-index: 20; border-right: 1px solid #E5E7EB; }
.sidebar-area { z-index: 10; border-right: 1px solid #E5E7EB; }
.sidebar-resizer {
  width: 5px; background-color: transparent; cursor: col-resize; flex-shrink: 0;
  position: relative; z-index: 15;
}
.sidebar-resizer:hover { background-color: #3B82F6; }
.main-content-area {
  flex-grow: 1; display: flex; flex-direction: column; min-width: 0;
  position: relative;
}
.status-bar-area {
  position: relative; z-index: 20; flex-shrink: 0;
  height: 28px; border-top: 1px solid #E5E7EB;
  background-color: #F3F4F6;
}
.global-components-area > :deep(*) {
  pointer-events: all;
}
.global-components-area {
  position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 9999; pointer-events: none;
}
</style>