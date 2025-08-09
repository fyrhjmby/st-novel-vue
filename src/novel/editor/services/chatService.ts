// src/novel/editor/services/chatService.ts
import type { Conversation, ChatMessage } from '@novel/editor/types/chatTypes';
import { mockChatConversations } from '@/novel/editor/components/ai/chat/chatData';

/**
 * 获取所有聊天对话。
 * @returns 对话列表。
 */
export function getConversations(): Conversation[] {
    return mockChatConversations;
}

/**
 * 创建一个新的、空的对话对象。
 * @returns 一个新的 Conversation 对象。
 */
export function createConversation(): Conversation {
    return {
        id: `conv-${Date.now()}`,
        title: '新建对话',
        summary: '暂无摘要',
        createdAt: '刚刚',
        messages: [],
    };
}

/**
 * 发送一条消息并模拟接收AI的回复。
 * @param userInput - 用户输入的文本。
 * @returns 一个包含用户消息和AI回复消息的对象。
 */
export async function sendMessage(userInput: string): Promise<{ userMessage: ChatMessage; aiResponse: ChatMessage }> {
    const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: userInput,
        timestamp: new Date().toISOString(),
    };

    // 模拟网络延迟和AI思考时间
    await new Promise(res => setTimeout(res, 1500));

    const aiResponse: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'ai',
        content: `这是对您关于 "${userInput.substring(0, 10)}..." 的回复。AI正在思考中...`,
        timestamp: new Date().toISOString(),
    };

    return { userMessage, aiResponse };
}