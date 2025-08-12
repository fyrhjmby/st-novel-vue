import apiClient from '@/api/client';
import type { Conversation, ChatMessage } from '@novel/editor/types/chatTypes.ts';
import type { AIProviderConfig, AITaskType } from '@novel/editor/types';
import { useAuthStore } from '@/auth/store/auth.store';

/**
 * 获取所有聊天对话。
 */
export const fetchConversations = async (): Promise<Conversation[]> => {
    const response = await apiClient.get('/ai/chat/conversations');
    return response.data;
};

/**
 * 创建一个新的、空的对话。
 */
export const createConversation = async (): Promise<Conversation> => {
    const response = await apiClient.post('/ai/chat/conversations');
    return response.data;
};

/**
 * 发送一条消息并获取AI的回复。
 * @param conversationId - 对话ID
 * @param userInput - 用户输入的文本。
 * @returns 返回一个包含用户消息和AI回复消息的对象。
 */
export const sendMessage = async (conversationId: string, userInput: string): Promise<{ userMessage: ChatMessage; aiResponse: ChatMessage }> => {
    const response = await apiClient.post(`/ai/chat/conversations/${conversationId}/messages`, { content: userInput });
    // 假设后端返回包含用户消息和AI响应的结构
    return response.data;
};


/**
 * 调用后端API执行一个流式AI任务。
 * @param prompt - 发送给AI的最终提示词。
 * @param config - AI配置，如模型、温度等。
 * @param taskType - 任务的类型 ('润色', '续写' 等).
 * @param sourceItemTitle - 任务源文档的标题.
 * @param callbacks - 用于处理数据流、完成和错误事件的回调对象。
 */
export const streamAITask = async (
    prompt: string,
    config: AIProviderConfig,
    taskType: AITaskType,
    sourceItemTitle: string,
    callbacks: {
        onChunk: (chunk: string) => void;
        onComplete: () => void;
        onError: (error: string) => void;
    }
): Promise<void> => {
    const { onChunk, onComplete, onError } = callbacks;

    try {
        const authStore = useAuthStore();
        const token = authStore.token;
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/ai/tasks/stream', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                prompt,
                config,
                taskType,
                sourceItemTitle
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (!response.body) {
            throw new Error('Response body is null.');
        }

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        const sseRegex = /data: (.*)\n\n/g;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            let match;
            while((match = sseRegex.exec(value)) !== null) {
                const data = match[1];
                if (data) onChunk(data);
            }
        }
        onComplete();
    } catch (error) {
        onError(error instanceof Error ? error.message : 'An unknown streaming error occurred.');
    }
};