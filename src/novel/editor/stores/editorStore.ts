import { defineStore } from 'pinia';
import { computed } from 'vue';
import type { EditorPane, TabInfo } from '@novel/editor/types';

// State Stores
import { usePaneStore } from '@novel/editor/stores/editor-state/paneStore';
import { useTabStore } from '@novel/editor/stores/editor-state/tabStore';
import { useItemStore } from '@novel/editor/stores/editor-state/itemStore';
import { useSystemViewStore } from '@novel/editor/stores/editor-state/systemViewStore';
import { useMetadataStore } from '@novel/editor/stores/editor-state/metadataStore';

// Data Stores & UI
import { useDirectoryStore } from './directoryStore';
import { useRelatedContentStore } from './relatedContentStore';
import { useNotesStore } from './notesStore';
import { useDerivedContentStore } from './derivedContentStore';
import { useReferenceStore } from './referenceStore';
import { useAIConfigStore } from './ai/aiConfigStore';
import { useNovelSettingsStore } from './novelSettingsStore';
import { useUIStore } from './uiStore';
import { useDerivedViewStore } from './derivedViewStore';

export { EditorPane };

const initializeEditorUI = (novelId: string) => {
    const directoryStore = useDirectoryStore();
    const metadataStore = useMetadataStore();
    const uiStore = useUIStore();
    const paneStore = usePaneStore();
    const tabStore = useTabStore();

    paneStore.initializePanes();

    if (directoryStore.directoryData.length > 0) {
        uiStore.ensureNodeIsExpanded(directoryStore.directoryData[0].id);
        const firstChapterId = directoryStore.directoryData[0]?.chapters[0]?.id;
        if (firstChapterId) {
            tabStore.openTab(firstChapterId);
        }
    }

    uiStore.ensureRelatedNodeIsExpanded('setting');
    uiStore.ensureRelatedNodeIsExpanded('plot');
    uiStore.ensureRelatedNodeIsExpanded('analysis');
    uiStore.ensureRelatedNodeIsExpanded('others');

    if (metadataStore.novelMetadata && metadataStore.novelMetadata.referenceNovelIds.length > 0) {
        const firstRefBookId = `ref-book-${metadataStore.novelMetadata.referenceNovelIds[0]}`;
        uiStore.ensureReferenceNodeIsExpanded(firstRefBookId);
    }
};

