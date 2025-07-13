import type { ItemProvider } from '@core/common/types/providers.ts';
import { usePaneStore } from '@core/panes/stores/paneStore.ts';
import { keybindingService } from '../common/services/KeybindingService.ts';
import { workspaceService } from './WorkspaceService';
import { tabManagementService } from '../tabs/service/TabManagementService.ts';
import { PaneManagementModule } from '../panes/features/pane.module.ts';
import { FileOperationsModule } from '../tabs/features/file.module.ts';
import { CommandPaletteModule } from '../palette/features/palette.module.ts';

export class EditorKernel {
    private itemProvider: ItemProvider;

    constructor(provider: ItemProvider) {
        this.itemProvider = provider;
    }

    public async startup(): Promise<void> {
        console.log('[EditorKernel] Starting up...');

        this.setupServices();
        this.registerCoreModules();

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

    private setupServices(): void {
        tabManagementService.setItemProvider(this.itemProvider);
    }

    private registerCoreModules(): void {
        new PaneManagementModule().install();
        new FileOperationsModule().install(this.itemProvider);
        new CommandPaletteModule().install();
    }
}