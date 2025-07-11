import { commandService } from './CommandService';

interface Keybinding {
    key: string;
    commandId: string;
    when?: () => boolean;
}

class KeybindingService {
    private keybindings: Map<string, Keybinding> = new Map();

    public initialize(): void {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    public destroy(): void {
        window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }

    /**
     * 注册一个快捷键。
     * @param keybinding - 快捷键定义对象。
     */
    public register(keybinding: Keybinding): void {
        const key = this.normalizeKey(keybinding.key);
        this.keybindings.set(key, keybinding);
    }

    private handleKeyDown(event: KeyboardEvent): void {
        const key = this.eventToKey(event);
        const binding = this.keybindings.get(key);

        if (binding) {
            if (!binding.when || binding.when()) {
                event.preventDefault();
                event.stopPropagation();
                commandService.execute(binding.commandId);
            }
        }
    }

    private normalizeKey(key: string): string {
        return key.toLowerCase().split('+').sort().join('+');
    }

    private eventToKey(event: KeyboardEvent): string {
        const parts: string[] = [];
        if (event.ctrlKey) parts.push('ctrl');
        if (event.shiftKey) parts.push('shift');
        if (event.altKey) parts.push('alt');
        if (event.metaKey) parts.push('meta'); // Cmd on Mac

        const key = event.key.toLowerCase();
        if (!['control', 'shift', 'alt', 'meta'].includes(key)) {
            parts.push(key);
        }

        return parts.sort().join('+');
    }
}

export const keybindingService = new KeybindingService();