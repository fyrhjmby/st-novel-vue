import { defineStore } from 'pinia';
import { ref } from 'vue';
import { usePaneStore } from '../../panes/stores/paneStore.ts';
import { paneTreeService } from '@core/panes/service/PaneTreeService.ts';
import type { Tab } from '@core/types.ts';
import { eventBus } from '@core/common/services/EventBusService.ts';
import { CoreEvent } from '@core/constants.ts';

export const useTabStore = defineStore('core-tab', () => {
    const tabsById = ref<Map<string, Tab>>(new Map());

    const getTabById = (tabId: string): Tab | undefined => tabsById.value.get(tabId);

    const findTabByItemId = (itemId: string): Tab | undefined => {
        for (const tab of tabsById.value.values()) {
            if (tab.itemId === itemId) {
                return tab;
            }
        }
        return undefined;
    };

    const getTabsForPane = (paneId: string): Tab[] => {
        const paneStore = usePaneStore();
        const pane = paneStore.root ? paneTreeService.findNodeAndParent(paneStore.root, paneId)?.node : undefined;
        if (!pane || pane.type !== 'leaf') return [];
        return pane.tabIds.map(id => getTabById(id)).filter((t): t is Tab => !!t);
    };

    function _addTab(tab: Tab) {
        tabsById.value.set(tab.id, tab);
    }

    function _removeTab(tabId: string) {
        tabsById.value.delete(tabId);
    }

    function updateTabState(tabId: string, state: Partial<Pick<Tab, 'isDirty' | 'title' | 'icon'>>) {
        const tab = getTabById(tabId);
        if (tab) {
            Object.assign(tab, state);
            // This event is for UI reactivity (e.g., command enablement), not persistence. Keep it.
            eventBus.emit(CoreEvent.TAB_STATE_CHANGED, { tabId, newState: state });
        }
    }

    function dehydrate() {
        return {
            tabs: Array.from(tabsById.value.entries()),
        };
    }

    function hydrate(state: { tabs: [string, Tab][] }) {
        if (state.tabs) {
            tabsById.value = new Map(state.tabs);
        }
    }

    return {
        getTabById,
        getTabsForPane,
        findTabByItemId,
        updateTabState,
        _addTab,
        _removeTab,
        hydrate,
        dehydrate,
    };
});