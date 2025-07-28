import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Conversation, ChatMessage, AIModel } from '@/novel/editor/types/chatTypes';
import { mockChatConversations } from '@/novel/editor/data/chatData';

export const useChatStore = defineStore('editorChat', () => {
    // --- State ---

    // 所有对话的列表
    const conversations = ref<Conversation[]>([]);
    // 当前激活的对话ID
    const activeConversationId = ref<string | null>(null);
    // 当前可用的AI模型
    const currentModel = ref<AIModel>({ id: 'gpt-4o', name: 'GPT-4o', status: 'online' });
    // 输入框中的内容
    const messageInput = ref<string>('');
    // 标志位，表示AI是否正在回复中
    const isReceiving = ref<boolean>(false);

    // --- Getters (Computed) ---

    // 根据 activeConversationId 获取当前完整的对话对象
    const activeConversation = computed(() => {
        if (!activeConversationId.value) return null;
        return conversations.value.find(c => c.id === activeConversationId.value) ?? null;
    });

    // 当前对话的 token 统计 (简化版)
    const currentTokenCount = computed(() => {
        if (!activeConversation.value) return 0;
        return activeConversation.value.messages.reduce((acc, msg) => acc + msg.content.length, 0);
    });

    // --- Actions ---

    /**
     * 初始化或从后端获取聊天数据
     */
    const fetchConversations = () => {
        // 从模块专属的数据文件加载模拟数据
        conversations.value = mockChatConversations;

        // 默认激活第一个对话
        if (conversations.value.length > 0 && !activeConversationId.value) {
            activeConversationId.value = conversations.value[0].id;
        }
    };

    /**
     * 新建一个对话
     */
    const createNewConversation = () => {
        const newConv: Conversation = {
            id: `conv-${Date.now()}`,
            title: '新建对话',
            summary: '暂无摘要',
            createdAt: '刚刚',
            messages: [],
        };
        conversations.value.unshift(newConv);
        activeConversationId.value = newConv.id;
    };

    /**
     * 切换当前对话
     * @param conversationId - 要切换到的对话ID
     */
    const selectConversation = (conversationId: string) => {
        activeConversationId.value = conversationId;
    };

    /**
     * 发送消息
     */
    const sendMessage = async () => {
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
        messageInput.value = ''; // 清空输入框

        // 模拟AI回复
        isReceiving.value = true;
        await new Promise(res => setTimeout(res, 1500)); // 模拟网络延迟

        const aiResponse: ChatMessage = {
            id: `msg-${Date.now() + 1}`,
            role: 'ai',
            content: `这是对您关于 "${userMessage.content.substring(0, 10)}..." 的回复。AI正在思考中...`,
            timestamp: new Date().toISOString(),
        };
        activeConversation.value.messages.push(aiResponse);
        isReceiving.value = false;
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