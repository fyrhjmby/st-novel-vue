import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useDirectoryStore } from './directoryStore';
import { useRelatedContentStore } from './relatedContentStore';
import { useNotesStore } from './notesStore';
import { useUIStore } from './uiStore';
import { usePaneStore } from '@core/panes/stores/paneStore';
import { tabManagementService } from '@core/tabs/service/TabManagementService';
import { paneManagementService } from '@core/panes/service/PaneManagementService';
import { mockNovelMetadata, mockDirectoryData, mockSettingsData, mockPlotCustomData, mockAnalysisCustomData, mockNoteData } from '../data';
import type { NovelMetadata } from '../types';

type SidebarPanelId = 'directory' | 'related' | 'notes';

export const useEditorStore = defineStore('novel-editor', () => {
    const directoryStore = useDirectoryStore();
    const paneStore = usePaneStore();
    const uiStore = useUIStore();

    // --- Workspace State ---
    const isSidebarVisible = ref(true);
    const activeSidebarPanelId = ref<SidebarPanelId>('directory');
    const novelMetadata = ref<NovelMetadata | null>(null);

    // --- Computed Properties for UI ---
    const activePaneId = computed(() => paneStore.activePaneId);
    const activeTabId = computed(() => paneStore.activePane?.activeTabId ?? null);

    const wordCount = computed(() => {
        if (!activeTabId.value) return 0;
        const item = directoryStore.findNodeById(activeTabId.value)?.node;
        if (item && item.type === 'chapter') {
            return item.wordCount;
        }
        return 0;
    });

    const readingTime = computed(() => {
        if (!wordCount.value) return 0;
        const time = Math.ceil(wordCount.value / 400);
        return time > 0 ? time : 1;
    });

    // --- Actions ---
    function initialize() {
        directoryStore.fetchDirectoryData(mockDirectoryData);
        useRelatedContentStore().fetchRelatedData(mockSettingsData, mockPlotCustomData, mockAnalysisCustomData);
        useNotesStore().fetchNotes(mockNoteData);
        novelMetadata.value = JSON.parse(JSON.stringify(mockNovelMetadata));

        // Restore default expanded state
        uiStore.uiState.expandedNodeIds.clear();
        uiStore.uiState.expandedRelatedNodeIds.clear();
        uiStore.toggleNodeExpansion('vol-1');
        uiStore.toggleRelatedNodeExpansion('settings');
        uiStore.toggleRelatedNodeExpansion('characters');

        // Open a default tab
        tabManagementService.openTab('ch-3');
    }

    function toggleSidebar() {
        isSidebarVisible.value = !isSidebarVisible.value;
    }

    function setActiveSidebarPanel(panelId: SidebarPanelId) {
        activeSidebarPanelId.value = panelId;
        if (!isSidebarVisible.value) {
            isSidebarVisible.value = true;
        }
    }

    function ensureAIPanelIsOpen() {
        const activePane = paneStore.activePane;
        if (!activePane) return;

        const allTabsInAllPanes = paneStore.root?.type === 'split'
            ? paneStore.root.children.flatMap(c => c.type === 'leaf' ? c.tabIds : [])
            : (paneStore.root?.tabIds ?? []);

        if (!allTabsInAllPanes.includes('system:ai_tasks')) {
            const newPaneId = paneManagementService.splitPane(activePane.id, 'horizontal');
            if(newPaneId) {
                tabManagementService.openTab('system:ai_tasks', newPaneId);
                paneManagementService.setActivePane(activePane.id); // Set focus back
            }
        }
    }

    function openHistoryPanelForActiveTab() {
        if (activeTabId.value) {
            tabManagementService.openTab(`system:history:${activeTabId.value}`);
        }
    }

    function openReaderViewForActiveTab() {
        if (activeTabId.value) {
            tabManagementService.openTab(`system:reader:${activeTabId.value}`);
        }
    }

    // --- Metadata Actions ---
    function removeTag(tagIndex: number) {
        if (novelMetadata.value) {
            novelMetadata.value.tags.splice(tagIndex, 1);
        }
    }

    function addTag() {
        if (!novelMetadata.value) return;
        const newTagText = prompt("输入新标签:");
        if (newTagText?.trim()) {
            novelMetadata.value.tags.push({ text: newTagText, class: 'bg-gray-100 text-gray-800' });
        }
    }

    function saveMetadata() {
        if (!novelMetadata.value) return;
        console.log('Saving metadata:', JSON.parse(JSON.stringify(novelMetadata.value)));
        alert('小说设置已保存！');
    }


    return {
        isSidebarVisible,
        activeSidebarPanelId,
        activePaneId,
        activeTabId,
        novelMetadata,
        wordCount,
        readingTime,
        initialize,
        toggleSidebar,
        setActiveSidebarPanel,
        ensureAIPanelIsOpen,
        openHistoryPanelForActiveTab,
        openReaderViewForActiveTab,
        removeTag,
        addTag,
        saveMetadata,
    };
});