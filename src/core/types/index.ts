
export interface CoreItem {
    id: string;
    title: string;
    icon: string;
    viewType: string;
    metadata?: Record<string, any>;
}

export interface Tab {
    id: string;
    title: string;
    icon: string;
    isDirty?: boolean;
}

export interface Pane {
    id: string;
    tabs: Tab[];
    activeTabId: string | null;
    activeItem: CoreItem | null;
}

export interface CommandContext {
    targetId?: string;
    paneId?: string;
    [key: string]: any;
}

export interface Command {
    id: string;
    label: string;
    icon?: string;
    execute: (context?: CommandContext) => void;
    canExecute?: (context?: CommandContext) => boolean;
}

export interface ContextMenuItem {
    id: string;
    label: string;
    icon?: string;
    commandId: string;
    commandContext?: CommandContext;
    isDivider?: boolean;
}