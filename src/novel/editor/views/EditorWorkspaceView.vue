<template>
  <div class="editor-workspace-container">
    <CoreLayout v-if="kernel" :kernel="kernel">
      <template #activity-bar>
        <ActivityBar />
      </template>
      <template #sidebar>
        <SidebarPanel />
      </template>
      <template #status-bar>
        <StatusBar />
      </template>
      <template #global>
        <NotificationCenter />
        <CommandPalette />
        <ContextMenu />
        <ContextPreviewModal />
      </template>
    </CoreLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { EditorKernel } from '@core/services/EditorKernel';
import { viewRegistry } from '@core/common/services/ViewRegistry';
import { novelItemProvider } from '../novel.provider';
import { NovelModule } from '../novel.module';
import { useEditorStore } from '../stores/editorStore';

// Core Components
import CoreLayout from '@core/layout/components/CoreLayout.vue';
import NotificationCenter from '@core/layout/components/NotificationCenter.vue';
import CommandPalette from '@core/palette/components/CommandPalette.vue';
import ContextMenu from '@core/panes/components/ContextMenu.vue';

// Novel Specific Components
import ActivityBar from '../components/layout/ActivityBar.vue';
import SidebarPanel from '../components/sidebar/SidebarPanel.vue';
import StatusBar from '../components/layout/StatusBar.vue';
import ContextPreviewModal from '../components/modals/ContextPreviewModal.vue';

const kernel = ref<EditorKernel | null>(null);
const editorStore = useEditorStore();

onMounted(() => {
  // 1. 初始化内核，并注入 Novel 模块的数据提供者
  const editorKernel = new EditorKernel(novelItemProvider);

  // 2. 安装 Novel 模块，注册所有视图和命令
  new NovelModule().install(viewRegistry);

  // 3. 启动内核 (将加载持久化的工作区状态等)
  editorKernel.startup();

  // 4. 初始化 Novel 模块的业务数据 (模拟加载)
  editorStore.initialize();

  kernel.value = editorKernel;
});

onUnmounted(() => {
  kernel.value?.shutdown();
});
</script>

<style scoped>
.editor-workspace-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #F9FAFB;
}
</style>