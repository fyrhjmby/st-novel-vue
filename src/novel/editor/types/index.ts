
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
 * 编辑器UI状态
 * 用于定义 editorStore 中的 uiState
 */
export interface EditorUIState {
    activeInternalTab: 'directory' | 'related' | 'notes';
    expandedNodeIds: Set<string>;
    expandedRelatedNodeIds: Set<string>;
    needsPreview: boolean;
}

/**
 * 任意可被编辑器打开的条目
 */
export type EditorItem = Volume | Chapter | RelatedTree | NoteItem;