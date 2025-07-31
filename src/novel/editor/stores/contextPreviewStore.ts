

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAITaskStore } from '@/novel/editor/stores/aiTaskStore';
import type { AITask } from '@/novel/editor/types';

interface PreviewTask {
    type: AITask['type'];
    targetItemId: string; 
    title: string;
}

export const useContextMenuStore = defineStore('editorContextPreview', () => {
    const isVisible = ref(false);
    const task = ref<PreviewTask | null>(null);

    const show = (previewTask: PreviewTask) => {
        task.value = previewTask;
        isVisible.value = true;
    };

    const hide = () => {
        isVisible.value = false;
        task.value = null;
    };

    const execute = () => {
        if (!task.value) return;
        const aiTaskStore = useAITaskStore();
        // Call the centralized task starter
        aiTaskStore.startTask(task.value.type, task.value.targetItemId);
        hide();
    };

    return { isVisible, task, show, hide, execute };
});