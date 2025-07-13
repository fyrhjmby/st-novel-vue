// 文件: src/novel/editor/types/types.ts

/**
 * 卷（目录的一级）
 */
export interface Volume {
    id: string;
    type: 'volume';
    title: string;
    content: string; // 卷的大纲或简介
    chapters: Chapter[];
}

/**
 * 章节（目录的二级）
 */
export interface Chapter {
    id: string;
    type: 'chapter';
    title: string;
    wordCount: number;
    content: string; // 章节正文 (HTML)
    status: 'planned' | 'editing' | 'completed' | 'archived';
}

/**
 * 代表一个角色
 */
export interface NovelCharacter {
    id: string;
    name: string;
    avatar: string;
    identity: string;
    gender?: string;
    age?: number;
    faction?: string;
    summary: string; // AI参考的主要描述
    notes?: string; // 作者的私人笔记
    status?: 'editing' | 'completed' | 'draft';
}


/**
 * 相关内容树节点
 * 用于构建“设定”、“剧情”、“分析”等复杂的树状结构
 */
export interface RelatedTree {
    id: string;
    type: string; // 例如: 'root', 'group', 'character_item', 'plot_chapter'
    title: string;
    icon: string;
    content?: string; // 可编辑的内容 (HTML)
    children?: RelatedTree[];
    originalData?: any; // 可选，用于存储原始关联数据
}

/**
 * 笔记条目
 */
export interface NoteItem {
    id: string;
    type: 'note';
    title: string;
    content: string; // 笔记内容 (HTML)
    timestamp: string; // e.g., "今天 14:32"
}

/**
 * AI 任务状态
 */
export type AITaskStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'applied';

/**
 * AI 任务对象
 */
export interface AITask {
    id: string;
    title: string;
    type: '润色' | '续写' | '分析';
    targetItemId: string; // 任务目标文档的ID
    status: AITaskStatus;
    originalContent: string;
    generatedContent: string;
    error?: string;
    createdAt: Date;
}

/**
 * 上下文预设或已选择的条目
 */
export interface ContextItem {
    id: string;
    group: string;
    title: string;
    description: string;
    content: string;
    wordCount?: number;
}

/**
 * 编辑器UI状态
 * 用于定义 editorStore 中的 uiState
 */
export interface EditorUIState {
    expandedNodeIds: Set<string>;
    expandedRelatedNodeIds: Set<string>;
    needsPreview: boolean;
    customContextContent: string;
    dynamicContextSettings: {
        prevChapters: number;
        nextChapters: number;
        prevVolumes: number;
        nextVolumes: number;
    };
    isRagEnabled: boolean;
    selectedContextItems: ContextItem[];
}

/**
 * 小说标签
 */
export interface NovelTag {
    text: string;
    class: string;
}

/**
 * 小说元数据
 */
export interface NovelMetadata {
    id: string;
    title: string;
    description: string;
    cover: string;
    tags: NovelTag[];
    status: '连载中' | '已完结' | '暂停更新';
}


/**
 * 系统视图信息，用于在内容区打开非文件类标签页
 */
export interface SystemViewInfo {
    id: string; // e.g., 'system:search'
    type: 'system';
    component: 'SearchView' | 'AIChatView' | 'AITaskPanel' | 'EditorSettings' | 'ContextSettings' | 'TaskSettings' | 'AIConfigSettings' | 'NovelSettings' | 'HistoryPanel' | 'ReaderPanel';
    title: string;
    icon: string;
    content?: null; // 系统视图没有 content 属性
    targetItemId?: string; // For dynamic views like history
}

/**
 * 任意可被编辑器打开的条目
 */
export type EditorItem = Volume | Chapter | RelatedTree | NoteItem | SystemViewInfo;

/**
 * 搜索结果条目
 */
export interface SearchResult {
    id: string;
    title: string;
    icon: string;
    item: EditorItem;
    matches: { context: string }[];
}

/**
 * 标签页信息
 */
export interface TabInfo {
    id: string;
    title: string;
    icon: string;
    item: EditorItem;
}