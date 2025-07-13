

import { onMounted, onUnmounted, watch, ref, computed, type Ref } from 'vue';
import { activeEditorService } from '@core/tabs/service/ActiveEditorService.ts';
import { useTabStore } from '@core/tabs/stores/tabStore.ts';
import { useNotificationStore } from '@core/layout/stores/notificationStore.ts';
import type { CoreItem, Tab } from '@core/types.ts';

interface UseEditableViewOptions {
    tab: Ref<Tab>;
    coreItem: Ref<CoreItem | null>;
    content: Ref<string>;
}

export function useEditableView({ tab, coreItem, content }: UseEditableViewOptions) {
    const tabStore = useTabStore();
    const notificationStore = useNotificationStore();
    const initialContent = ref('');

    const isDirty = computed(() => initialContent.value !== content.value);

    const initializeContent = () => {
        const newInitialContent = coreItem.value?.metadata?.content || '';
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
                initialContent.value = newContent;
            },
        });
    });

    onUnmounted(() => {
        activeEditorService.unregister(tab.value.id);
    });

    watch(isDirty, (newValue) => {
        tabStore.updateTabState(tab.value.id, { isDirty: newValue });
    });

    watch(() => coreItem.value?.metadata?.content, (newContent) => {
        if (newContent !== undefined && content.value !== newContent) {
            if (isDirty.value) {
                notificationStore.add(
                    `'${tab.value.title}' has been modified on disk. Your version has unsaved changes.`,
                    'warning',
                    0
                );
            } else {
                initializeContent();
            }
        }
    });

    return {
        isDirty,
    };
}