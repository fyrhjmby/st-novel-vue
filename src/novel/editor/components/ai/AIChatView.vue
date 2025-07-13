<template>
  <div class="flex-1 flex overflow-hidden h-full">
    <ConversationList />

    <main v-if="activeConversation" class="flex-1 flex flex-col bg-white">
      <ChatHeader :active-conversation="activeConversation" :current-model="currentModel" />
      <ChatMessageHistory :conversation="activeConversation" :is-receiving="isReceiving" />
      <ChatInputArea />
    </main>

    <div v-else class="flex-1 flex items-center justify-center bg-white text-gray-400">
      请从左侧选择或新建一个对话
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useChatStore } from '../../stores/chatStore';
import { storeToRefs } from 'pinia';
import ConversationList from './chat/ConversationList.vue';
import ChatHeader from './chat/ChatHeader.vue';
import ChatMessageHistory from './chat/ChatMessageHistory.vue';
import ChatInputArea from './chat/ChatInputArea.vue';

const chatStore = useChatStore();
const { activeConversation, currentModel, isReceiving } = storeToRefs(chatStore);

onMounted(() => {
  chatStore.fetchConversations();
});
</script>