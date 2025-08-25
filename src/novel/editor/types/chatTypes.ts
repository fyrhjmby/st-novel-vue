/**
 * AI模型定义
 */
export interface AIModel {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'limited';
}

/**
 * 聊天消息定义 - 用于UI展示
 */
export interface ChatMessage {
    id: string; // 前端专用，用于v-for的key
    role: 'user' | 'ai';
    content: string;
    timestamp: string; // 前端专用
}

/**
 * 发送到后端的聊天消息格式
 */
export interface BackendChatMessage {
    role: 'user' | 'ai' | 'system';
    content: string;
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

/**
 * 从后端流式接口返回的数据块结构
 */
export interface StreamResponseChunk {
    content?: string;
    done: boolean;
    error?: string;
}