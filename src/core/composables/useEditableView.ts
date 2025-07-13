// 文件: src/core/composables/useEditableView.ts

import { onMounted, onUnmounted, watch, ref, computed, type Ref } from 'vue';
import { activeEditorService } from '@/core/services/ActiveEditorService';
import { useTabStore } from '@/core/stores/tabStore';
import type { CoreItem, Tab } from '@/core/types';

interface UseEditableViewOptions {
    tab: Ref<Tab>;
    coreItem: Ref<CoreItem>;
    content: Ref<string>;
}

export function useEditableView({ tab, coreItem, content }: UseEditableViewOptions) {
    const tabStore = useTabStore();
    const initialContent = ref('');

    const isDirty = computed(() => initialContent.value !== content.value);

    const initializeContent = () => {
        const newInitialContent = coreItem.value.metadata?.content || '';
        initialContent.value = newInitialContent;
        if (content.value !== newInitialContent) {
            content.value = newInitialContent;
        }
    };

    onMounted(() => {
        initializeContent();

        activeEditorService.register(tab.value.id, {
            getContent: () => content.value,
            setContent: (newContent: string) => {
                content.value = newContent;
                initialContent.value = newContent; // Mark as saved by resetting the baseline
            },
        });
    });

    onUnmounted(() => {
        activeEditorService.unregister(tab.value.id);
    });

    watch(isDirty, (newValue) => {
        tabStore.updateTabState(tab.value.id, { isDirty: newValue });
    });

    // This is no longer called internally, but triggered via activeEditorService.setContent
    function markAsSaved() {
        initialContent.value = content.value;
    }

    // This watcher handles cases where the underlying file is changed externally
    // (e.g., git pull, external editor save) and reloaded.
    watch(() => coreItem.value.metadata?.content, (newContent) => {
        if (newContent !== undefined && content.value !== newContent) {
            initializeContent();
        }
    });

    return {
        isDirty,
        // markAsSaved is now an internal-only concept, handled by setContent
    };
}