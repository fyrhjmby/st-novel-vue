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