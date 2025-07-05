
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

onMounted(() => {
  // [重构] 该方法现在是所有编辑器数据的初始化入口
  // 它会获取数据并分发给 directoryStore, notesStore 等
  editorStore.fetchNovelData('default-novel');
});

</script>

<style scoped>
.editor-workspace-view {
  display: flex;
  height: 100%;
  width: 100%;
  background-color: #F9FAFB;
}
</style>