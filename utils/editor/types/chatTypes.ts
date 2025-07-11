/**
 * AI模型定义
 */
export interface AIModel {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'limited';
}

/**
 * 聊天消息定义
 */
export interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
}

/**
 * 单个聊天会话定义
 */
export interface Conversation {
    id: string;
    title: string;
    summary: string;
    createdAt: string;
    messages: ChatMessage[];
}