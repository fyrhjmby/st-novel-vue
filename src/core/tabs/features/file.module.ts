import { commandService } from "@core/services/CommandService.ts";
import { keybindingService } from "@core/common/services/KeybindingService.ts";
import type { ItemProvider } from "@core/types.ts";
import { registerFileCommands } from "./file.commands.ts";
import { registerFileKeybindings } from "./file.keybindings.ts";

export class FileOperationsModule {
    public install(itemProvider: ItemProvider): void {
        registerFileCommands(commandService, itemProvider);
        registerFileKeybindings(keybindingService);
    }
}