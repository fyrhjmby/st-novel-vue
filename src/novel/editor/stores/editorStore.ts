import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { EditorItem, TabInfo, EditorPane, SystemViewInfo, NovelMetadata } from '@/novel/editor/types';
import { useDirectoryStore } from './directoryStore';
import { useRelatedContentStore } from './relatedContentStore';
import { useNotesStore } from './notesStore';
import { useUIStore } from './uiStore';
import { getIconByNodeType } from '@/novel/editor/utils/iconUtils';
import {
    mockDirectoryData,
    mockSettingsData,
    mockPlotCustomData,
    mockAnalysisCustomData,
    mockNoteData,
    mockNovelMetadata
} from '@/novel/editor/data';

export const SYSTEM_VIEWS: Record<string, SystemViewInfo> = {
    'system:search': { id: 'system:search', type: 'system', component: 'SearchView', title: '搜索', icon: 'fa-solid fa-magnifying-glass' },
    'system:ai_chat': { id: 'system:ai_chat', type: 'system', component: 'AIChatView', title: 'AI 聊天', icon: 'fa-solid fa-wand-magic-sparkles' },
    'system:ai_tasks': { id: 'system:ai_tasks', type: 'system', component: 'AITaskPanel', title: 'AI 任务', icon: 'fa-solid fa-list-check' },
    'system:settings_editor': { id: 'system:settings_editor', type: 'system', component: 'EditorSettings', title: '编辑器设置', icon: 'fa-solid fa-pencil' },
    'system:settings_context': { id: 'system:settings_context', type: 'system', component: 'ContextSettings', title: '上下文管理', icon: 'fa-solid fa-book-open-reader' },
    'system:settings_tasks': { id: 'system:settings_tasks', type: 'system', component: 'TaskSettings', title: '任务管理', icon: 'fa-solid fa-list-check' },
    'system:settings_ai_config': { id: 'system:settings_ai_config', type: 'system', component: 'AIConfigSettings', title: 'AI 任务配置', icon: 'fa-solid fa-microchip' },
    'system:settings_novel': { id: 'system:settings_novel', type: 'system', component: 'NovelSettings', title: '小说设置', icon: 'fa-solid fa-swatchbook' }
};

export interface EditorPane {
    id: string;
    openTabIds: string[];
    activeTabId: string | null;
}

