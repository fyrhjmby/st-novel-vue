import type { CommandService } from '@core/services/CommandService.ts';
import type { ItemProvider } from '@core/types.ts';
import { usePaneStore } from '@core/panes/stores/paneStore.ts';
import { useTabStore } from '@core/tabs/stores/tabStore.ts';
import { useNotificationStore } from '@core/layout/stores/notificationStore.ts';
import { activeEditorService } from '@core/tabs/service/ActiveEditorService.ts';
import { CoreCommand } from '@core/constants.ts';

export function registerFileCommands(commandService: CommandService, itemProvider: ItemProvider) {
    const tabStore = useTabStore();
    const paneStore = usePaneStore();
    const notificationStore = useNotificationStore();

    commandService.register({
        id: CoreCommand.SAVE_TAB,
        label: 'File: Save',
        icon: 'fa-solid fa-save',
        when: (context) => {
            const tabId = context?.tabId || paneStore.activePane?.activeTabId;
            if (!tabId) return false;
            const tab = tabStore.getTabById(tabId);
            return tab?.isDirty || false;
        },
        execute: async (context) => {
            const tabId = context?.tabId || paneStore.activePane?.activeTabId;
            if (!tabId) return;

            const tab = tabStore.getTabById(tabId);
            if (!tab || !tab.isDirty) return;

            const content = activeEditorService.getContent(tabId);
            if (content === null) return;

            try {
                await itemProvider.updateItem(tab.itemId, content);
                activeEditorService.setContent(tabId, content);
                notificationStore.add(`'${tab.title}' saved.`, 'success', 2000);
            } catch (error) {
                console.error(`Failed to save item ${tab.itemId}`, error);
                notificationStore.add(`Error saving '${tab.title}'.`, 'error');
            }
        },
    });
}