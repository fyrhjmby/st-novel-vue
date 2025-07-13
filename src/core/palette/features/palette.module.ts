import { commandService } from "@core/services/CommandService.ts";
import { keybindingService } from "@core/common/services/KeybindingService.ts";
import { registerPaletteCommands } from "./palette.commands.ts";
import { registerPaletteKeybindings } from "./palette.keybindings.ts";

export class CommandPaletteModule {
    public install(): void {
        registerPaletteCommands(commandService);
        registerPaletteKeybindings(keybindingService);
    }
}