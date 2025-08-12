import * as editorApi from '@/api/novel/editorApi';
import type { Conversation, ChatMessage } from '@novel/editor/types/chatTypes.ts';
import type { AIProviderConfig, AITaskType } from '@novel/editor/types';

export const fetchConversations = (): Promise<Conversation[]> => {
    return editorApi.fetchConversations();
};

export const createConversation = (): Promise<Conversation> => {
    return editorApi.createConversation();
};

export const sendMessage = (conversationId: string, userInput: string): Promise<{ userMessage: ChatMessage; aiResponse: ChatMessage }> => {
    return editorApi.sendMessage(conversationId, userInput);
};

export const streamAITask = (
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
    return editorApi.streamAITask(prompt, config, taskType, sourceItemTitle, callbacks);
};