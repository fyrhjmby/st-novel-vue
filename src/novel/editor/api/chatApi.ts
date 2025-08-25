// 文件: ..\src\novel\editor\api\chatApi.ts
import apiClient from '@/api/client';
import type { Conversation, BackendChatMessage, StreamResponseChunk } from '@novel/editor/types/chatTypes.ts';
import { useAuthStore } from '@/auth/store/auth.store';

export const fetchConversations = async (): Promise<Conversation[]> => {
    const response = await apiClient.get('/ai/chat/conversations');
    return response.data;
};

export const createConversation = async (): Promise<Conversation> => {
    const response = await apiClient.post('/ai/chat/conversations');
    return response.data;
};

export const streamChat = async (
    apiKeyId: number,
    messages: BackendChatMessage[],
    callbacks: {
        onChunk: (chunk: StreamResponseChunk) => void;
        onComplete: () => void;
        onError: (error: string) => void;
    }
): Promise<void> => {
    try {
        const authStore = useAuthStore();
        const token = authStore.token;
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/ai/stream-chat', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                api_key_id: apiKeyId,
                messages: messages,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('Failed to get response reader');

        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const rawChunk = decoder.decode(value);
            const lines = rawChunk.split('\n\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonData = line.substring(6);
                    if (jsonData) {
                        try {
                            const parsedChunk: StreamResponseChunk = JSON.parse(jsonData);
                            callbacks.onChunk(parsedChunk);
                        } catch (e) {
                            console.error('Failed to parse stream chunk:', jsonData);
                        }
                    }
                }
            }
        }
        callbacks.onComplete();
    } catch (error) {
        callbacks.onError(error instanceof Error ? error.message : String(error));
    }
};