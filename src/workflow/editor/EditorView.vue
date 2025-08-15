<template>
  <DesignFrameWrapper>
    <div class="flex flex-col h-full w-full bg-white" @keydown.backspace="handleDelete" @keydown.delete="handleDelete" tabindex="0">
      <EditorHeader :id="props.id" />
      <div class="flex-1 flex overflow-hidden">
        <EditorNodePanel />
        <main class="flex-1 relative" @drop="store.onDrop" @dragover="store.onDragOver">
          <EditorCanvas
              :elements="store.elements"
              @pane-ready="store.setInstance"
              @node-click="store.onNodeClick"
              @pane-click="store.clearSelection"
          />
        </main>
        <EditorConfigPanel />
      </div>
    </div>
  </DesignFrameWrapper>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import DesignFrameWrapper from '@/workflow/layouts/components/DesignFrameWrapper.vue';
import { useEditorStore } from '../store/editorStore';
import EditorHeader from './components/EditorHeader.vue';
import EditorNodePanel from './components/EditorNodePanel.vue';
import EditorCanvas from './components/EditorCanvas.vue';
import EditorConfigPanel from './components/EditorConfigPanel.vue';

const props = defineProps<{
  id: string;
}>();

const store = useEditorStore();

onMounted(() => {
  store.loadWorkflow(props.id);
});

const handleDelete = (event: KeyboardEvent) => {
  if ((event.target as HTMLElement).nodeName === 'INPUT' || (event.target as HTMLElement).nodeName === 'TEXTAREA') {
    return;
  }
  store.removeSelectedNode();
};
</script>