import type { KeybindingService } from '@core/common/services/KeybindingService.ts';
import { CoreCommand } from '@core/constants.ts';

export function registerPaletteKeybindings(keybindingService: KeybindingService) {
    keybindingService.register({
        key: 'ctrl+shift+p',
        commandId: CoreCommand.COMMAND_PALETTE_SHOW,
    });
}