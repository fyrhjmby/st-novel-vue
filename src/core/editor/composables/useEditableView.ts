// 文件: src/core/composables/useEditableView.ts

import { onMounted, onUnmounted, watch, ref, computed, type Ref } from 'vue';
import { activeEditorService } from '@core/tabs/service/ActiveEditorService.ts';
import { useTabStore } from '@core/tabs/stores/tabStore.ts';
import { useNotificationStore } from '@core/layout/stores/notificationStore.ts';
import type { CoreItem, Tab } from '@core/types.ts';

interface UseEditableViewOptions {
    tab: Ref<Tab>;
    coreItem: Ref<CoreItem>;
    content: Ref<string>;
}

export function useEditableView({ tab, coreItem, content }: UseEditableViewOptions) {
    const tabStore = useTabStore();
    const notificationStore = useNotificationStore();
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

    // This watcher handles cases where the underlying file is changed externally
    // (e.g., git pull, external editor save) and reloaded.
    watch(() => coreItem.value.metadata?.content, (newContent) => {
        if (newContent !== undefined && content.value !== newContent) {
            if (isDirty.value) {
                // If the editor has unsaved changes, do not overwrite them.
                // Instead, notify the user about the conflict.
                notificationStore.add(
                    `'${tab.value.title}' has been modified on disk. Your version has unsaved changes.`,
                    'warning',
                    0 // Persistent notification
                );
            } else {
                // The editor is clean, so it's safe to update the content.
                initializeContent();
            }
        }
    });

    return {
        isDirty,
    };
}