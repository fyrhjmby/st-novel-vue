import type { CommandService } from '@core/services/CommandService.ts';
import { commandPaletteService } from '@core/palette/services/CommandPaletteService.ts';
import { CoreCommand } from '@core/constants.ts';

export function registerPaletteCommands(commandService: CommandService) {
    commandService.register({
        id: CoreCommand.COMMAND_PALETTE_SHOW,
        label: 'View: Show Command Palette',
        execute: () => {
            commandPaletteService.show();
        },
    });
}