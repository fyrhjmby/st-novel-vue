import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAITaskStore } from '@/novel/editor/stores/aiTaskStore';

interface PreviewTask {
    type: '润色' | '续写' | '分析';
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
        aiTaskStore.startNewTask(task.value.type, task.value.targetItemId);

        hide();
    };

    return {
        isVisible,
        task,
        show,
        hide,
        execute,
    };
});