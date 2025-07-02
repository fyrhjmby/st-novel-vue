import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// --- 类型定义 ---
export interface Chapter {
    id: string;
    type: 'chapter';
    title: string;
    wordCount: number;
    content: string;
    status: 'completed' | 'editing' | 'planned';
}

export interface Volume {
    id: string;
    type: 'volume';
    title:string;
    content: string;
    chapters: Chapter[];
}

export interface RelatedItem {
    id: string;
    type: 'character_profile' | 'worldview_doc';
    title: string;
    icon: string;
    content: string;
}

export interface RelatedItemGroup {
    type: string;
    title: string;
    icon: string;
    color: string;
    items: RelatedItem[];
}

export interface NoteItem {
    id: string;
    type: 'note';
    title: string;
    timestamp: string;
    content: string;
}

type ActiveItem = Volume | Chapter | RelatedItem | NoteItem | null;

interface UIState {
    activeInternalTab: 'directory' | 'related' | 'notes';
    expandedNodeIds: Set<string>;
}

// --- Store 定义 ---
export const useEditorStore = defineStore('editor', () => {
    // --- State ---
    const directoryData = ref<Volume[]>([]);
    const relatedData = ref<RelatedItemGroup[]>([]); // [新增] 相关内容数据
    const noteData = ref<NoteItem[]>([]); // [新增] 笔记数据
    const activeItemId = ref<string | null>(null);
    const uiState = ref<UIState>({
        activeInternalTab: 'directory',
        expandedNodeIds: new Set(),
    });

    // --- Getters ---
    const activeItem = computed((): ActiveItem => {
        if (!activeItemId.value) return null;

        // 在所有数据源中查找激活项
        for (const volume of directoryData.value) {
            if (volume.id === activeItemId.value) return volume;
            for (const chapter of volume.chapters) {
                if (chapter.id === activeItemId.value) return chapter;
            }
        }
        for (const group of relatedData.value) {
            for (const item of group.items) {
                if(item.id === activeItemId.value) return item;
            }
        }
        for (const note of noteData.value) {
            if(note.id === activeItemId.value) return note;
        }
        return null;
    });

    // --- Actions ---
    const updateItemContentById = (id: string, content: string) => {
        // 简化版，实际项目中可能需要更复杂的查找逻辑
        const item = activeItem.value;
        if (item && item.id === id) {
            item.content = content;
            if (item.type === 'chapter') {
                item.wordCount = content.replace(/<[^>]+>/g, '').length;
            }
        }
    }

    const fetchNovelData = (novelId: string) => {
        console.log(`Fetching data for novel: ${novelId}`);

        // 目录数据
        directoryData.value = [
            { id: 'vol-1', type: 'volume', title: '第一卷：星尘之始', content: '<h1>第一卷大纲</h1>...', chapters: [
                    { id: 'ch-4', type: 'chapter', title: '第四章: 跃迁点', wordCount: 2415, content: '<h1>第四章: 跃迁点</h1><p>控制台的警报声将卡尔文从浅眠中惊醒...</p>', status: 'editing' },
                ]},
        ];

        relatedData.value = [
            { type: 'character', title: '角色', icon: 'fa-solid fa-users text-teal-500', color: 'teal', items: [
                    { id: 'char-calvin', type: 'character_profile', title: '卡尔文·里德', icon: 'fa-regular fa-user', content: '<h2>卡尔文·里德</h2><p><strong>年龄：</strong>35</p>...' },
                    { id: 'char-aila', type: 'character_profile', title: '艾拉 (AILA)', icon: 'fa-regular fa-user', content: '<h2>艾拉 (AILA)</h2><p>第五代通用人工智能...</p>' },
                ]},
            { type: 'worldview', title: '世界观', icon: 'fa-solid fa-earth-americas text-sky-500', color: 'sky', items: [
                    { id: 'world-overview', type: 'worldview_doc', title: '世界观总览', icon: 'fa-regular fa-file-lines', content: '<h3>时间背景</h3><p>公元2157年...</p>' },
                ]}
        ];

        noteData.value = [
            { id: 'note-1', type: 'note', title: '第四章情感转折点设计', timestamp: '今天 14:32', content: '卡尔文对"回家"的复杂情感需要更细腻的描写。目前的写法“心跳漏了一拍”有些 cliché...'},
            { id: 'note-2', type: 'note', title: '跃迁点物理描述', timestamp: '今天 11:20', content: '查阅了相关资料，跃迁点可以描述为时空扭曲形成的漩涡状结构...'}
        ];

        activeItemId.value = 'ch-4';
        uiState.value.expandedNodeIds.add('vol-1');
    };

    const setActiveItem = (id: string) => {
        activeItemId.value = id;
    };

    const toggleNodeExpansion = (nodeId: string) => {
        if (uiState.value.expandedNodeIds.has(nodeId)) {
            uiState.value.expandedNodeIds.delete(nodeId);
        } else {
            uiState.value.expandedNodeIds.add(nodeId);
        }
    };

    const setActiveInternalTab = (tabId: 'directory' | 'related' | 'notes') => {
        uiState.value.activeInternalTab = tabId;
    }

    return {
        directoryData,
        relatedData,
        noteData,
        activeItemId,
        uiState,
        activeItem,
        fetchNovelData,
        setActiveItem,
        updateItemContentById,
        toggleNodeExpansion,
        setActiveInternalTab,
    }
})