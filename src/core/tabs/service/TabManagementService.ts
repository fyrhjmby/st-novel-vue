import { useTabStore } from '@core/tabs/stores/tabStore.ts';
import { usePaneStore } from '@core/panes/stores/paneStore.ts';
import { useNotificationStore } from '@core/layout/stores/notificationStore.ts';
import { commandService } from '@core/services/CommandService.ts';
import { uiService } from '@core/common/services/UIService.ts';
import { eventBus } from '@core/common/services/EventBusService.ts';
import { paneManagementService } from '@core/panes/service/PaneManagementService.ts';
import { CoreEvent, CoreCommand } from '@core/constants.ts';
import type { ItemProvider, CoreItem, Tab } from '@core/types.ts';

class TabManagementService {
    private itemProvider: ItemProvider | null = null;

    public setItemProvider(provider: ItemProvider) {
        this.itemProvider = provider;
    }

    public async openTab(itemId: string, targetPaneId?: string) {
        const tabStore = useTabStore();
        const paneStore = usePaneStore();
        const notificationStore = useNotificationStore();

        const paneId = targetPaneId || paneStore.activePaneId;
        if (!paneId) {
            notificationStore.add('No active pane to open the tab in.', 'error');
            return;
        }

        const existingTab = tabStore.findTabByItemId(itemId);
        if (existingTab) {
            this.activateTab(existingTab.id);
            return;
        }

        if (!this.itemProvider) throw new Error('[TabManagementService] ItemProvider has not been set.');

        const item = await this.itemProvider.getItem(itemId);
        if (!item) {
            notificationStore.add(`Failed to open: Item "${itemId}" not found.`, 'error');
            return;
        }

        const newTab: Tab = {
            id: `tab-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            itemId: item.id,
            title: item.title,
            icon: item.icon,
            isDirty: false,
        };

        tabStore._addTab(newTab);
        paneManagementService.addTabToPane(newTab.id, paneId);
        this.activateTab(newTab.id);
        eventBus.emit(CoreEvent.TAB_OPENED, { tab: newTab, paneId });
    }

    public async closeTab(tabId: string) {
        const tabStore = useTabStore();
        const notificationStore = useNotificationStore();
        const tabToClose = tabStore.getTabById(tabId);

        if (!tabToClose) return;

        if (tabToClose.isDirty) {
            const userChoice = await uiService.requestConfirmation({
                title: 'Unsaved Changes',
                message: `Do you want to save the changes for '${tabToClose.title}'?`,
                confirmText: 'Save',
                cancelText: "Don't Save",
            });

            if (userChoice) {
                await commandService.execute(CoreCommand.SAVE_TAB, { tabId });
                if (!tabStore.getTabById(tabId)?.isDirty) {
                    this._forceCloseTab(tabId);
                } else {
                    notificationStore.add(`Failed to save '${tabToClose.title}'. Close aborted.`, 'error');
                }
            } else {
                this._forceCloseTab(tabId);
            }
        } else {
            this._forceCloseTab(tabId);
        }
    }

    public activateTab(tabId: string) {
        const paneStore = usePaneStore();
        const paneId = paneStore.findLeafContainingTab(tabId)?.id;
        if (!paneId) return;

        paneManagementService.setActivePane(paneId);
        paneManagementService.setActiveTab(paneId, tabId);
        eventBus.emit(CoreEvent.TAB_ACTIVATED, { tabId, paneId });
    }

    public async loadCoreItemForTab(tabId: string): Promise<CoreItem | null> {
        const tabStore = useTabStore();
        const notificationStore = useNotificationStore();

        if (!this.itemProvider) {
            console.error('[TabManagementService] ItemProvider not set.');
            return null;
        }
        const tab = tabStore.getTabById(tabId);
        if (!tab) return null;

        try {
            const item = await this.itemProvider.getItem(tab.itemId);
            if (!item) {
                notificationStore.add(`Item for tab '${tab.title}' not found. It may have been deleted.`, 'error');
                await this.closeTab(tabId);
            }
            return item;
        } catch (error) {
            console.error(`Error loading item ${tab.itemId}`, error);
            notificationStore.add(`An error occurred while loading '${tab.title}'.`, 'error');
            await this.closeTab(tabId);
            return null;
        }
    }

    private _forceCloseTab(tabId: string) {
        const tabStore = useTabStore();
        const closedTab = tabStore.getTabById(tabId);
        if (!closedTab) return;

        paneManagementService.removeTabFromPane(tabId);
        tabStore._removeTab(tabId);

        eventBus.emit(CoreEvent.TAB_CLOSED, { tab: closedTab });
    }
}

export const tabManagementService = new TabManagementService();