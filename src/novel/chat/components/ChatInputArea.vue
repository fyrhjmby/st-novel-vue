// =
// 文件: ..\src\novel\chat\components\ChatInputArea.vue
//

<template>
  <div class="p-4 border-t border-gray-100 bg-[#FAFAFA]">
    <div class="flex gap-3 items-end max-w-5xl mx-auto">
      <button class="w-9 h-9 flex-shrink-0 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3.375 3.375 0 1118.375 12.74z" /></svg>
      </button>
      <div class="flex-1 bg-white border border-gray-200 rounded-lg focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-shadow">
        <textarea
            v-model="messageInput"
            @keydown.enter.exact.prevent="sendMessage"
            class="w-full bg-transparent p-2.5 text-sm text-[#374151] resize-none outline-none hide-scrollbar"
            placeholder="输入您的问题，按 Enter 发送"
            rows="1"
            ref="textareaRef"
        ></textarea>
      </div>
      <button
          @click="sendMessage"
          :disabled="isReceiving || !messageInput.trim()"
          class="w-10 h-10 flex-shrink-0 bg-[#4B5563] text-white rounded-lg hover:bg-[#374151] transition-colors flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"></path></svg>
      </button>
    </div>
    <div class="text-center mt-2 text-xs text-[#9CA3AF]">
      <span>按 Shift+Enter 换行 • 当前会话: {{ currentTokenCount }} tokens</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useChatStore } from '@/novel/chat/store/chatStore';
import { storeToRefs } from 'pinia';

const chatStore = useChatStore();
const { messageInput, isReceiving, currentTokenCount } = storeToRefs(chatStore);

const textareaRef = ref<HTMLTextAreaElement | null>(null);

const sendMessage = () => {
  chatStore.sendMessage();
};

// 自动调整 textarea 高度
watch(messageInput, (newValue) => {
  const el = textareaRef.value;
  if (el) {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }
  // 清空后恢复原始高度
  if (newValue === '') {
    el.style.height = 'auto';
  }
});
</script>