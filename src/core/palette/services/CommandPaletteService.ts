import { useCommandPaletteStore, type PaletteCommand } from '@core/palette/stores/commandPaletteStore.ts';
import { commandService } from '@core/services/CommandService.ts';

class CommandPaletteService {
    public show(): void {
        const commandPaletteStore = useCommandPaletteStore();

        const availableCommands: PaletteCommand[] = [];
        for (const command of commandService.getAllCommands()) {
            if (commandService.canExecute(command.id)) {
                const label = typeof command.label === 'function' ? command.label({}) : command.label;
                availableCommands.push({
                    id: command.id,
                    label: label,
                    icon: command.icon
                });
            }
        }

        commandPaletteStore._setCommands(availableCommands);
        commandPaletteStore.show();
    }

    public executeSelected(): void {
        const store = useCommandPaletteStore();
        const command = store.filteredCommands[store.selectedIndex];
        if (command) {
            this.executeCommand(command.id);
        }
    }

    public executeCommand(commandId: string): void {
        const store = useCommandPaletteStore();
        commandService.execute(commandId);
        store.hide();
    }
}

export const commandPaletteService = new CommandPaletteService();