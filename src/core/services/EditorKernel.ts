// 文件: src/core/services/EditorKernel.ts

import type { ItemProvider } from '@/core/types/providers';
import { useTabStore } from '@/core/stores/tabStore';
import { usePaneStore } from '@/core/stores/paneStore';
import { useNotificationStore } from '../stores/notificationStore';
import { useCommandPaletteStore } from '../stores/commandPaletteStore';
import { commandService } from './CommandService';
import { keybindingService } from './KeybindingService';
import { workspaceService } from './WorkspaceService';
import { activeEditorService } from './ActiveEditorService';

export class EditorKernel {
    private itemProvider: ItemProvider;

    constructor(provider: ItemProvider) {
        this.itemProvider = provider;
    }

    public async startup(): Promise<void> {
        console.log('[EditorKernel] Starting up...');

        this.setupStores();
        this.registerCoreCommands();
        this.registerCoreKeybindings();

        keybindingService.initialize();
        workspaceService.initialize();
        workspaceService.loadAndHydrateStores();
        usePaneStore().initializePanes();

        console.log('[EditorKernel] Startup complete.');
    }

    public shutdown(): void {
        keybindingService.destroy();
        workspaceService.destroy();
        console.log('[EditorKernel] Shutdown complete.');
    }

    private setupStores(): void {
        const tabStore = useTabStore();
        tabStore.setItemProvider(this.itemProvider);
    }

    private registerCoreCommands(): void {
        const paneStore = usePaneStore();
        const tabStore = useTabStore();
        const notificationStore = useNotificationStore();
        const commandPaletteStore = useCommandPaletteStore();

        commandService.register({
            id: 'core.commandPalette.show',
            label: 'View: Show Command Palette',
            execute: () => commandPaletteStore.show(),
        });

        commandService.register({
            id: 'core.pane.split-horizontal',
            label: 'Pane: Split Horizontal',
            icon: 'fa-solid fa-columns',
            execute: (context) => {
                const paneId = context?.paneId || paneStore.activePaneId;
                if (paneId) paneStore.splitPane(paneId, 'horizontal');
            },
        });

        commandService.register({
            id: 'core.pane.split-vertical',
            label: 'Pane: Split Vertical',
            icon: 'fa-solid fa-grip-lines',
            execute: (context) => {
                const paneId = context?.paneId || paneStore.activePaneId;
                if (paneId) paneStore.splitPane(paneId, 'vertical');
            },
        });

        commandService.register({
            id: 'core.pane.close',
            label: 'Pane: Close Pane',
            icon: 'fa-solid fa-xmark',
            when: "root.type == 'split'", // Example of new when clause
            execute: (context) => {
                const paneId = context?.paneId || paneStore.activePaneId;
                if (paneId) paneStore.closePane(paneId);
            },
        });

        commandService.register({
            id: 'core.saveTab',
            label: 'File: Save',
            icon: 'fa-solid fa-save',
            when: (context) => { // Function-based when still works
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
                    await this.itemProvider.updateItem(tab.itemId, content);
                    activeEditorService.setContent(tabId, content);
                    notificationStore.add(`'${tab.title}' saved.`, 'success', 2000);
                } catch (error) {
                    console.error(`Failed to save item ${tab.itemId}`, error);
                    notificationStore.add(`Error saving '${tab.title}'.`, 'error');
                }
            },
        });

        // After all commands are registered, clear the cache so it rebuilds on next request
        commandService.clearCache();
    }

    private registerCoreKeybindings(): void {
        keybindingService.register({
            key: 'ctrl+shift+p',
            commandId: 'core.commandPalette.show',
        });

        keybindingService.register({
            key: 'ctrl+s',
            commandId: 'core.saveTab',
            when: () => {
                const paneStore = usePaneStore();
                const tabStore = useTabStore();
                const tabId = paneStore.activePane?.activeTabId;
                return tabStore.getTabById(tabId || '')?.isDirty || false;
            }
        });
    }
}