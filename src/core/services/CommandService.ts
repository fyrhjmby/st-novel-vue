// 文件: src/core/services/CommandService.ts
// 描述: 命令服务，负责注册、管理和执行所有命令。

import type { Command, CommandContext } from '@/core/types';

class CommandService {
    private commands: Map<string, Command> = new Map();

    /**
     * 注册一个命令。
     * 应用层在启动时调用此方法，将所有业务操作封装成命令并注入内核。
     * @param command - 要注册的命令对象。
     */
    public register(command: Command): void {
        if (this.commands.has(command.id)) {
            console.warn(`[CommandService] Command ID "${command.id}" is already registered. Overwriting.`);
        }
        this.commands.set(command.id, command);
    }

    /**
     * 执行一个命令。
     * @param commandId - 要执行的命令的ID。
     * @param context - 执行命令时传递的上下文。
     */
    public execute(commandId: string, context?: CommandContext): void {
        const command = this.commands.get(commandId);
        if (!command) {
            console.error(`[CommandService] Command "${commandId}" not found.`);
            return;
        }

        if (command.canExecute && !command.canExecute(context)) {
            console.warn(`[CommandService] Execution of command "${commandId}" was prevented by its 'canExecute' condition.`);
            return;
        }

        command.execute(context);
    }

    /**
     * 获取一个命令的定义。
     * @param commandId - 命令的ID。
     * @returns 返回命令对象，如果不存在则返回undefined。
     */
    public get(commandId: string): Command | undefined {
        return this.commands.get(commandId);
    }
}

// 导出一个单例，确保整个应用共享同一个命令中心。
export const commandService = new CommandService();