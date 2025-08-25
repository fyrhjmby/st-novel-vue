import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Conversation, ChatMessage, BackendChatMessage } from '@novel/editor/types/chatTypes';
import * as chatService from '@/novel/editor/services/ai/chatService';
import { useAIConfigStore } from './aiConfigStore';
import { marked } from 'marked';

export const useChatStore = defineStore('editorChat', () => {
    const conversations = ref<Conversation[]>([]);
    const activeConversationId = ref<string | null>(null);
    const messageInput = ref<string>('');
    const isReceiving = ref<boolean>(false);
    const isLoading = ref<boolean>(false);

    const activeConversation = computed(() => {
        if (!activeConversationId.value) return null;
        return conversations.value.find(c => c.id === activeConversationId.value) ?? null;
    });

    const currentTokenCount = computed(() => {
        if (!activeConversation.value) return 0;
        return activeConversation.value.messages.reduce((acc, msg) => acc + msg.content.length, 0);
    });

    const fetchConversations = async () => {
        isLoading.value = true;
        try {
            const fetchedConvs = await chatService.getConversations();
            conversations.value = fetchedConvs.length > 0 ? fetchedConvs : [await chatService.createConversation()];
            if (!activeConversationId.value || !conversations.value.find(c => c.id === activeConversationId.value)) {
                activeConversationId.value = conversations.value[0].id;
            }
        } catch (error) {
            console.error("Failed to fetch conversations:", error);
            if (conversations.value.length === 0) {
                conversations.value.push(await chatService.createConversation());
                activeConversationId.value = conversations.value[0].id;
            }
        } finally {
            isLoading.value = false;
        }
    };

    const createNewConversation = async () => {
        try {
            const newConv = await chatService.createConversation();
            conversations.value.unshift(newConv);
            activeConversationId.value = newConv.id;
        } catch (error) {
            console.error("Failed to create new conversation:", error);
        }
    };

    const selectConversation = (conversationId: string) => {
        activeConversationId.value = conversationId;
    };

    const sendMessage = async () => {
        const aiConfigStore = useAIConfigStore();
        const userInput = messageInput.value.trim();

        if (!userInput || !activeConversation.value || isReceiving.value) return;

        const providerIdStr = aiConfigStore.selectedChatProviderId;
        if (!providerIdStr) {
            alert("请先在顶部选择一个API配置！");
            return;
        }

        const providerIdNum = parseInt(providerIdStr, 10);
        if (isNaN(providerIdNum)) {
            alert("选择的API配置ID无效！");
            return;
        }

        isReceiving.value = true;
        const currentConv = activeConversation.value;

        const userMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: userInput,
            timestamp: new Date().toISOString(),
        };
        currentConv.messages.push(userMessage);
        messageInput.value = '';

        const backendMessages: BackendChatMessage[] = currentConv.messages.map(m => ({
            role: m.role,
            content: m.content,
        }));

        const aiResponsePlaceholder: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            role: 'ai',
            content: '',
            timestamp: new Date().toISOString(),
        };
        currentConv.messages.push(aiResponsePlaceholder);

        await chatService.streamMessage(
            providerIdNum,
            backendMessages,
            {
                onChunk: (chunk) => {
                    if (chunk.content) {
                        aiResponsePlaceholder.content += chunk.content;
                    }
                    if(chunk.error) {
                        aiResponsePlaceholder.content += `\n\n**错误:** ${chunk.error}`;
                    }
                },
                onComplete: () => {
                    isReceiving.value = false;
                    aiResponsePlaceholder.content = marked.parse(aiResponsePlaceholder.content) as string;
                },
                onError: (error) => {
                    isReceiving.value = false;
                    aiResponsePlaceholder.content += `\n\n**请求失败:** ${error}`;
                    aiResponsePlaceholder.content = marked.parse(aiResponsePlaceholder.content) as string;
                }
            }
        );
    };

    return {
        conversations,
        activeConversationId,
        messageInput,
        isReceiving,
        isLoading,
        activeConversation,
        currentTokenCount,
        fetchConversations,
        createNewConversation,
        selectConversation,
        sendMessage,
    };
});