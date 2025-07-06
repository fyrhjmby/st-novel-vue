<template>
  <div class="editor-workspace-view">
    <div class="main-area">
      <ActivityBar
          :active-tab-id="activeActivityBarTab"
          :is-sidebar-visible="isSidebarVisible"
          @select-tab="handleSelectActivityTab"
          @trigger-action="handleTriggerAction"
          @show-manage-menu="showManageMenu"
      />
      <template v-if="isSidebarVisible">
        <div class="sidebar-wrapper" :style="{ width: sidebarPanelWidth + 'px' }">
          <SidebarPanel :active-tab-id="activeActivityBarTab" />
        </div>
        <div class="resizer" @mousedown.prevent="startResize"></div>
      </template>

      <MainPane />
    </div>
    <StatusBar />
    <ManageMenu ref="manageMenuRef" @select-action="handleMenuAction" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import ActivityBar from '@/novel/editor/components/layout/ActivityBar.vue';
import SidebarPanel from '@/novel/editor/components/sidebar/SidebarPanel.vue';
import MainPane from '@/novel/editor/components/content/MainPane.vue';
import StatusBar from '@/novel/editor/components/layout/StatusBar.vue';
import ManageMenu from '@/novel/editor/components/layout/ManageMenu.vue';

type ActivityTabId = 'directory' | 'related' | 'notes';
type ActionId = 'system:search' | 'system:ai_chat' | string;

const editorStore = useEditorStore();

const activeActivityBarTab = ref<ActivityTabId | null>('directory');
const isSidebarVisible = ref(true);
const manageMenuRef = ref<InstanceType<typeof ManageMenu> | null>(null);

// --- Resizing Logic ---
const sidebarPanelWidth = ref(320);
const isResizing = ref(false);

const startResize = (event: MouseEvent) => {
  isResizing.value = true;
  const startWidth = sidebarPanelWidth.value;
  const startX = event.clientX;

  const handleResize = (e: MouseEvent) => {
    if (!isResizing.value) return;
    const dx = e.clientX - startX;
    const newWidth = startWidth + dx;
    sidebarPanelWidth.value = Math.max(240, Math.min(newWidth, 600));
  };

  const stopResize = () => {
    isResizing.value = false;
    window.removeEventListener('mousemove', handleResize);
    window.removeEventListener('mouseup', stopResize);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  window.addEventListener('mousemove', handleResize);
  window.addEventListener('mouseup', stopResize);
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
};

const handleSelectActivityTab = (tabId: ActivityTabId) => {
  if (activeActivityBarTab.value === tabId && isSidebarVisible.value) {
    isSidebarVisible.value = false;
    activeActivityBarTab.value = null;
  } else {
    isSidebarVisible.value = true;
    activeActivityBarTab.value = tabId;
  }
};

const handleTriggerAction = (actionId: ActionId) => {
  editorStore.openTab(actionId);
}

const showManageMenu = (event: MouseEvent) => {
  manageMenuRef.value?.show(event.currentTarget as HTMLElement);
};

const handleMenuAction = (actionId: ActionId) => {
  if (actionId.startsWith('system:')) {
    editorStore.openTab(actionId);
  } else {
    // Handle other menu actions like 'theme', 'extensions' etc.
    alert(`Action '${actionId}' selected. Implementation pending.`);
  }
};

onMounted(() => {
  editorStore.fetchNovelData('default-novel');
});

onBeforeUnmount(() => {
  // A safeguard to ensure listeners are removed if component is unmounted during resize
  if (isResizing.value) {
    const emptyFn = () => {};
    window.removeEventListener('mousemove', emptyFn);
    window.removeEventListener('mouseup', emptyFn);
  }
});
</script>
<style scoped>
.editor-workspace-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #F9FAFB;
}
.main-area {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}
.sidebar-wrapper {
  flex-shrink: 0;
  height: 100%;
}
.resizer {
  width: 5px;
  background-color: transparent;
  cursor: col-resize;
  flex-shrink: 0;
  position: relative;
  transition: background-color 0.2s ease;
}
.resizer:hover {
  background-color: #3B82F6;
}
.resizer::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 0;
  width: 1px;
  height: 100%;
  background-color: #E5E7EB;
}
.resizer:hover::before {
  background-color: transparent;
}
</style>