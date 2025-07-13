import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAITaskStore } from './aiTaskStore';
import { useEditorStore } from './editorStore';
import type { PreviewTask } from '../types';

export const useContextMenuStore = defineStore('novel-context-preview-modal', () => {
    const isVisible = ref(false);
    const task = ref<PreviewTask | null>(null);

    function show(previewTask: PreviewTask) {
        task.value = previewTask;
        isVisible.value = true;
    }

    function hide() {
        isVisible.value = false;
        task.value = null;
    }

    function execute() {
        if (!task.value) return;

        const aiTaskStore = useAITaskStore();
        const editorStore = useEditorStore();

        aiTaskStore.startNewTask(task.value.type, task.value.targetItemId);

        if (editorStore.activePaneId) {
            editorStore.ensureAIPanelIsOpen();
        }

        hide();
    }

    return {
        isVisible,
        task,
        show,
        hide,
        execute,
    };
});