export const useEditorStore = defineStore('editor-facade', () => {
    // State Stores
    const paneStore = usePaneStore();
    const tabStore = useTabStore();
    const itemStore = useItemStore();
    const systemViewStore = useSystemViewStore();
    const metadataStore = useMetadataStore();
    const uiStore = useUIStore();
    const derivedViewStore = useDerivedViewStore();

    // Data Stores
    const directoryStore = useDirectoryStore();
    const relatedContentStore = useRelatedContentStore();
    const derivedContentStore = useDerivedContentStore();
    const notesStore = useNotesStore();
    const referenceStore = useReferenceStore();
    const novelSettingsStore = useNovelSettingsStore();

    const panes = computed(() => paneStore.panes);
    const activePaneId = computed(() => paneStore.activePaneId);
    const novelMetadata = computed(() => metadataStore.novelMetadata);
    const editingNodeId = computed(() => uiStore.editingNodeId);

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
                icon: node.icon || itemStore.getIconByNodeType(node.type),
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

    async function loadProject(novelId: string): Promise<boolean> {
        // 1. Reset all states
        metadataStore.reset();
        // You might need to add reset functions to other stores if they cache data

        try {
            console.log(`[EditorStore] Coordinating load for novel: ${novelId}`);

            // 2. Fetch metadata first, as other fetches might depend on it
            await metadataStore.fetchNovelData(novelId);

            const referenceIds = metadataStore.novelMetadata?.referenceNovelIds || [];

            // 3. Fetch all main content data in parallel
            await Promise.all([
                directoryStore.fetchDirectory(novelId),
                relatedContentStore.fetchRelatedContent(novelId),
                derivedContentStore.fetchDerivedContent(novelId),
                notesStore.fetchNotes(novelId),
                useAIConfigStore().initializeProviders(),
                referenceStore.loadReferences(referenceIds)
            ]);

            // 4. Load dependent data
            await novelSettingsStore.loadSettingsData();

            // 5. Initialize UI state now that all data is loaded
            initializeEditorUI(novelId);

            return true;
        } catch (error) {
            console.error(`[EditorStore] Failed to load project ${novelId}:`, error);
            metadataStore.reset(); // Ensure clean state on failure
            return false;
        }
    }

    function splitPane(sourcePaneId: string) {
        const sourcePane = paneStore.panes.find(p => p.id === sourcePaneId);
        if (!sourcePane) {
            console.warn(`splitPane failed: source pane with id ${sourcePaneId} not found.`);
            return;
        }
        const newPaneId = paneStore.splitPane(sourcePaneId);
        if (sourcePane.activeTabId) {
            tabStore.openTab(sourcePane.activeTabId, newPaneId);
        }
    }

    function updateItemContentById(id: string, content: string) {
        itemStore.updateItemContentById(id, content);
        const { node } = itemStore.findItemById(id);
        if (node) {
            (node as any)._lastModified = Date.now();
        }
    }

    function appendContentToItem(itemId: string, content: string, auto: boolean) {
        itemStore.appendContentToItem(itemId, content, auto);
        const { node } = itemStore.findItemById(itemId);
        if (node) {
            (node as any)._lastModified = Date.now();
        }
    }

    function openDerivedItemView(type: 'plot' | 'analysis') {
        const sourceItem = activeTab.value?.item;
        if (!sourceItem || (sourceItem.type !== 'chapter' && sourceItem.type !== 'volume')) return;

        const viewId = `system:derived_view:${type}:${sourceItem.id}`;

        const existingPane = panes.value.find(p => p.openTabIds.includes(viewId));
        if (existingPane) {
            paneStore.setActivePane(existingPane.id);
            return;
        }

        derivedViewStore.loadItems(sourceItem, type);

        const sourcePaneId = activePaneId.value;
        if (!sourcePaneId) return;

        const newPaneId = paneStore.splitPane(sourcePaneId);
        if (newPaneId) {
            tabStore.openTab(viewId, newPaneId);
        }
    }

    function openPlotForActiveItem() {
        openDerivedItemView('plot');
    }

    function openAnalysisForActiveItem() {
        openDerivedItemView('analysis');
    }

    // Explicit actions that delegate to other stores
    const openTab = (itemId: string, targetPaneId?: string) => tabStore.openTab(itemId, targetPaneId);
    const closeTab = (itemId: string, paneId?: string) => tabStore.closeTab(itemId, paneId);
    const toggleAIPanel = (sourcePaneId: string) => systemViewStore.toggleAIPanel(sourcePaneId);
    const ensureAIPanelIsOpen = (sourcePaneId: string) => systemViewStore.ensureAIPanelIsOpen(sourcePaneId);
    const toggleHistoryPanel = (sourcePaneId: string) => systemViewStore.toggleHistoryPanel(sourcePaneId);
    const openReaderView = () => systemViewStore.openReaderView();

    return {
        panes,
        activePaneId,
        novelMetadata,
        editingNodeId,
        activePane,
        activeTabId,
        activeTab,
        getTabsForPane,
        getActiveTabForPane,
        splitPane,
        updateItemContentById,
        appendContentToItem,
        openPlotForActiveItem,
        openAnalysisForActiveItem,
        // Delegated actions
        setEditingNodeId: uiStore.setEditingNodeId,
        setActivePane: paneStore.setActivePane,
        closePane: paneStore.closePane,
        openTab,
        closeTab,
        findItemById: itemStore.findItemById,
        toggleAIPanel,
        ensureAIPanelIsOpen,
        toggleHistoryPanel,
        openReaderView,
        loadProject,
    };
});