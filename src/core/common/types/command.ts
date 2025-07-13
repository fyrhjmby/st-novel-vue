export interface CommandContext {
    [key: string]: any;
}

export interface Command {
    id: string;
    label: string | ((context: CommandContext) => string);
    icon?: string;
    when?: ((context: CommandContext) => boolean) | string;
    execute: (context: CommandContext) => void;
}

export interface ContextMenuItem {
    commandId: string;
    context?: CommandContext;
    isDivider?: boolean;
}

export interface ProcessedMenuItem {
    id: string;
    isDivider: boolean;
    isDisabled: boolean;
    label: string;
    icon?: string;
    command: Command;
    context?: CommandContext;
}