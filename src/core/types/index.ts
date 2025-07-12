// 文件: src/core/types/index.ts

export interface CoreItem {
    id: string;
    title: string;
    icon: string;
    viewType: string;
    metadata: Record<string, any>;
}

export interface Tab {
    id: string;
    itemId: string;
    title: string;
    icon: string;
    isDirty: boolean;
}

// 定义叶子节点，即实际的窗格
export interface LeafPaneNode {
    id: string;
    type: 'leaf';
    tabIds: string[];
    activeTabId: string | null;
}

// 定义分割节点，用于布局
export interface SplitPaneNode {
    id: string;
    type: 'split';
    direction: 'horizontal' | 'vertical';
    children: PaneNode[];
    sizes: number[]; // 存储每个子节点的尺寸比例或固定值
}

// PaneNode 是一个联合类型，可以是叶子节点或分割节点
export type PaneNode = LeafPaneNode | SplitPaneNode;

export interface CommandContext {
    [key: string]: any;
}

export interface Command {
    id: string;
    label: string | ((context: CommandContext) => string);
    icon?: string;
    when?: (context: CommandContext) => boolean;
    execute: (context: CommandContext) => void;
}

export interface ContextMenuItem {
    commandId: string;
    context?: CommandContext;
    isDivider?: boolean;
}