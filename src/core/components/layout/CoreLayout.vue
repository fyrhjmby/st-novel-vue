
<template>
  <div class="core-layout-container" :class="{'sidebar-hidden': !isSidebarVisible}">
    <div class="activity-bar-area">
      <slot name="activity-bar"></slot>
    </div>
    <div v-if="isSidebarVisible" class="sidebar-area" :style="{ width: `${sidebarWidth}px` }">
      <slot name="sidebar">
        <!-- Default sidebar content if app doesn't provide one -->
        <SidebarPanel />
      </slot>
    </div>
    <div v-if="isSidebarVisible" class="sidebar-resizer" @mousedown.prevent="startResize"></div>

    <div class="main-content-area">
      <MainPane />
    </div>

    <div class="status-bar-area">
      <slot name="status-bar"></slot>
    </div>

    <div class="global-components-area">
      <slot name="global">
        <NotificationCenter />
        <CommandPalette ref="commandPaletteRef" />
      </slot>
    </div>
    <div class="global-components-area">
      <slot name="global">
        <NotificationCenter />
        <CommandPalette ref="commandPaletteRef" />
        <ContextMenu ref="contextMenuRef" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { usePaneStore } from '@/core/stores/paneStore';
import { useLayoutStore } from '@/core/stores/layoutStore';
import { useTabStore } from '@/core/stores/tabStore';
import { keybindingService } from '@/core/services/KeybindingService';
import { workspaceService } from '@/core/services/WorkspaceService';
import { commandService } from '@/core/services/CommandService';
import type { ItemProvider } from '@/core/types/providers';

import MainPane from '../MainPane.vue';
import SidebarPanel from './SidebarPanel.vue';
import NotificationCenter from './NotificationCenter.vue';
import ContextMenu from '../ContextMenu.vue';
import CommandPalette from '../CommandPalette.vue';
import { storeToRefs } from 'pinia';

const props = defineProps<{
  itemProvider: ItemProvider;
}>();

const paneStore = usePaneStore();
const layoutStore = useLayoutStore();
const tabStore = useTabStore();
const { isSidebarVisible, sidebarWidth } = storeToRefs(layoutStore);
const commandPaletteRef = ref<InstanceType<typeof CommandPalette> | null>(null);

// --- Core Initialization ---
onMounted(async () => {
  // 1. Inject dependencies
  tabStore.setItemProvider(props.itemProvider);

  // 2. Register core commands
  commandService.register({
    id: 'core.commandPalette.toggle',
    label: 'Toggle Command Palette',
    execute: () => commandPaletteRef.value?.toggle(),
  });
  keybindingService.register({ key: 'ctrl+shift+p', commandId: 'core.commandPalette.toggle'});

  // 3. Initialize services
  keybindingService.initialize();

  // 4. Hydrate workspace state from localStorage
  await workspaceService.hydrate();

  // 5. If no state was hydrated, initialize default state
  paneStore.initializePanes();

  // 6. Watch for state changes to persist them
  watch(
      [paneStore.$state, layoutStore.$state],
      () => {
        workspaceService.persist();
      },
      { deep: true }
  );
});

onUnmounted(() => {
  keybindingService.destroy();
});

// --- Sidebar Resizing Logic ---
const startResize = (event: MouseEvent) => {
  const startWidth = sidebarWidth.value;
  const startX = event.clientX;

  const handleResize = (e: MouseEvent) => {
    const dx = e.clientX - startX;
    layoutStore.setSidebarWidth(startWidth + dx);
  };

  const stopResize = () => {
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
    document.body.style.cursor = 'default';
  };

  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
  document.body.style.cursor = 'col-resize';
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
  flex-shrink: 0;
  height: 28px; /* Example height */
  border-top: 1px solid #E5E7EB;
}
.global-components-area {
  position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 9999; pointer-events: none;
}
</style>