import { usePaneStore } from '@core/panes/stores/paneStore.ts';
import { tabManagementService } from '@core/tabs/service/TabManagementService.ts';
import { paneManagementService } from '@core/panes/service/PaneManagementService.ts';
import type { CommandService } from '@core/services/CommandService.ts';
import { CoreCommand, CoreContext } from '@core/constants.ts';

export function registerPaneCommands(commandService: CommandService) {
    const paneStore = usePaneStore();

    commandService.register({
        id: CoreCommand.PANE_SPLIT_HORIZONTAL,
        label: 'Pane: Split Horizontal',
        icon: 'fa-solid fa-columns',
        execute: (context) => {
            const paneId = context?.paneId || paneStore.activePaneId;
            if (paneId) paneManagementService.splitPane(paneId, 'horizontal');
        },
    });

    commandService.register({
        id: CoreCommand.PANE_SPLIT_VERTICAL,
        label: 'Pane: Split Vertical',
        icon: 'fa-solid fa-grip-lines',
        execute: (context) => {
            const paneId = context?.paneId || paneStore.activePaneId;
            if (paneId) paneManagementService.splitPane(paneId, 'vertical');
        },
    });

    commandService.register({
        id: CoreCommand.PANE_CLOSE,
        label: 'Pane: Close Pane',
        icon: 'fa-solid fa-xmark',
        when: CoreContext.PANE_IS_SPLIT,
        execute: (context) => {
            const paneId = context?.paneId || paneStore.activePaneId;
            if (!paneId) return;

            const orphanedTabIds = paneManagementService.closePane(paneId);

            if (orphanedTabIds && orphanedTabIds.length > 0) {
                const targetPaneId = paneStore.activePaneId;
                if (targetPaneId) {
                    orphanedTabIds.forEach(tabId => {
                        paneManagementService.addTabToPane(tabId, targetPaneId);
                    });
                    paneManagementService.setActiveTab(targetPaneId, orphanedTabIds[0]);
                } else {
                    // Edge case: No panes left. Close the tabs.
                    orphanedTabIds.forEach(tabId => tabManagementService.closeTab(tabId));
                }
            }
        },
    });
}