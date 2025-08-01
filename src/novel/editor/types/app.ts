// 文件: src/novel/editor/types/app.ts

import type { TreeNode, Volume, Chapter, NoteItem, PlotAnalysisItem } from './models';

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
    type: '润色' | '续写' | '分析' | '剧情生成';
    targetItemId: string; // 任务目标文档的ID
    status: AITaskStatus;
    sourceContent: string; // AI任务的源内容
    generatedContent: string;
    error?: string;
    createdAt: Date;
}

/**
 * AI 任务执行前的预览数据结构
 */
export interface AITaskPreview {
    type: AITask['type'];
    targetItemId: string;
    title: string;
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
    autoOpenAIPanel: boolean;
    activeTheme: 'default' | 'eye-care' | 'dark';
    taskApplicationStrategy: {
        mode: 'manual' | 'auto' | 'delayed';
        delaySeconds: number;
    };
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
 * 编辑器窗格定义
 */
export interface EditorPane {
    id: string;
    openTabIds: string[];
    activeTabId: string | null;
}

/**
 * 系统视图信息，用于在内容区打开非文件类标签页
 */
export interface SystemViewInfo {
    id: string; // e.g., 'system:search'
    type: 'system';
    component: 'SearchView' | 'AIChatView' | 'AITaskPanel' | 'EditorSettings' | 'ContextSettings' | 'TaskSettings' | 'AIConfigSettings' | 'NovelSettings' | 'HistoryPanel' | 'ReaderPanel' | 'ThemeSettings';
    title: string;
    icon: string;
    content?: null; // 系统视图没有 content 属性
    targetItemId?: string; // For dynamic views like history
}

/**
 * 任意可被编辑器打开的条目
 * 这是一个辨识联合类型，涵盖了所有可能在标签页中打开的内容。
 */
export type EditorItem = Volume | Chapter | TreeNode | NoteItem | SystemViewInfo | PlotAnalysisItem;

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