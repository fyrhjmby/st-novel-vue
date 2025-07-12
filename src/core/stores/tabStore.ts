// 文件: src/core/stores/tabStore.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { usePaneStore } from './paneStore';
import { useNotificationStore } from './notificationStore';
import type { ItemProvider, CoreItem } from '@/core/types/providers';
import type { Tab } from '@/core/types';
import { eventBus } from '@/core/services/EventBusService';
import { commandService } from '@/core/services/CommandService';
import { uiService } from '@/core/services/UIService';

export const useTabStore = defineStore('core-tab', () => {
    const paneStore = usePaneStore();
    const notificationStore = useNotificationStore();
    let itemProvider: ItemProvider | null = null;

    const tabsById = ref<Map<string, Tab>>(new Map());

    const findPaneIdForTab = (tabId: string): string | undefined => {
        const pane = paneStore.root ? paneStore.findLeafContainingTab(paneStore.root, tabId) : undefined;
        return pane?.id;
    };

    const getTabById = (tabId: string) => tabsById.value.get(tabId);

    const getTabsForPane = (paneId: string) => {
        const pane = paneStore.root ? paneStore.findNodeAndParent(paneStore.root, paneId)?.node : undefined;
        if (!pane || pane.type !== 'leaf') return [];
        return pane.tabIds.map(id => getTabById(id)).filter((t): t is Tab => !!t);
    };

    function setItemProvider(provider: ItemProvider) {
        itemProvider = provider;
    }

    async function loadCoreItemForTab(tabId: string): Promise<CoreItem | null> {
        if (!itemProvider) {
            console.error('[TabStore] ItemProvider not set.');
            return null;
        }
        const tab = getTabById(tabId);
        if (!tab) return null;

        try {
            const item = await itemProvider.getItem(tab.itemId);
            if (!item) {
                notificationStore.add(`Item for tab '${tab.title}' not found. It may have been deleted.`, 'error');
                await closeTab(tabId);
            }
            return item;
        } catch (error) {
            console.error(`Error loading item ${tab.itemId}`, error);
            notificationStore.add(`An error occurred while loading '${tab.title}'.`, 'error');
            await closeTab(tabId);
            return null;
        }
    }

    function activateTab(tabId: string) {
        const paneId = findPaneIdForTab(tabId);
        if (!paneId) return;
        paneStore.setActivePane(paneId);
        paneStore.setActiveTab(paneId, tabId);
        eventBus.emit('core:tab.activated', { tabId, paneId });
    }

    async function openTab(itemId: string, targetPaneId?: string) {
        const paneId = targetPaneId || paneStore.activePaneId;
        if (!paneId) {
            notificationStore.add('No active pane to open the tab in.', 'error'); return;
        }
        const existingTab = Array.from(tabsById.value.values()).find(t => t.itemId === itemId);
        if (existingTab) {
            activateTab(existingTab.id); return;
        }
        if (!itemProvider) throw new Error('[TabStore] ItemProvider has not been set.');
        const item = await itemProvider.getItem(itemId);
        if (!item) {
            notificationStore.add(`Failed to open: Item "${itemId}" not found.`, 'error'); return;
        }
        const newTab: Tab = {
            id: `tab-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            itemId: item.id, title: item.title, icon: item.icon, isDirty: false,
        };
        tabsById.value.set(newTab.id, newTab);
        paneStore.addTabToPane(newTab.id, paneId);
        activateTab(newTab.id);
        eventBus.emit('core:tab.opened', { tab: newTab, paneId });
        eventBus.emit('core:state-changed', { store: 'tab' });
    }

    async function forceCloseTab(tabId: string) {
        if (!tabsById.value.has(tabId)) return;
        const closedTab = tabsById.value.get(tabId)!;
        const paneId = findPaneIdForTab(tabId);
        tabsById.value.delete(tabId);
        if (paneId) {
            paneStore.removeTabFromPane(tabId);
        }
        eventBus.emit('core:tab.closed', { tab: closedTab, paneId });
        eventBus.emit('core:state-changed', { store: 'tab' });
    }

    async function closeTab(tabId: string) {
        const tabToClose = getTabById(tabId);
        if (!tabToClose) return;
        if (tabToClose.isDirty) {
            const userChoice = await uiService.requestConfirmation({
                title: 'Unsaved Changes',
                message: `Do you want to save the changes for '${tabToClose.title}'?`,
                confirmText: 'Save', cancelText: 'Don\'t Save',
            });
            if (userChoice) {
                await commandService.execute('core.saveTab', { tabId });
                if (!getTabById(tabId)?.isDirty) await forceCloseTab(tabId);
                else notificationStore.add(`Failed to save '${tabToClose.title}'. Close aborted.`, 'error');
            } else await forceCloseTab(tabId);
        } else await forceCloseTab(tabId);
    }

    function updateTabState(tabId: string, state: Partial<Pick<Tab, 'isDirty' | 'title' | 'icon'>>) {
        const tab = getTabById(tabId);
        if (tab) {
            Object.assign(tab, state);
            eventBus.emit('core:tab.stateChanged', { tabId, newState: state });
            eventBus.emit('core:state-changed', { store: 'tab' });
        }
    }

    eventBus.on('core:pane.closed', ({ tabIds }: { tabIds: string[] }) => {
        tabIds.forEach(id => {
            if (tabsById.value.has(id)) tabsById.value.delete(id);
        });
        eventBus.emit('core:state-changed', { store: 'tab' });
    });

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
        getTabById, getTabsForPane, setItemProvider, loadCoreItemForTab,
        openTab, closeTab, activateTab, updateTabState,
        hydrate, dehydrate,
    };
});