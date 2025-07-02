// =
// 文件: ..\src\novel\editor\views\EditorWorkspaceView.vue
//

<template>
  <div class="editor-workspace-view">
    <!-- Left Column: Internal Sidebar -->
    <EditorInternalSidebar />

    <!-- Center Column: Core Content Area -->
    <EditorContentArea />

    <!-- Right Column: AI Assistant Panel -->
    <EditorAIPanel />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useEditorStore } from '@/novel/editor/stores/editorStore';

// --- Component Imports ---
import EditorInternalSidebar from '@/novel/editor/components/sidebar/EditorInternalSidebar.vue';
import EditorContentArea from '@/novel/editor/components/content/EditorContentArea.vue';
import EditorAIPanel from '@/novel/editor/components/ai/EditorAIPanel.vue';

// --- Hooks ---
const editorStore = useEditorStore();

/**
 * onMounted: 当组件挂载后，执行初始化操作。
 * 这是连接路由和store，加载数据的关键入口。
 */
onMounted(() => {
  // 调用 action 加载数据。
  // 传入一个虚拟的 novelId 以符合 action 的签名
  editorStore.fetchNovelData('default-novel');
});

</script>

<style scoped>
.editor-workspace-view {
  display: flex;
  height: 100%;
  width: 100%;
  background-color: #F9FAFB; /* 给工作区一个基础背景色 */
}
</style>