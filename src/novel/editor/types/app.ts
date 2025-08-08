// 文件: src/novel/editor/types/app.ts

import type { TreeNode, Volume, Chapter, NoteItem, PlotAnalysisItem } from './models';

/**
 * AI 任务状态
 */
export type AITaskStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'applied';

/**
 * AI 任务类型 (用户界面显示名称)
 */
export type AITaskType = '润色' | '续写' | '分析' | '剧情生成' | '创作';

/**
 * AI 任务对象
 */
export interface AITask {
    id: string;
    title: string;
    type: AITaskType;
    sourceItemId: string;
    targetItemId: string;
    sourceItemTitle: string; // 新增：源文档标题快照
    sourceItemContent: string; // 新增：源文档内容快照
    status: AITaskStatus;
    generatedContent: string;
    finalPrompt?: string;
    error?: string;
    createdAt: Date;
}

/**
 * AI 任务执行前的预览数据结构
 */
export interface AITaskPreview {
    type: AITaskType;
    targetItemId: string; // 此处targetItemId即为sourceItemId
    title: string;
}

/**
 * 上下文预设或已选择的条目
 */
export interface ContextItem {
    id:string;
    category: '设定' | '其他';
    group: string;
    title:string;
    description: string;
    content: string;
}

/**
 * buildContextForTask 方法的返回结果
 */
export interface ContextBuildResult {
    fixed: string;
    dynamic: string;
    rag: string;
    prompt: string;
    stats: {
        fixedCharCount: number;
        dynamicCharCount: number;
        ragCharCount: number;
        promptCharCount: number;
    };
}

/**
 * 动态上下文的配置项
 */
export interface DynamicContextSettings {
    prevVolumes: number;
    nextVolumes: number;
    prevChapters: number;
    nextChapters: number;
    includeVolumePlot: boolean;
    includeVolumeAnalysis: boolean;
    includeRelatedPlot: boolean;
    includeRelatedAnalysis: boolean;
}

/**
 * 编辑器UI状态
 * 用于定义 uiStore 中的 uiState
 */
export interface EditorUIState {
    expandedNodeIds: Set<string>;
    expandedRelatedNodeIds: Set<string>;
    autoOpenAIPanel: boolean;
    activeTheme: 'default' | 'eye-care' | 'dark';
    concurrentTaskLimit: number;
    taskApplicationStrategy: {
        mode: 'manual' | 'auto' | 'delayed';
        delaySeconds: number;
    };
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