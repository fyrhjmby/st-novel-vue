import { defineStore } from 'pinia';
import { computed } from 'vue';
import { usePaneStore, type EditorPane } from './modules/paneStore';
import { useTabStore } from './modules/tabStore';
import { useItemStore } from './modules/itemStore';
import { useSystemViewStore } from './modules/systemViewStore';
import { useMetadataStore } from './modules/metadataStore';
import type { TabInfo } from '@/novel/editor/types';

export { EditorPane };

export const useEditorStore = defineStore('editor-facade', () => {
    const paneStore = usePaneStore();
    const tabStore = useTabStore();
    const itemStore = useItemStore();
    const systemViewStore = useSystemViewStore();
    const metadataStore = useMetadataStore();

    const panes = computed(() => paneStore.panes);
    const activePaneId = computed(() => paneStore.activePaneId);
    const novelMetadata = computed(() => metadataStore.novelMetadata);

    const activePane = computed(() => panes.value.find(p => p.id === activePaneId.value));
    const activeTabId = computed(() => activePane.value?.activeTabId ?? null);

    function getTabsForPane(paneId: string): TabInfo[] {
        const pane = panes.value.find(p => p.id === paneId);
        if (!pane) return [];
        return pane.openTabIds.map(id => {
            const { node } = itemStore.findItemById(id);
            return node ? {
                id,
                title: node.title,
                icon: itemStore.getIconByNodeType(node.type),
                item: node
            } : null;
        }).filter((tab): tab is TabInfo => tab !== null);
    }

    function getActiveTabForPane(paneId: string): TabInfo | null {
        const pane = panes.value.find(p => p.id === paneId);
        if (!pane || !pane.activeTabId) return null;
        const tabs = getTabsForPane(paneId);
        return tabs.find(tab => tab.id === pane.activeTabId) ?? null;
    }

    const activeTab = computed(() => {
        if (!activePane.value || !activePane.value.activeTabId) return null;
        return getActiveTabForPane(activePane.value.id);
    });

    return {
        panes,
        activePaneId,
        novelMetadata,
        activePane,
        activeTabId,
        activeTab,

        setActivePane: paneStore.setActivePane,
        splitPane: paneStore.splitPane,
        closePane: paneStore.closePane,

        openTab: tabStore.openTab,
        closeTab: tabStore.closeTab,

        findItemById: itemStore.findItemById,
        updateItemContentById: itemStore.updateItemContentById,
        appendContentToItem: itemStore.appendContentToItem,

        toggleAIPanel: systemViewStore.toggleAIPanel,
        ensureAIPanelIsOpen: systemViewStore.ensureAIPanelIsOpen,
        toggleHistoryPanel: systemViewStore.toggleHistoryPanel,
        openReaderView: systemViewStore.openReaderView,

        fetchNovelData: metadataStore.fetchNovelData,
        removeTag: metadataStore.removeTag,
        addTag: metadataStore.addTag,
        saveMetadata: metadataStore.saveMetadata,

        getTabsForPane,
        getActiveTabForPane,
    };
});