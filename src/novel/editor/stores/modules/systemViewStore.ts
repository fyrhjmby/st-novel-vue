import { defineStore } from 'pinia';
import { usePaneStore } from './paneStore';
import { useTabStore } from './tabStore';
import { useUIStore } from '../uiStore';
import { useEditorStore } from '../editorStore';

export const useSystemViewStore = defineStore('editor-system-view', () => {
    const paneStore = usePaneStore();
    const tabStore = useTabStore();
    const uiStore = useUIStore();

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
        const editorStore = useEditorStore();
        const activeItem = editorStore.activeTab?.item;
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