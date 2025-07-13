import type { KeybindingService } from '@core/common/services/KeybindingService';
import { CoreCommand } from '@core/constants';

export function registerNovelKeybindings(keybindingService: KeybindingService) {
    // 核心命令的快捷键
    keybindingService.register({
        key: 'ctrl+s',
        commandId: CoreCommand.SAVE_TAB,
    });

    keybindingService.register({
        key: 'ctrl+shift+p',
        commandId: CoreCommand.COMMAND_PALETTE_SHOW,
    });

    // 可以在这里添加小说模块专属的快捷键
    // 例如: 新建章节
    // keybindingService.register({
    //     key: 'ctrl+alt+n',
    //     commandId: 'novel.chapter.create',
    //     when: 'activeSidebarPanel == "directory"' // 示例: 仅在目录面板激活时生效
    // });
}