export const useEditorStore = defineStore('editor', () => {
    const panes = ref<EditorPane[]>([]);
    const activePaneId = ref<string | null>(null);
    const novelMetadata = ref<NovelMetadata | null>(null);

    const activePane = computed(() => panes.value.find(p => p.id === activePaneId.value));
    const activeTabId = computed(() => activePane.value?.activeTabId ?? null);
    const activeTab = computed((): TabInfo | null => {
        if (!activePane.value || !activePane.value.activeTabId) return null;
        return getActiveTabForPane(activePane.value.id);
    });

    const findItemById = (id: string): { node: EditorItem | null; source: 'directory' | 'related' | 'notes' | 'system' | null } => {
        if (id.startsWith('system:')) {
            const systemView = SYSTEM_VIEWS[id];
            return systemView ? { node: systemView, source: 'system' } : { node: null, source: null };
        }

        const directoryStore = useDirectoryStore();
        let result = directoryStore.findNodeById(id);
        if (result?.node) return { node: result.node, source: 'directory' };

        const relatedContentStore = useRelatedContentStore();
        result = relatedContentStore.findNodeById(id);
        if (result?.node) return { node: result.node, source: 'related' };

        const notesStore = useNotesStore();
        const note = notesStore.findNoteById(id);
        if (note) return { node: note, source: 'notes' };

        return { node: null, source: null };
    };

    const getTabsForPane = (paneId: string): TabInfo[] => {
        const pane = panes.value.find(p => p.id === paneId);
        if (!pane) return [];
        return pane.openTabIds.map(id => {
            const { node } = findItemById(id);
            if (!node) return null;
            return {
                id: id,
                title: node.title,
                icon: node.type === 'system' ? node.icon : getIconByNodeType(node.type),
                item: node
            };
        }).filter((tab): tab is TabInfo => tab !== null);
    };

    const getActiveTabForPane = (paneId: string): TabInfo | null => {
        const pane = panes.value.find(p => p.id === paneId);
        if (!pane || !pane.activeTabId) return null;
        const tabs = getTabsForPane(paneId);
        return tabs.find(tab => tab.id === pane.activeTabId) ?? null;
    };

    const setActivePane = (paneId: string) => {
        if (panes.value.some(p => p.id === paneId)) {
            activePaneId.value = paneId;
        }
    };

    const openTab = (itemId: string, targetPaneId?: string) => {
        const paneId = targetPaneId || activePaneId.value;
        if (!paneId) return;

        let pane = panes.value.find(p => p.id === paneId);
        if (!pane) return;

        const { node } = findItemById(itemId);
        if (!node) return;

        if (node.type !== 'system' && !('content' in node && node.content !== undefined)) {
            const uiStore = useUIStore();
            if (node?.type === 'volume' || node?.type === 'group') {
                uiStore.toggleNodeExpansion(itemId);
            } else {
                uiStore.toggleRelatedNodeExpansion(itemId);
            }
            return;
        }

        const existingTabPane = panes.value.find(p => p.openTabIds.includes(itemId));
        if (existingTabPane) {
            existingTabPane.activeTabId = itemId;
            setActivePane(existingTabPane.id);
            return;
        }

        if (!pane.openTabIds.includes(itemId)) {
            pane.openTabIds.push(itemId);
        }
        pane.activeTabId = itemId;
        setActivePane(paneId);
    };

    const closePane = (paneId: string) => {
        if (panes.value.length <= 1) return;
        const paneIndex = panes.value.findIndex(p => p.id === paneId);
        if (paneIndex === -1) return;
        panes.value.splice(paneIndex, 1);
        if (activePaneId.value === paneId) {
            const newActiveIndex = Math.max(0, paneIndex - 1);
            activePaneId.value = panes.value[newActiveIndex]?.id || null;
        }
    };

    const closeTab = (itemId: string, paneId?: string) => {
        const targetPaneId = paneId || panes.value.find(p => p.openTabIds.includes(itemId))?.id;
        if (!targetPaneId) return;
        const pane = panes.value.find(p => p.id === targetPaneId);
        if (!pane) return;
        const index = pane.openTabIds.indexOf(itemId);
        if (index === -1) return;
        pane.openTabIds.splice(index, 1);
        if (pane.activeTabId === itemId) {
            pane.activeTabId = pane.openTabIds.length > 0 ? pane.openTabIds[Math.max(0, index - 1)] : null;
        }
        if (pane.openTabIds.length === 0 && panes.value.length > 1) {
            closePane(pane.id);
        }
    };

    const splitPane = (sourcePaneId: string): string | null => {
        const sourcePaneIndex = panes.value.findIndex(p => p.id === sourcePaneId);
        if (sourcePaneIndex === -1) return null;

        const newPaneId = `pane-${Date.now()}`;
        const newPane: EditorPane = { id: newPaneId, openTabIds: [], activeTabId: null };

        panes.value.splice(sourcePaneIndex + 1, 0, newPane);
        return newPaneId;
    };

    const toggleAIPanel = (sourcePaneId: string) => {
        const aiTaskPane = panes.value.find(p => p.openTabIds.includes('system:ai_tasks'));
        if (aiTaskPane) {
            closePane(aiTaskPane.id);
        } else {
            const newPaneId = splitPane(sourcePaneId);
            if (newPaneId) {
                openTab('system:ai_tasks', newPaneId);
                setActivePane(sourcePaneId);
            }
        }
    };

    const updateItemContentById = (id: string, content: string) => {
        const { node, source } = findItemById(id);
        if (!node) return;
        switch (source) {
            case 'directory': useDirectoryStore().updateChapterContent(id, content); break;
            case 'related': useRelatedContentStore().updateNodeContent(id, content); break;
            case 'notes': useNotesStore().updateNoteContent(id, content); break;
        }
    };

    const appendContentToItem = (itemId: string, contentToAppend: string, isAutoApplied: boolean) => {
        const { source } = findItemById(itemId);
        if (source === 'directory') {
            useDirectoryStore().appendChapterContent(itemId, contentToAppend, isAutoApplied);
        } else if (source === 'related') {
            useRelatedContentStore().appendNodeContent(itemId, contentToAppend, isAutoApplied);
        } else if (source === 'notes') {
            useNotesStore().appendNoteContent(itemId, contentToAppend, isAutoApplied);
        }
    };

    const fetchNovelData = (novelId: string) => {
        console.log(`Fetching data for novel: ${novelId}`);
        const directoryStore = useDirectoryStore();
        const relatedContentStore = useRelatedContentStore();
        const notesStore = useNotesStore();
        const uiStore = useUIStore();

        directoryStore.fetchDirectoryData(mockDirectoryData);
        relatedContentStore.fetchRelatedData(mockSettingsData, mockPlotCustomData, mockAnalysisCustomData);
        notesStore.fetchNotes(mockNoteData);
        novelMetadata.value = JSON.parse(JSON.stringify(mockNovelMetadata));

        if (panes.value.length === 0) {
            const initialPaneId = `pane-${Date.now()}`;
            panes.value.push({ id: initialPaneId, openTabIds: [], activeTabId: null });
            activePaneId.value = initialPaneId;
            openTab('ch-3');
        }

        uiStore.uiState.expandedNodeIds.add('vol-1');
        uiStore.uiState.expandedRelatedNodeIds.add('settings');
        uiStore.uiState.expandedRelatedNodeIds.add('characters');
    };

    const removeTag = (tagIndex: number) => {
        if (novelMetadata.value) novelMetadata.value.tags.splice(tagIndex, 1);
    };

    const addTag = () => {
        if (!novelMetadata.value) return;
        const newTagText = prompt("输入新标签:");
        if (newTagText?.trim()) {
            novelMetadata.value.tags.push({ text: newTagText, class: 'bg-gray-100 text-gray-800' });
        }
    };

    const saveMetadata = () => {
        if (!novelMetadata.value) return;
        console.log('Saving metadata:', JSON.parse(JSON.stringify(novelMetadata.value)));
        alert('小说设置已保存！');
    };

    return {
        panes, activePaneId, activePane, activeTabId, activeTab, novelMetadata,
        fetchNovelData, findItemById,
        openTab, closeTab, splitPane, closePane, toggleAIPanel,
        setActivePane,
        getTabsForPane, getActiveTabForPane,
        updateItemContentById, appendContentToItem,
        removeTag, addTag, saveMetadata
    };
});