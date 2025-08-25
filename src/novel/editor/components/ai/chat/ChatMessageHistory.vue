//src/novel/editor/components/ai/chat/chatmessage.vue
<template>
  <div class="flex-1 p-6 overflow-y-auto" ref="chatHistoryContainer">
    <div class="max-w-5xl mx-auto space-y-6">
      <div v-if="conversation" v-for="message in conversation.messages" :key="message.id" class="group relative">
        <!-- 用户消息 -->
        <div v-if="message.role === 'user'" class="flex justify-end items-center gap-2">
          <div class="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><i class="fa-solid fa-copy"></i></button>
          </div>
          <div class="bg-[#3B82F6] text-white p-4 rounded-xl rounded-br-lg max-w-[70%] text-sm" v-html="message.content"></div>
        </div>

        <!-- AI回复 -->
        <div v-if="message.role === 'ai'" class="flex items-start gap-3">
          <div class="w-8 h-8 bg-gradient-to-br from-[#4B5563] to-[#374151] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M12 4.5v15M15.75 21v-1.5" /></svg>
          </div>
          <div class="bg-[#F3F4F6] text-[#374151] p-4 rounded-xl rounded-bl-lg max-w-[70%] text-sm" v-html="message.content"></div>
          <div class="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity self-center">
            <button class="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><i class="fa-solid fa-rotate-right"></i></button>
            <button class="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><i class="fa-solid fa-copy"></i></button>
          </div>
        </div>
      </div>

      <!-- AI正在输入指示器 -->
      <div v-if="isReceiving" class="flex items-start gap-3">
        <div class="w-8 h-8 bg-gradient-to-br from-[#4B5563] to-[#374151] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M12 4.5v15M15.75 21v-1.5" /></svg>
        </div>
        <div class="bg-[#F3F4F6] text-[#374151] p-4 rounded-xl rounded-bl-lg text-sm">
          <span class="blinking-cursor">▍</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, type PropType } from 'vue';
import type { Conversation } from '@/novel/editor/types/chatTypes';

const props = defineProps({
  conversation: {
    type: Object as PropType<Conversation | null>,
    required: true,
  },
  isReceiving: {
    type: Boolean,
    required: true,
  },
});

const chatHistoryContainer = ref<HTMLElement | null>(null);

const scrollToBottom = () => {
  nextTick(() => {
    if (chatHistoryContainer.value) {
      chatHistoryContainer.value.scrollTop = chatHistoryContainer.value.scrollHeight;
    }
  });
};

watch(() => props.conversation?.messages, () => {
  scrollToBottom();
}, { deep: true, flush: 'post' });

watch(() => props.isReceiving, (newValue) => {
  if (newValue) {
    scrollToBottom();
  }
}, { flush: 'post' });
</script>

<style scoped>
.blinking-cursor {
  font-weight: 500;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  from, to {
    color: transparent;
  }
  50% {
    color: #3B82F6;
  }
}
</style>