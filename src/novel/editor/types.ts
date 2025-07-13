// --- 基本内容结构 ---

export interface Volume {
    id: string;
    type: 'volume';
    title: string;
    content: string;
    chapters: Chapter[];
}

export interface Chapter {
    id: string;
    type: 'chapter';
    title: string;
    wordCount: number;
    content: string;
    status: 'planned' | 'editing' | 'completed' | 'archived';
}

export interface RelatedTree {
    id: string;
    type: string;
    title: string;
    icon: string;
    content?: string;
    children?: RelatedTree[];
    originalData?: any;
}

export interface NoteItem {
    id: string;
    type: 'note';
    title: string;
    content: string;
    timestamp: string;
}

// --- 小说元数据与角色 ---

export interface NovelCharacter {
    id: string;
    name: string;
    avatar: string;
    identity: string;
    gender?: string;
    age?: number;
    faction?: string;
    summary: string;
    notes?: string;
    status?: 'editing' | 'completed' | 'draft';
}

export interface NovelTag {
    text: string;
    class: string;
}

export interface NovelMetadata {
    id: string;
    title: string;
    description: string;
    cover: string;
    tags: NovelTag[];
    status: '连载中' | '已完结' | '暂停更新';
}


// --- AI 相关 ---

export type AITaskStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'applied';

export interface AITask {
    id: string;
    title: string;
    type: '润色' | '续写' | '分析';
    targetItemId: string;
    status: AITaskStatus;
    originalContent: string;
    generatedContent: string;
    error?: string;
    createdAt: Date;
}

// --- 聊天相关 ---

export interface AIModel {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'limited';
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
}

export interface Conversation {
    id: string;
    title: string;
    summary: string;
    createdAt: string;
    messages: ChatMessage[];
}

// --- 搜索与UI ---

export interface SearchResult {
    id: string;
    title: string;
    icon: string;
    matches: { context: string }[];
}

// --- 上下文预览相关 ---
export interface ContextItem {
    id: string;
    group: string;
    title: string;
    description: string;
    content: string;
    wordCount?: number;
}

export interface PreviewTask {
    type: '润色' | '续写' | '分析';
    targetItemId: string;
    title: string;
}