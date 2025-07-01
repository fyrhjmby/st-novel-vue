<template>
  <main class="flex-1 bg-white flex flex-col">
    <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100">
      <h1 class="text-lg font-medium text-[#374151]">我的收藏</h1>
      <div class="relative">
        <svg class="w-5 h-5 text-[#9CA3AF] absolute top-1/2 left-3 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/></svg>
        <input type="text" placeholder="搜索我的收藏..." class="w-64 bg-gray-100 rounded-lg h-10 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5563]/20 focus:bg-white focus:border-[#4B5563] transition">
      </div>
    </header>
    <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC]">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="prompt in favoritePrompts" :key="prompt.title" class="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm cursor-pointer group">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform" :class="prompt.iconBgClass" v-html="prompt.icon"></div>
            <span class="text-xs font-medium px-2 py-1 rounded-md" :class="prompt.tagClass">{{ prompt.tag }}</span>
          </div>
          <h4 class="font-medium text-[#374151] mb-2">{{ prompt.title }}</h4>
          <p class="text-sm text-[#9CA3AF] mb-4 line-clamp-2">{{ prompt.description }}</p>
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-3 text-[#9CA3AF]">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
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
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const favoritePrompts = ref([
  {
    title: '爆款文案生成器',
    description: '根据产品特点和目标用户，生成引人注目的营销文案。',
    icon: `<svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L13.196 5.196z"/></svg>`,
    iconBgClass: 'bg-purple-50',
    tag: '写作',
    tagClass: 'text-[#3B82F6] bg-blue-50',
    likes: '2.3k',
    views: '18.5k',
    author: '王小美',
    authorAvatarClass: 'bg-gradient-to-br from-pink-100 to-rose-100'
  },
  {
    title: '代码优化助手',
    description: '分析代码并提供性能优化、可读性改进的建议。',
    icon: `<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`,
    iconBgClass: 'bg-green-50',
    tag: '编程',
    tagClass: 'text-[#EF4444] bg-red-50',
    likes: '956',
    views: '7.2k',
    author: '张程序',
    authorAvatarClass: 'bg-gradient-to-br from-blue-100 to-cyan-100'
  }
]);
</script>