import { commandService } from "@core/services/CommandService.ts";
import { registerPaneCommands } from "./pane.commands.ts";
import { initializePaneContexts } from "./pane.contexts.ts";

export class PaneManagementModule {
    public install(): void {
        registerPaneCommands(commandService);
        initializePaneContexts();
    }
}