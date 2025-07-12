// 文件: src/core/services/CommandService.ts

import type { Command, CommandContext } from '@/core/types';
import { usePaneStore } from '@/core/stores/paneStore';
import { contextService } from './ContextService';

class CommandService {
    private commands: Map<string, Command> = new Map();

    public register(command: Command): void {
        if (this.commands.has(command.id)) {
            console.warn(`[CommandService] Command "${command.id}" is already registered. Overwriting.`);
        }
        this.commands.set(command.id, command);
    }

    public find(commandId: string): Command | undefined {
        return this.commands.get(commandId);
    }

    private getGlobalContext(): CommandContext {
        const paneStore = usePaneStore();
        return {
            activePaneId: paneStore.activePaneId,
            activeTabId: paneStore.activePane?.activeTabId,
        };
    }

    public canExecute(commandId: string, specificContext?: CommandContext): boolean {
        const command = this.find(commandId);
        if (!command) return false;

        const context = { ...this.getGlobalContext(), ...specificContext };

        if (typeof command.when === 'string') {
            return contextService.check(command.when);
        }
        if (typeof command.when === 'function') {
            return command.when(context);
        }

        return true;
    }

    public execute(commandId: string, specificContext?: CommandContext): void {
        if (!this.canExecute(commandId, specificContext)) {
            console.warn(`[CommandService] Execution of command "${commandId}" was prevented by its 'when' condition.`);
            return;
        }

        const command = this.find(commandId);
        if (!command) {
            console.error(`[CommandService] Command "${commandId}" not found.`);
            return;
        }

        const context = { ...this.getGlobalContext(), ...specificContext };
        command.execute(context);
    }

    /**
     * Returns an iterator for all registered commands.
     * The availability of the command is not checked here.
     */
    public *getAllCommands() {
        for (const command of this.commands.values()) {
            yield command;
        }
    }
}

export const commandService = new CommandService();