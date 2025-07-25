// 文件: src/core/panes/service/PaneTreeService.ts
// ---------------------------------------------
// 描述: 提供操作和查询窗格树（PaneNode）的底层静态方法。此版本修复了 closePane 方法中的一个布局尺寸计算 Bug。

import type { PaneNode, LeafPaneNode, SplitPaneNode } from '@core/panes/types/pane.ts';

class PaneTreeService {

    public findNodeAndParent(
        startNode: PaneNode,
        id: string,
        parent: SplitPaneNode | null = null
    ): { node: PaneNode; parent: SplitPaneNode | null } | null {
        if (startNode.id === id) return { node: startNode, parent };
        if (startNode.type === 'split') {
            for (const child of startNode.children) {
                const found = this.findNodeAndParent(child, id, startNode);
                if (found) return found;
            }
        }
        return null;
    }

    public findLeaf(node: PaneNode): LeafPaneNode | null {
        if (node.type === 'leaf') return node;
        for(const child of node.children) {
            const leaf = this.findLeaf(child);
            if (leaf) return leaf;
        }
        return null;
    }

    public findLeafContainingTab(node: PaneNode, tabId: string): LeafPaneNode | null {
        if (node.type === 'leaf') {
            return node.tabIds.includes(tabId) ? node : null;
        }
        for (const child of node.children) {
            const found = this.findLeafContainingTab(child, tabId);
            if (found) return found;
        }
        return null;
    }

    public splitPane(
        root: PaneNode,
        sourcePaneId: string,
        direction: 'horizontal' | 'vertical'
    ): { newRoot: PaneNode; newPaneId: string } | null {
        const findResult = this.findNodeAndParent(root, sourcePaneId);
        if (!findResult || findResult.node.type !== 'leaf') return null;

        const { node: sourceNode, parent: parentNode } = findResult;

        const newLeaf: LeafPaneNode = { id: `pane-${Date.now()}`, type: 'leaf', tabIds: [], activeTabId: null };
        const newSplit: SplitPaneNode = {
            id: `split-${Date.now()}`,
            type: 'split',
            direction,
            children: [sourceNode, newLeaf],
            sizes: [50, 50]
        };

        if (parentNode) {
            const index = parentNode.children.findIndex(c => c.id === sourceNode.id);
            parentNode.children.splice(index, 1, newSplit);
            return { newRoot: { ...root }, newPaneId: newLeaf.id };
        } else {
            return { newRoot: newSplit, newPaneId: newLeaf.id };
        }
    }

    public closePane(
        root: PaneNode,
        paneId: string
    ): { newRoot: PaneNode, closedPane: LeafPaneNode } | null {
        if (root.type === 'leaf') return null; // Cannot close the root pane if it's the only one

        const findResult = this.findNodeAndParent(root, paneId);
        if (!findResult || findResult.node.type !== 'leaf' || !findResult.parent) return null;

        const { node: closedPane, parent } = findResult;
        const siblingIndex = parent.children.findIndex(c => c.id === paneId);

        const sizeToDistribute = parent.sizes[siblingIndex];
        parent.children.splice(siblingIndex, 1);
        parent.sizes.splice(siblingIndex, 1);
        parent.sizes[siblingIndex > 0 ? siblingIndex - 1 : 0] += sizeToDistribute;

        if (parent.children.length === 1) {
            const remainingChild = parent.children[0];
            const grandparentResult = this.findNodeAndParent(root, parent.id);
            if (grandparentResult && grandparentResult.parent) {
                const grandparent = grandparentResult.parent;
                const parentIndex = grandparent.children.findIndex(p => p.id === parent.id);
                grandparent.children[parentIndex] = remainingChild;

            } else {
                root = remainingChild;
            }
        }

        return { newRoot: { ...root }, closedPane };
    }
}

export const paneTreeService = new PaneTreeService();