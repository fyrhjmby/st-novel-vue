import type { KeybindingService } from '@core/common/services/KeybindingService.ts';
import { CoreCommand } from '@core/constants.ts';

export function registerFileKeybindings(keybindingService: KeybindingService) {
    keybindingService.register({
        key: 'ctrl+s',
        commandId: CoreCommand.SAVE_TAB,
    });
}