// 文件: src/core/types/pane.ts

// 定义叶子节点，即实际的窗格
export interface LeafPaneNode {
    id: string;
    type: 'leaf';
    tabIds: string[];
    activeTabId: string | null;
}

// 定义分割节点，用于布局
export interface SplitPaneNode {
    id:string;
    type: 'split';
    direction: 'horizontal' | 'vertical';
    children: PaneNode[];
    sizes: number[]; // 存储每个子节点的尺寸比例
}

// PaneNode 是一个联合类型，可以是叶子节点或分割节点
export type PaneNode = LeafPaneNode | SplitPaneNode;