

import { defineStore } from 'pinia';
import { usePaneStore } from './paneStore';
import { useNotificationStore } from './notificationStore';
import type { ItemProvider } from '@/core/types/providers';
import type { Tab, CoreItem } from '@/core/types';
import { eventBus } from '@/core/services/EventBusService';

let _itemProvider: ItemProvider | null = null;

export const useTabStore = defineStore('core-tab', () => {
    const paneStore = usePaneStore();
    const notificationStore = useNotificationStore();

    function setItemProvider(provider: ItemProvider) {
        _itemProvider = provider;
    }

    async function activateTab(paneId: string, tabId: string | null) {
        const pane = paneStore.panes.find(p => p.id === paneId);
        if (!pane) return;

        pane.activeTabId = tabId;

        if (tabId && _itemProvider) {
            pane.activeItem = await _itemProvider.getItem(tabId);
        } else {
            pane.activeItem = null;
        }

        paneStore.setActivePane(paneId);
        eventBus.emit('core:tab.activated', { tabId, paneId });
    }

    async function openTab(itemId: string, targetPaneId?: string) {
        if (!_itemProvider) {
            throw new Error('[TabStore] ItemProvider has not been set. Cannot open tab.');
        }

        const paneId = targetPaneId || paneStore.activePaneId;
        if (!paneId) {
            notificationStore.add('No active pane to open the tab in.', 'error');
            return;
        }

        for (const p of paneStore.panes) {
            if (p.tabs.some(t => t.id === itemId)) {
                await activateTab(p.id, itemId);
                return;
            }
        }

        const item = await _itemProvider.getItem(itemId);
        if (!item) {
            notificationStore.add(`Failed to open: Item with ID "${itemId}" not found.`, 'error');
            return;
        }

        const pane = paneStore.panes.find(p => p.id === paneId);
        if (!pane) {
            notificationStore.add(`Target pane with ID "${paneId}" not found.`, 'error');
            return;
        }

        const newTab: Tab = {
            id: item.id,
            title: item.title,
            icon: item.icon,
            isDirty: false,
        };

        pane.tabs.push(newTab);
        await activateTab(pane.id, item.id);
        eventBus.emit('core:tab.opened', { tab: newTab, paneId: pane.id });
    }

    async function closeTab(itemId: string, paneId?: string) {
        const targetPane = paneId
            ? paneStore.panes.find(p => p.id === paneId)
            : paneStore.panes.find(p => p.tabs.some(t => t.id === itemId));

        if (!targetPane) return;

        const tabIndex = targetPane.tabs.findIndex(t => t.id === itemId);
        if (tabIndex === -1) return;

        const closedTab = targetPane.tabs[tabIndex];
        if (closedTab.isDirty) {
            const confirmed = confirm(`Changes to "${closedTab.title}" will be lost. Are you sure you want to close?`);
            if (!confirmed) return;
        }

        targetPane.tabs.splice(tabIndex, 1);
        eventBus.emit('core:tab.closed', { tab: closedTab, paneId: targetPane.id });

        if (targetPane.activeTabId === itemId) {
            const newActiveIndex = Math.max(0, tabIndex - 1);
            const newActiveTabId = targetPane.tabs[newActiveIndex]?.id || null;
            await activateTab(targetPane.id, newActiveTabId);
        }
    }

    function updateTabState(tabId: string, state: Partial<Pick<Tab, 'isDirty' | 'title' | 'icon'>>) {
        for (const pane of paneStore.panes) {
            const tab = pane.tabs.find(t => t.id === tabId);
            if (tab) {
                Object.assign(tab, state);
                eventBus.emit('core:tab.stateChanged', { tabId, newState: state });
                break;
            }
        }
    }

    return {
        setItemProvider,
        openTab,
        closeTab,
        updateTabState,
    };
});