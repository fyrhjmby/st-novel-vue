import type { Conversation, ChatMessage } from '@novel/editor/types/chatTypes.ts';
import * as chatApi from '@/novel/editor/api/chatApi';

/**
 * 从API获取所有聊天对话。
 * @returns 对话列表。
 */
export async function getConversations(): Promise<Conversation[]> {
    return await chatApi.fetchConversations();
}

/**
 * 通过API创建一个新的、空的对话对象。
 * @returns 一个新的 Conversation 对象。
 */
export async function createConversation(): Promise<Conversation> {
    return await chatApi.createConversation();
}

/**
 * 发送一条消息到API并接收AI的回复。
 * @param conversationId - 当前对话的ID
 * @param userInput - 用户输入的文本。
 * @returns 一个包含用户消息和AI回复消息的对象。
 */
export async function sendMessage(conversationId: string, userInput: string): Promise<{ userMessage: ChatMessage; aiResponse: ChatMessage }> {
    return await chatApi.sendMessage(conversationId, userInput);
}