import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 从统一入口导入所有需要的类型
import type { Volume, Chapter, RelatedTree, NoteItem } from '@/novel/editor/types'

// 导入所有需要协调的 store
import { useDirectoryStore } from './directoryStore'
import { useRelatedContentStore } from './relatedContentStore'
import { useNotesStore } from './notesStore'

type EditorItem = Volume | Chapter | RelatedTree | NoteItem;

interface UIState {
    activeInternalTab: 'directory' | 'related' | 'notes';
    expandedNodeIds: Set<string>;
    expandedRelatedNodeIds: Set<string>;
    needsPreview: boolean;
}

export const useEditorStore = defineStore('editor', () => {
    // --- State: 只保留UI和全局状态 ---
    const activeItemId = ref<string | null>(null);
    const editingNodeId = ref<string | null>(null);
    const uiState = ref<UIState>({
        activeInternalTab: 'directory',
        expandedNodeIds: new Set(),
        expandedRelatedNodeIds: new Set(),
        needsPreview: false,
    });

    // --- Getters & Computed ---

    /**
     * 根据 activeItemId 获取当前激活的完整条目对象。
     * 它通过协调其他 store 来找到数据。
     */
    const activeItem = computed((): EditorItem | null => {
        if (!activeItemId.value) return null;
        return findItemById(activeItemId.value)?.node ?? null;
    });

    // --- Actions: 核心协调逻辑 ---

    /**
     * 在所有数据源中根据ID查找条目。
     * 这是协调者角色的核心实现。
     * @param id - 要查找的条目ID。
     */
    const findItemById = (id: string): { node: EditorItem | null; source: 'directory' | 'related' | 'notes' | null } => {
        const directoryStore = useDirectoryStore();
        const relatedContentStore = useRelatedContentStore();
        const notesStore = useNotesStore();

        let result = directoryStore.findNodeById(id);
        if (result?.node) return { node: result.node, source: 'directory' };

        result = relatedContentStore.findNodeById(id);
        if (result?.node) return { node: result.node, source: 'related' };

        const note = notesStore.findNoteById(id);
        if (note) return { node: note, source: 'notes' };

        return { node: null, source: null };
    };

    /**
     * 根据ID更新任何类型条目的内容。
     * 它将任务委托给相应的 store。
     * @param id - 目标条目ID。
     * @param content - 新的内容。
     */
    const updateItemContentById = (id: string, content: string) => {
        const { node, source } = findItemById(id);
        if (!node) return;

        switch (source) {
            case 'directory':
                useDirectoryStore().updateChapterContent(id, content);
                break;
            case 'related':
                useRelatedContentStore().updateNodeContent(id, content);
                break;
            case 'notes':
                useNotesStore().updateNoteContent(id, content);
                break;
        }
    };

    /**
     * 向指定条目追加内容。
     * 此实现修复了之前版本中内容重复追加的问题。
     * @param itemId - 目标条目ID。
     * @param contentToAppend - 要追加的内容。
     * @param isAutoApplied - 是否为AI自动应用。
     */
    const appendContentToItem = (itemId: string, contentToAppend: string, isAutoApplied: boolean) => {
        const { node, source } = findItemById(itemId);
        if (!node) return;

        // 只对有内容属性的章节和相关条目进行操作
        if (source === 'directory' && node.type === 'chapter') {
            useDirectoryStore().appendChapterContent(itemId, contentToAppend, isAutoApplied);
        } else if (source === 'related' && 'content' in node) {
            // Related content append logic can be added to relatedContentStore if needed
        }
    };

    /**
     * 初始化小说数据。
     * 它获取原始数据，然后分发给各个专门的 store 进行处理。
     * @param novelId - 小说ID。
     */
    const fetchNovelData = (novelId: string) => {
        console.log(`Fetching data for novel: ${novelId}`);

        // Mock Data
        const mockDirectoryData: Volume[] = [
            { id: 'vol-1', type: 'volume', title: '第一卷：星尘之始', content: '<h1>第一卷：星尘之始</h1><p>本卷大纲...</p>', chapters: [
                    { id: 'ch-1', type: 'chapter', title: '第一章：深空孤影', wordCount: 3102, content: '<h1>第一章：深空孤影</h1><p>内容...</p>', status: 'completed' },
                    { id: 'ch-2', type: 'chapter', title: '第二章：异常信号', wordCount: 2845, content: '<h1>第二章：异常信号</h1><p>内容...</p>', status: 'completed' },
                    { id: 'ch-3', type: 'chapter', title: '第三章：AI的低语', wordCount: 3500, content: '<h1>第三章：AI的低语</h1><p>内容...</p>', status: 'editing' },
                    { id: 'ch-4', type: 'chapter', title: '第四章: 跃迁点', wordCount: 2415, content: '<h1>第四章: 跃迁点</h1><p>内容...</p>', status: 'editing' },
                ]},
            { id: 'vol-2', type: 'volume', title: '第二卷：遗忘的航线', content: '<h1>第二卷：遗忘的航线</h1><p>本卷大纲...</p>', chapters: [
                    { id: 'ch-5', type: 'chapter', title: '第五章：时空涟漪', wordCount: 0, content: '<h1>第五章：时空涟漪</h1>', status: 'planned' },
                ]},
        ];
        const mockSettingsData: RelatedTree[] = [
            {
                id: 'settings', title: '设定', type: 'root', icon: 'fa-solid fa-book-journal-whills',
                children: [
                    { id: 'characters', title: '角色', type: 'group', icon: 'fa-solid fa-users text-teal-500', children: [
                            { id: 'char-calvin', title: '卡尔文·里德', type: 'character_item', icon: 'fa-regular fa-user', content: '<h1>卡尔文·里德</h1><p>内容...</p>' },
                            { id: 'char-aila', title: '艾拉 (AILA)', type: 'character_item', icon: 'fa-regular fa-user', content: '<h1>艾拉 (AILA)</h1><p>内容...</p>' },
                        ]
                    },
                    { id: 'locations', title: '地点', type: 'group', icon: 'fa-solid fa-map-location-dot text-green-500', children: [] },
                    { id: 'items', title: '物品', type: 'group', icon: 'fa-solid fa-box-archive text-amber-600', children: [] },
                    { id: 'worldview', title: '世界观', type: 'group', icon: 'fa-solid fa-earth-americas text-sky-500', children: [
                            { id: 'world-overview', title: '世界观总览', type: 'worldview_item', icon: 'fa-solid fa-book-atlas', content: '<h1>世界观总览</h1><p>内容...</p>' },
                        ]
                    }
                ]
            }
        ];
        const mockPlotData: RelatedTree[] = [
            { id: 'custom-plot-1', title: '自定义剧情线索1', type: 'plot_item', icon: 'fa-solid fa-lightbulb text-rose-500', content: '<h1>自定义剧情线索1</h1>' }
        ];
        const mockAnalysisData: RelatedTree[] = [];
        const mockNoteData: NoteItem[] = [
            { id: 'note-1', type: 'note', title: '第四章情感转折点设计', timestamp: '今天 14:32', content: '卡尔文对"回家"的复杂情感...'},
        ];

        // 分发数据到各个 store
        useDirectoryStore().fetchDirectoryData(mockDirectoryData);
        useRelatedContentStore().fetchRelatedData(mockSettingsData, mockPlotData, mockAnalysisData);
        useNotesStore().fetchNotes(mockNoteData);

        // 设置初始UI状态
        activeItemId.value = 'ch-4';
        uiState.value.expandedNodeIds.add('vol-1');
        uiState.value.expandedNodeIds.add('vol-2');
        uiState.value.expandedRelatedNodeIds.add('settings');
        uiState.value.expandedRelatedNodeIds.add('characters');
        uiState.value.expandedRelatedNodeIds.add('locations');
        uiState.value.expandedRelatedNodeIds.add('items');
        uiState.value.expandedRelatedNodeIds.add('worldview');
        uiState.value.expandedRelatedNodeIds.add('plot');
        uiState.value.expandedRelatedNodeIds.add('analysis');
    };


    // --- UI State Actions ---

    const setActiveItem = (id: string | null) => {
        activeItemId.value = id;
    };

    const setEditingNodeId = (id: string | null) => {
        editingNodeId.value = id;
    };

    const toggleNodeExpansion = (nodeId: string) => {
        if (uiState.value.expandedNodeIds.has(nodeId)) {
            uiState.value.expandedNodeIds.delete(nodeId);
        } else {
            uiState.value.expandedNodeIds.add(nodeId);
        }
    };

    const toggleRelatedNodeExpansion = (nodeId: string) => {
        if (uiState.value.expandedRelatedNodeIds.has(nodeId)) {
            uiState.value.expandedRelatedNodeIds.delete(nodeId);
        } else {
            uiState.value.expandedRelatedNodeIds.add(nodeId);
        }
    };

    const setActiveInternalTab = (tabId: 'directory' | 'related' | 'notes') => {
        uiState.value.activeInternalTab = tabId;
    };

    return {
        // State
        activeItemId,
        editingNodeId,
        uiState,
        // Getters
        activeItem,
        // Actions
        fetchNovelData,
        setActiveItem,
        setEditingNodeId,
        updateItemContentById,
        appendContentToItem,
        toggleNodeExpansion,
        toggleRelatedNodeExpansion,
        setActiveInternalTab,
        findItemById,
    };
});