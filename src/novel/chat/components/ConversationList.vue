// =
// 文件: ..\src\novel\chat\components\ConversationList.vue
//

<template>
  <aside class="w-80 bg-gray-50/50 border-r border-gray-200/80 flex flex-col flex-shrink-0">
    <div class="p-4 border-b border-gray-200/80 h-20 flex items-center">
      <button
          @click="chatStore.createNewConversation"
          class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
      >
        <i class="fa-solid fa-plus fa-sm"></i>
        新建对话
      </button>
    </div>

    <div class="flex-1 p-2 space-y-1 overflow-y-auto hide-scrollbar">
      <a
          v-for="conv in chatStore.conversations"
          :key="conv.id"
          href="#"
          @click.prevent="chatStore.selectConversation(conv.id)"
          class="block p-3 rounded-lg transition-colors"
          :class="{
            'bg-blue-100': chatStore.activeConversationId === conv.id,
            'hover:bg-gray-200/60': chatStore.activeConversationId !== conv.id
          }"
      >
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" :class="chatStore.activeConversationId === conv.id ? 'bg-blue-600' : 'bg-gray-200'">
            <svg class="w-4 h-4" :class="chatStore.activeConversationId === conv.id ? 'text-white' : 'text-gray-600'" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"></path></svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm text-gray-800 truncate">{{ conv.title }}</p>
            <p class="text-xs text-gray-500 truncate mt-1">{{ conv.summary }}</p>
            <p class="text-xs text-gray-400 mt-2">{{ conv.createdAt }}</p>
          </div>
        </div>
      </a>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useChatStore } from '@/novel/chat/store/chatStore';

const chatStore = useChatStore();
</script>