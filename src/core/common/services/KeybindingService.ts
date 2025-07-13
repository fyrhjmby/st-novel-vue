

import { commandService } from '../../services/CommandService.ts';

interface Keybinding {
    key: string;
    commandId: string;
    when?: () => boolean;
}

class KeybindingService {
    private keybindings: Map<string, Keybinding> = new Map();
    // [FIX] Store the bound event handler to ensure it can be removed.
    private readonly boundHandleKeyDown: (event: KeyboardEvent) => void;

    constructor() {
        this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    }

    public initialize(): void {
        window.addEventListener('keydown', this.boundHandleKeyDown);
    }

    public destroy(): void {
        window.removeEventListener('keydown', this.boundHandleKeyDown);
    }

    public register(keybinding: Keybinding): void {
        const key = this.normalizeKey(keybinding.key);
        this.keybindings.set(key, keybinding);
    }

    private handleKeyDown(event: KeyboardEvent): void {
        const key = this.eventToKey(event);
        const binding = this.keybindings.get(key);

        if (binding) {
            const isKeybindingConditionMet = !binding.when || binding.when();
            const isCommandConditionMet = commandService.canExecute(binding.commandId);

            if (isKeybindingConditionMet && isCommandConditionMet) {
                event.preventDefault();
                event.stopPropagation();
                commandService.execute(binding.commandId);
            }
        }
    }

    private normalizeKey(key: string): string {
        const parts = key.toLowerCase().split('+').map(part => part.trim());
        const modifiers = parts.filter(p => ['ctrl', 'shift', 'alt', 'meta'].includes(p)).sort();
        const mainKey = parts.find(p => !['ctrl', 'shift', 'alt', 'meta'].includes(p));
        return [...modifiers, mainKey].join('+');
    }

    private eventToKey(event: KeyboardEvent): string {
        const parts: string[] = [];
        if (event.ctrlKey) parts.push('ctrl');
        if (event.shiftKey) parts.push('shift');
        if (event.altKey) parts.push('alt');
        if (event.metaKey) parts.push('meta');

        const key = event.key.toLowerCase();
        if (!['control', 'shift', 'alt', 'meta'].includes(key)) {
            parts.push(key);
        }

        return this.normalizeKey(parts.join('+'));
    }
}

export const keybindingService = new KeybindingService();