<template>
  <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
    <div class="flex items-center gap-4">
      <div class="w-10 h-10 bg-gradient-to-br from-[#4B5563] to-[#374151] rounded-full flex items-center justify-center">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M12 4.5v15M15.75 21v-1.5" /></svg>
      </div>
      <div>
        <h2 class="font-medium text-[#374151]">{{ activeConversation.title }}</h2>
        <button class="text-sm text-[#6B7280] flex items-center gap-2 hover:text-[#374151] transition-colors mt-1">
          <span class="w-2 h-2 rounded-full" :class="currentModel.status === 'online' ? 'bg-[#10B981]' : 'bg-gray-400'"></span>
          {{ currentModel.status === 'online' ? '在线' : '离线' }} • {{ currentModel.name }}
          <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
        </button>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button class="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="上下文管理">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
      </button>
      <button class="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="设置">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-.95.542.057 1.007.56 1.061 1.11L12 8.583l.235-3.535c.057-.542.56-1.007 1.11-.95.542.057 1.007.56 1.061 1.11L15.417 8.583l3.536-.235c.542-.057 1.007.56 1.061 1.11.057.542-.42 1.007-.95 1.061l-3.536.235.235 3.536c.057.542-.42 1.007-.95 1.061-.542.057-1.007-.42-1.061-.95L12 15.417l-.235 3.536c-.057.542-.56 1.007-1.11.95-.542-.057-1.007-.56-1.061-1.11L9.417 15.417l-3.536.235c-.542-.057-1.007-.42-.95-1.061.057-.542.42-1.007.95-1.061l3.536-.235-.235-3.536c-.057-.542.42-1.007.95-1.061.542-.057 1.007.42 1.061.95L12 9.417l.235-3.536zM12 14.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" /></svg>
      </button>
    </div>
  </header>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import type { Conversation, AIModel } from '@/novel/editor/types/chatTypes';

defineProps({
  activeConversation: {
    type: Object as PropType<Conversation>,
    required: true,
  },
  currentModel: {
    type: Object as PropType<AIModel>,
    required: true,
  },
});
</script>