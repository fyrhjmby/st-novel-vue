import * as chatApi from '@/novel/editor/api/chatApi';
import type { BackendChatMessage, Conversation, StreamResponseChunk } from '@novel/editor/types/chatTypes.ts';

export const streamMessage = (
    apiKeyId: number,
    messages: BackendChatMessage[],
    callbacks: {
        onChunk: (chunk: StreamResponseChunk) => void;
        onComplete: () => void;
        onError: (error: string) => void;
    }
): Promise<void> => {
    return chatApi.streamChat(apiKeyId, messages, callbacks);
};

// 模拟函数，保持UI可运行
export async function getConversations(): Promise<Conversation[]> {
    return await chatApi.fetchConversations();
}

export async function createConversation(): Promise<Conversation> {
    return await chatApi.createConversation();
}