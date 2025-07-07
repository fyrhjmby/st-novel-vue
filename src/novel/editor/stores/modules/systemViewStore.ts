// 文件: src/novel/editor/stores/modules/systemViewStore.ts

import { defineStore } from 'pinia';
import { usePaneStore } from './paneStore';
import { useTabStore } from './tabStore';

export const useSystemViewStore = defineStore('editor-system-view', () => {
    const paneStore = usePaneStore();
    const tabStore = useTabStore();

    function toggleAIPanel(sourcePaneId: string) {
        const aiTaskPane = paneStore.panes.find(p => p.openTabIds.includes('system:ai_tasks'));
        if (aiTaskPane) {
            paneStore.closePane(aiTaskPane.id);
        } else {
            const newPaneId = paneStore.splitPane(sourcePaneId);
            tabStore.openTab('system:ai_tasks', newPaneId);
            paneStore.setActivePane(sourcePaneId);
        }
    }

    function ensureAIPanelIsOpen(sourcePaneId: string) {
        if (!paneStore.panes.some(p => p.openTabIds.includes('system:ai_tasks'))) {
            const newPaneId = paneStore.splitPane(sourcePaneId);
            tabStore.openTab('system:ai_tasks', newPaneId);
            paneStore.setActivePane(sourcePaneId);
        }
    }

    function toggleHistoryPanel(sourcePaneId: string) {
        const sourcePane = paneStore.panes.find(p => p.id === sourcePaneId);
        if (!sourcePane?.activeTabId) return;

        const historyTabId = `system:history:${sourcePane.activeTabId}`;
        const historyPane = paneStore.panes.find(p => p.openTabIds.includes(historyTabId));

        if (historyPane) {
            paneStore.closePane(historyPane.id);
        } else {
            const newPaneId = paneStore.splitPane(sourcePaneId);
            tabStore.openTab(historyTabId, newPaneId);
            paneStore.setActivePane(sourcePaneId);
        }
    }

    function openReaderView(sourcePaneId: string) {
        const sourcePane = paneStore.panes.find(p => p.id === sourcePaneId);
        if (!sourcePane?.activeTabId) return;

        const readerTabId = `system:reader:${sourcePane.activeTabId}`;
        tabStore.openTab(readerTabId, sourcePaneId);
    }

    return {
        toggleAIPanel,
        ensureAIPanelIsOpen,
        toggleHistoryPanel,
        openReaderView,
    };
});