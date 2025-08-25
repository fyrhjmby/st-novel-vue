// src/novel/editor/stores/editor-state/tabStore.ts
import { defineStore } from 'pinia';
import { usePaneStore } from './paneStore';
import { useUIStore } from '../uiStore';
import { useItemStore } from './itemStore';

export const useTabStore = defineStore('editor-tab', () => {
    const paneStore = usePaneStore();
    const uiStore = useUIStore();
    const itemStore = useItemStore();

    function openTab(itemId: string, targetPaneId?: string) {
        const paneId = targetPaneId || paneStore.activePaneId;
        if (!paneId) return;

        let pane = paneStore.panes.find(p => p.id === paneId);
        if (!pane) return;

        const { node } = itemStore.findItemById(itemId);
        if (!node || (node.type !== 'system' && !('content' in node))) {
            console.warn(`Attempted to open a non-tab item: ${itemId}. This should be handled by the calling UI component (e.g., for tree expansion).`);
            return;
        }

        const existingTabPane = paneStore.panes.find(p => p.openTabIds.includes(itemId));
        if (existingTabPane) {
            existingTabPane.activeTabId = itemId;
            paneStore.setActivePane(existingTabPane.id);
            return;
        }

        if (!pane.openTabIds.includes(itemId)) {
            pane.openTabIds.push(itemId);
        }
        pane.activeTabId = itemId;
        paneStore.setActivePane(paneId);
    }

    function closeTab(itemId: string, paneId?: string) {
        const targetPaneId = paneId || paneStore.panes.find(p => p.openTabIds.includes(itemId))?.id;
        if (!targetPaneId) return;

        const pane = paneStore.panes.find(p => p.id === targetPaneId);
        if (!pane) return;

        const index = pane.openTabIds.indexOf(itemId);
        if (index === -1) return;

        pane.openTabIds.splice(index, 1);
        if (pane.activeTabId === itemId) {
            const newActiveIndex = Math.max(0, index - 1);
            pane.activeTabId = pane.openTabIds[newActiveIndex] || null;
        }

        if (pane.openTabIds.length === 0 && paneStore.panes.length > 1) {
            paneStore.closePane(pane.id);
        }
    }

    return {
        openTab,
        closeTab,
    };
});