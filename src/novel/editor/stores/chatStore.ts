import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Conversation, ChatMessage, AIModel } from '../types';
import { mockChatConversations } from '../data/chatData';

export const useChatStore = defineStore('novel-chat', () => {
    const conversations = ref<Conversation[]>([]);
    const activeConversationId = ref<string | null>(null);
    const currentModel = ref<AIModel>({ id: 'gpt-4o', name: 'GPT-4o', status: 'online' });
    const messageInput = ref<string>('');
    const isReceiving = ref<boolean>(false);

    const activeConversation = computed(() => {
        if (!activeConversationId.value) return null;
        return conversations.value.find(c => c.id === activeConversationId.value) ?? null;
    });

    const currentTokenCount = computed(() => {
        if (!activeConversation.value) return 0;
        return activeConversation.value.messages.reduce((acc, msg) => acc + msg.content.length, 0);
    });

    function fetchConversations() {
        conversations.value = mockChatConversations;
        if (conversations.value.length > 0 && !activeConversationId.value) {
            activeConversationId.value = conversations.value[0].id;
        }
    }

    function createNewConversation() {
        const newConv: Conversation = {
            id: `conv-${Date.now()}`,
            title: '新建对话',
            summary: '暂无摘要',
            createdAt: '刚刚',
            messages: [],
        };
        conversations.value.unshift(newConv);
        activeConversationId.value = newConv.id;
    }

    function selectConversation(conversationId: string) {
        activeConversationId.value = conversationId;
    }

    async function sendMessage() {
        if (!messageInput.value.trim() || !activeConversation.value || isReceiving.value) {
            return;
        }

        const userMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: messageInput.value,
            timestamp: new Date().toISOString(),
        };
        activeConversation.value.messages.push(userMessage);
        const currentInput = messageInput.value;
        messageInput.value = '';

        isReceiving.value = true;
        await new Promise(res => setTimeout(res, 1500));

        const aiResponse: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            role: 'ai',
            content: `这是对您关于 "${currentInput.substring(0, 10)}..." 的回复。AI正在思考中...`,
            timestamp: new Date().toISOString(),
        };
        activeConversation.value.messages.push(aiResponse);
        isReceiving.value = false;
    }

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