// 文件: src/novel/editor/types/models.ts

// 文件: src/novel/editor/types/models.ts

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
    id:string;
    type: 'chapter';
    title: string;
    wordCount: number;
    content: string; // 章节正文 (HTML)
    status: 'planned' | 'editing' | 'completed' | 'archived';
}

/**
 * AI生成的派生内容（剧情/分析）的存储结构
 */
export interface PlotAnalysisItem {
    id: string; // 派生ID, e.g., 'plot_ch-1'
    type: '分析' | '剧情生成'; // 明确其类型
    sourceChapterId: string; // 源章节ID, e.g., 'ch-1'
    title: string; // 派生标题, e.g., '第一章 剧情'
    content: string; // 生成的内容 (HTML)
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

// =================================================================
// TreeNode: 用于所有树状视图的统一数据模型
// =================================================================

interface BaseNode {
    id: string;
    title: string;
    icon: string;
    children?: TreeNode[];
    isReadOnly?: boolean;
    isOverview?: boolean;
}

export type AnyNode = Volume | Chapter | NoteItem | PlotAnalysisItem;

// --- 根节点 ---
export interface RootNode extends BaseNode {
    type: 'root';
    children: TreeNode[];
}

// --- 目录节点 ---
export interface VolumeNode extends BaseNode {
    type: 'volume';
    originalData: Volume;
    children: ChapterNode[];
}
export interface ChapterNode extends BaseNode {
    type: 'chapter';
    originalData: Chapter;
    status?: Chapter['status'];
    children?: never;
}

// --- 设定/自定义内容节点 ---
export interface GroupNode extends BaseNode {
    type: 'group';
    children: TreeNode[];
}
export interface ItemNode extends BaseNode {
    type: `${string}_item`; // e.g., character_item, plot_item
    content: string;
    originalData?: AnyNode;
    children?: never;
}
export interface OverviewNode extends BaseNode {
    type: `${string}_overview`; // e.g., characters_overview
    content: string;
    isOverview: true;
    isReadOnly: true;
    children?: never;
}

// --- AI派生内容节点 ---
export interface DerivedVolumeNode extends BaseNode {
    type: 'plot_volume' | 'analysis_volume';
    isReadOnly: true;
    children: DerivedChapterNode[];
}

export interface DerivedChapterNode extends BaseNode {
    type: 'plot_chapter' | 'analysis_chapter';
    isReadOnly: true;
    originalData: PlotAnalysisItem;
    children?: never;
}

export type TreeNode =
    | RootNode
    | GroupNode
    | ItemNode
    | OverviewNode
    | VolumeNode
    | ChapterNode
    | DerivedVolumeNode
    | DerivedChapterNode;