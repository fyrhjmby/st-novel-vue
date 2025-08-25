// src/novel/editor/stores/editor-state/systemViewStore.ts
import { defineStore } from 'pinia';
import { usePaneStore } from './paneStore';
import { useTabStore } from './tabStore';
import { useUIStore } from '../uiStore';
import { useItemStore } from './itemStore';

export const useSystemViewStore = defineStore('editor-system-view', () => {
    const paneStore = usePaneStore();
    const tabStore = useTabStore();
    const uiStore = useUIStore();
    const itemStore = useItemStore();

    function toggleAIPanel(sourcePaneId: string) {
        const aiTaskPane = paneStore.panes.find(p => p.openTabIds.includes('system:ai_tasks'));
        if (aiTaskPane) {
            paneStore.closePane(aiTaskPane.id);
        } else {
            const newPaneId = paneStore.splitPane(sourcePaneId);
            if(newPaneId) tabStore.openTab('system:ai_tasks', newPaneId);
            paneStore.setActivePane(sourcePaneId);
        }
    }

    function ensureAIPanelIsOpen(sourcePaneId: string) {
        if (!paneStore.panes.some(p => p.openTabIds.includes('system:ai_tasks'))) {
            const newPaneId = paneStore.splitPane(sourcePaneId);
            if(newPaneId) tabStore.openTab('system:ai_tasks', newPaneId);
            paneStore.setActivePane(sourcePaneId);
        }
    }

    function toggleHistoryPanel(sourcePaneId: string) {
        const sourcePane = paneStore.panes.find(p => p.id === sourcePaneId);
        if (!sourcePane?.activeTabId || sourcePane.activeTabId.startsWith('system:')) return;

        const historyTabId = `system:history:${sourcePane.activeTabId}`;
        const historyPane = paneStore.panes.find(p => p.openTabIds.includes(historyTabId));

        if (historyPane) {
            paneStore.closePane(historyPane.id);
        } else {
            const newPaneId = paneStore.splitPane(sourcePaneId);
            if(newPaneId) tabStore.openTab(historyTabId, newPaneId);
            paneStore.setActivePane(sourcePaneId);
        }
    }

    function openReaderView() {
        const activePane = paneStore.panes.find(p => p.id === paneStore.activePaneId);
        if (!activePane || !activePane.activeTabId) {
            console.warn('Cannot open reader mode: no active tab.');
            return;
        }
        const { node: activeItem } = itemStore.findItemById(activePane.activeTabId);

        if (activeItem && 'content' in activeItem) {
            uiStore.showReaderMode(activeItem);
        } else {
            console.warn('Cannot open reader mode: no active document with content.');
        }
    }

    return {
        toggleAIPanel,
        ensureAIPanelIsOpen,
        toggleHistoryPanel,
        openReaderView,
    };
});