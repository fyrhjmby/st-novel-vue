<template>
  <main class="flex-1 bg-white flex flex-col">
    <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100">
      <h1 class="text-lg font-medium text-[#374151]">提示词市场</h1>
      <div class="relative">
        <svg class="w-5 h-5 text-[#9CA3AF] absolute top-1/2 left-3 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/></svg>
        <input type="text" placeholder="搜索提示词..." class="w-64 bg-gray-100 rounded-lg h-10 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5563]/20 focus:bg-white focus:border-[#4B5563] transition">
      </div>
    </header>
    <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC]">
      <div class="mb-6">
        <div class="flex items-center gap-3">
          <button class="px-4 py-2 bg-[#4B5563] text-white rounded-lg text-sm font-medium">最热门</button>
          <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#6B7280] hover:bg-gray-50 transition-colors">最新</button>
          <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#6B7280] hover:bg-gray-50 transition-colors">推荐</button>
        </div>
      </div>

      <div v-if="promptStore.isLoading" class="text-center py-10 text-gray-500">
        正在加载...
      </div>
      <div v-else-if="promptStore.error" class="text-center py-10 text-red-500">
        {{ promptStore.error }}
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <router-link v-for="prompt in promptStore.marketPrompts" :key="prompt.id" :to="{ name: 'prompt-detail', params: { id: prompt.id } }" class="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm cursor-pointer group block">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform" :class="prompt.iconBgClass" v-html="prompt.icon"></div>
            <span class="text-xs font-medium px-2 py-1 rounded-md" :class="prompt.tagClass">{{ prompt.tag }}</span>
          </div>
          <h4 class="font-medium text-[#374151] mb-2">{{ prompt.title }}</h4>
          <p class="text-sm text-[#9CA3AF] mb-4 line-clamp-2">{{ prompt.description }}</p>
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-3 text-[#9CA3AF]">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                <span>{{ prompt.likes }}</span>
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <span>{{ prompt.views }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-full" :class="prompt.authorAvatarClass"></div>
              <span class="text-[#6B7280]">{{ prompt.author }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePromptStore } from '@/prompt/stores/promptStore';

const promptStore = usePromptStore();

onMounted(() => {
  if (promptStore.prompts.length === 0) {
    promptStore.fetchAllPrompts();
  }
});
</script>