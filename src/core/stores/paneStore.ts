// 文件: src/core/stores/paneStore.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { PaneNode, LeafPaneNode, SplitPaneNode } from '@/core/types';
import { eventBus } from '@/core/services/EventBusService';
import { useNotificationStore } from './notificationStore';

export const usePaneStore = defineStore('core-pane', () => {
    const root = ref<PaneNode | null>(null);
    const activePaneId = ref<string | null>(null);

    const activePane = computed((): LeafPaneNode | null => {
        if (!activePaneId.value || !root.value) return null;
        const result = findNodeAndParent(root.value, activePaneId.value);
        return result && result.node.type === 'leaf' ? result.node : null;
    });

    const findNodeAndParent = (
        startNode: PaneNode,
        id: string,
        parent: SplitPaneNode | null = null
    ): { node: PaneNode; parent: SplitPaneNode | null } | null => {
        if (startNode.id === id) return { node: startNode, parent };
        if (startNode.type === 'split') {
            for (const child of startNode.children) {
                const found = findNodeAndParent(child, id, startNode);
                if (found) return found;
            }
        }
        return null;
    };

    function initializePanes() {
        if (!root.value) {
            const initialPaneId = `pane-${Date.now()}`;
            root.value = { id: initialPaneId, type: 'leaf', tabIds: [], activeTabId: null };
            activePaneId.value = initialPaneId;
            eventBus.emit('core:pane.initialized', { initialPaneId });
            eventBus.emit('core:state-changed', { store: 'pane' });
        }
    }

    function setActivePane(paneId: string | null) {
        if (paneId && activePaneId.value !== paneId) {
            activePaneId.value = paneId;
            eventBus.emit('core:pane.activated', { paneId });
            eventBus.emit('core:state-changed', { store: 'pane' });
        }
    }

    function setActiveTab(paneId: string, tabId: string | null) {
        if (!root.value) return;
        const result = findNodeAndParent(root.value, paneId);
        if (result && result.node.type === 'leaf') {
            if(result.node.activeTabId !== tabId) {
                result.node.activeTabId = tabId;
                eventBus.emit('core:state-changed', { store: 'pane' });
            }
        }
    }

    function addTabToPane(tabId: string, paneId: string) {
        if (!root.value) return;
        const result = findNodeAndParent(root.value, paneId);
        if (result && result.node.type === 'leaf' && !result.node.tabIds.includes(tabId)) {
            result.node.tabIds.push(tabId);
            eventBus.emit('core:state-changed', { store: 'pane' });
        }
    }

    function removeTabFromPane(tabId: string) {
        if (!root.value) return;
        const leaf = findLeafContainingTab(root.value, tabId);
        if (leaf) {
            const index = leaf.tabIds.indexOf(tabId);
            if (index > -1) {
                leaf.tabIds.splice(index, 1);
                if (leaf.activeTabId === tabId) {
                    const newActiveIndex = Math.max(0, index - 1);
                    leaf.activeTabId = leaf.tabIds[newActiveIndex] || null;
                }
                eventBus.emit('core:state-changed', { store: 'pane' });
            }
        }
    }

    function findLeafContainingTab(node: PaneNode, tabId: string): LeafPaneNode | null {
        if (node.type === 'leaf') {
            return node.tabIds.includes(tabId) ? node : null;
        }
        for (const child of node.children) {
            const found = findLeafContainingTab(child, tabId);
            if (found) return found;
        }
        return null;
    }

    function splitPane(sourcePaneId: string, direction: 'horizontal' | 'vertical' = 'horizontal'): string {
        if (!root.value) return '';
        const findResult = findNodeAndParent(root.value, sourcePaneId);
        if (!findResult || findResult.node.type !== 'leaf') return '';

        const sourceNode = findResult.node;
        const parentNode = findResult.parent;

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
        } else {
            root.value = newSplit;
        }

        setActivePane(newLeaf.id);
        eventBus.emit('core:pane.splitted', { sourcePaneId, newPaneId: newLeaf.id });
        eventBus.emit('core:state-changed', { store: 'pane' });
        return newLeaf.id;
    }

    function closePane(paneId: string) {
        if (!root.value || root.value.type === 'leaf') {
            useNotificationStore().add('Cannot close the last pane.', 'warning');
            return;
        }
        const findResult = findNodeAndParent(root.value, paneId);
        if (!findResult || findResult.node.type !== 'leaf' || !findResult.parent) return;

        const { node, parent } = findResult;
        const closedPaneTabIds = node.tabIds;
        parent.children = parent.children.filter(c => c.id !== paneId);
        const totalSize = parent.sizes.reduce((a, b) => a + b, 0);
        parent.sizes.pop(); // Simplistic removal, should be smarter
        parent.sizes = parent.sizes.map(s => s / totalSize * 100);

        if (activePaneId.value === paneId) {
            const firstLeaf = findLeaf(root.value);
            setActivePane(firstLeaf ? firstLeaf.id : null);
        }

        if (parent.children.length === 1) {
            const grandparent = findNodeAndParent(root.value, parent.id)?.parent;
            const remainingChild = parent.children[0];
            if (grandparent) {
                const index = grandparent.children.findIndex(c => c.id === parent.id);
                grandparent.children[index] = remainingChild; // Direct replacement
            } else {
                root.value = remainingChild;
            }
        }

        eventBus.emit('core:pane.closed', { closedPaneId: paneId, tabIds: closedPaneTabIds });
        eventBus.emit('core:state-changed', { store: 'pane' });
    }

    function updatePaneNodeSize(splitNodeId: string, newSizes: number[]) {
        if (!root.value) return;
        const findResult = findNodeAndParent(root.value, splitNodeId);
        if (findResult && findResult.node.type === 'split') {
            findResult.node.sizes = newSizes;
            eventBus.emit('core:state-changed', { store: 'pane' });
        }
    }

    function findLeaf(node: PaneNode): LeafPaneNode | null {
        if (node.type === 'leaf') return node;
        for(const child of node.children) {
            const leaf = findLeaf(child);
            if (leaf) return leaf;
        }
        return null;
    }

    function hydrate(state: { root: PaneNode, activePaneId: string | null }) {
        if (state.root && state.activePaneId) {
            root.value = state.root;
            activePaneId.value = state.activePaneId;
        }
    }

    return {
        root, activePaneId, activePane,
        initializePanes, setActivePane, setActiveTab,
        addTabToPane, removeTabFromPane,
        splitPane, closePane, updatePaneNodeSize,
        hydrate,
    };
});