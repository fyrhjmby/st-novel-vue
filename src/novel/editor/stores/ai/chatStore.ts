// src/novel/editor/stores/ai/chatStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Conversation, AIModel } from '@novel/editor/types/chatTypes';
import * as chatService from '@/novel/editor/services/chatService';

export const useChatStore = defineStore('editorChat', () => {
    // --- State ---
    const conversations = ref<Conversation[]>([]);
    const activeConversationId = ref<string | null>(null);
    const currentModel = ref<AIModel>({ id: 'gpt-4o', name: 'GPT-4o', status: 'online' });
    const messageInput = ref<string>('');
    const isReceiving = ref<boolean>(false);

    // --- Getters (Computed) ---
    const activeConversation = computed(() => {
        if (!activeConversationId.value) return null;
        return conversations.value.find(c => c.id === activeConversationId.value) ?? null;
    });

    const currentTokenCount = computed(() => {
        if (!activeConversation.value) return 0;
        return activeConversation.value.messages.reduce((acc, msg) => acc + msg.content.length, 0);
    });

    // --- Actions ---
    const fetchConversations = () => {
        conversations.value = chatService.getConversations();
        if (conversations.value.length > 0 && !activeConversationId.value) {
            activeConversationId.value = conversations.value[0].id;
        }
    };

    const createNewConversation = () => {
        const newConv = chatService.createConversation();
        conversations.value.unshift(newConv);
        activeConversationId.value = newConv.id;
    };

    const selectConversation = (conversationId: string) => {
        activeConversationId.value = conversationId;
    };

    const sendMessage = async () => {
        const userInput = messageInput.value.trim();
        if (!userInput || !activeConversation.value || isReceiving.value) {
            return;
        }

        const currentActiveConv = activeConversation.value;
        messageInput.value = ''; // Clear input immediately
        isReceiving.value = true;

        try {
            const { userMessage, aiResponse } = await chatService.sendMessage(userInput);
            // Ensure the conversation is still active before pushing messages
            if (activeConversation.value === currentActiveConv) {
                currentActiveConv.messages.push(userMessage);
                currentActiveConv.messages.push(aiResponse);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            // Optionally, push an error message to the chat
        } finally {
            isReceiving.value = false;
        }
    };

    return {
        conversations,
        activeConversationId,
        currentModel,
        messageInput,
        isReceiving,
        activeConversation,
        currentTokenCount,
        fetchConversations,
        createNewConversation,
        selectConversation,
        sendMessage,
    };
});