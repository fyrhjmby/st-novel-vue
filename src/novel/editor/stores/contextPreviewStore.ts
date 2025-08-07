import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAITaskStore } from '@/novel/editor/stores/aiTaskStore';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import type { AITaskPreview, ContextBuildResult } from '@/novel/editor/types';
import { useContextBuilder } from '@/novel/editor/composables/useContextBuilder';
export const useContextPreviewStore = defineStore('contextPreview', () => {
    const isVisible = ref(false);
    const task = ref<AITaskPreview | null>(null);
    const isLoading = ref(false);
    const previewContent = ref<ContextBuildResult | null>(null);
    const editorStore = useEditorStore();
    const { buildContextForTask } = useContextBuilder();

    const show = async (previewTask: AITaskPreview) => {
        task.value = previewTask;
        isVisible.value = true;
        isLoading.value = true;
        previewContent.value = null; // Reset previous content

        // Short delay for UI to mount
        await new Promise(res => setTimeout(res, 50));

        // Delegate context building to the context builder composable
        const { node: targetItem } = editorStore.findItemById(previewTask.targetItemId);
        previewContent.value = buildContextForTask(previewTask.type, targetItem);

        // Short delay to show loading state
        await new Promise(res => setTimeout(res, 200));
        isLoading.value = false;
    };

    const hide = () => {
        isVisible.value = false;
        task.value = null;
        isLoading.value = false;
        previewContent.value = null;
    };

    const execute = () => {
        if (!task.value || isLoading.value || !previewContent.value?.prompt) return;

        const aiTaskStore = useAITaskStore();
        // 将预览时生成的最终提示词，在开始任务时一并传递过去
        aiTaskStore.startTask(task.value.type, task.value.targetItemId, previewContent.value.prompt);
        hide();
    };

    return { isVisible, task, previewContent, isLoading, show, hide, execute };
});