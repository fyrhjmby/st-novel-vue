
import { ref, computed, watch, type Ref } from 'vue';
import { useTabStore } from '@core/tabs/stores/tabStore.ts';
import { viewRegistry } from '@core/common/services/ViewRegistry.ts';
import { tabManagementService } from '@core/tabs/service/TabManagementService.ts';
import type { LeafPaneNode, CoreItem, Tab } from '@core/types.ts';

export function usePaneContent(pane: Ref<LeafPaneNode>) {
    const tabStore = useTabStore();

    const activeCoreItem = ref<CoreItem | null>(null);
    const isLoading = ref(false);
    const loadingError = ref<string | null>(null);

    const activeTab = computed((): Tab | undefined => {
        return pane.value.activeTabId ? tabStore.getTabById(pane.value.activeTabId) : undefined;
    });

    const resolvedView = computed(() => {
        if (activeCoreItem.value?.viewType) {
            return viewRegistry.resolve(activeCoreItem.value.viewType);
        }
        return null;
    });

    const loadContentForTab = async (tabId: string | null) => {
        if (!tabId) {
            activeCoreItem.value = null;
            isLoading.value = false;
            loadingError.value = null;
            return;
        }

        isLoading.value = true;
        loadingError.value = null;
        activeCoreItem.value = null;

        try {
            const item = await tabManagementService.loadCoreItemForTab(tabId);
            if (pane.value.activeTabId === tabId) {
                activeCoreItem.value = item;
                if (!item) {
                    loadingError.value = "The associated item could not be found. It might have been deleted.";
                }
            }
        } catch (error: any) {
            console.error(`Failed to load content for tab ${tabId}`, error);
            if (pane.value.activeTabId === tabId) {
                loadingError.value = error.message || 'An unknown error occurred.';
            }
        } finally {
            if (pane.value.activeTabId === tabId) {
                isLoading.value = false;
            }
        }
    };

    const reloadContent = () => {
        loadContentForTab(pane.value.activeTabId);
    };

    watch(
        () => pane.value.activeTabId,
        (newTabId) => {
            loadContentForTab(newTabId);
        },
        { immediate: true }
    );

    return {
        activeTab,
        activeCoreItem,
        isLoading,
        loadingError,
        resolvedView,
        reloadContent,
    };
}