<!-- src/novel/views/NovelDashboard.vue -->
<template>
  <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] hide-scrollbar">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-4">
        <!-- 搜索框 -->
        <label class="flex items-center gap-2 w-64 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/></svg>
          <input type="text" class="grow text-sm bg-transparent outline-none text-[#374151]" placeholder="搜索小说名或标签..." />
        </label>
        <!-- 下拉选择 -->
        <select class="text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-[#374151]">
          <option>全部类型</option>
          <option>科幻</option>
          <option>言情</option>
          <option>悬疑</option>
        </select>
      </div>
      <div class="flex items-center gap-4">
        <button class="text-sm text-[#6B7280] hover:text-[#374151] transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M7 18C4.5 18 3 16.5 3 14C3 11.5 5 10 7 10C7.3 10 7.5 10 7.8 10.1C8.5 7.2 11 5 14 5C17.3 5 20 7.7 20 11C20 11.3 20 11.7 19.9 12C21.1 12.5 22 13.6 22 15C22 16.9 20.4 18.5 18.5 18.5"/><path d="M12 13V21M15 16L12 13L9 16"/></svg>
          <span>导入小说</span>
        </button>
        <button class="text-sm font-medium text-white bg-[#4B5563] hover:bg-gray-700 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5V19M5 12H19"/></svg>
          <span>新建小说</span>
        </button>
      </div>
    </div>

    <!-- 小说网格 -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div
          v-for="(novel, index) in novels"
          :key="novel.title"
          class="group bg-white rounded-xl border border-gray-100 p-4 flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1"
      >
        <router-link :to="`/novel/manage/${index + 1}`" class="block aspect-[2/3] relative w-full mb-4 rounded-lg overflow-hidden">
          <img :src="novel.cover" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" alt="Book Cover">
          <div class="absolute top-0 left-0 w-full h-full bg-black/5 group-hover:bg-black/10 transition-colors"></div>
        </router-link>

        <div class="flex flex-col flex-grow">
          <h3 class="text-sm font-medium text-[#374151] leading-tight truncate">
            <router-link :to="`/novel/manage/${index + 1}`" class="hover:text-blue-600 transition-colors">{{ novel.title }}</router-link>
          </h3>
          <p class="text-xs text-[#9CA3AF] mt-1">{{ novel.chapters }}章 · {{ novel.status.text }}</p>
          <div class="mt-auto pt-3">
            <div class="border-t border-gray-100 pt-3 flex justify-between items-center text-xs text-gray-400">
              <div class="flex items-center gap-1.5">
                 <span
                     v-for="tag in novel.tags"
                     :key="tag.text"
                     class="text-xs px-1.5 py-0.5 rounded font-medium"
                     :class="tag.class"
                 >
                  {{ tag.text }}
                </span>
              </div>
              <span>{{ novel.lastUpdated }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const novels = ref([
  {
    title: '星际漫游者',
    description: '一部关于孤独宇航员在未知星系中寻找回家之路的科幻史诗。',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800',
    status: { text: '编辑中', class: 'bg-green-500/90' },
    tags: [
      { text: '科幻', class: 'bg-blue-50 text-blue-700' },
      { text: '冒险', class: 'bg-purple-50 text-purple-700' }
    ],
    chapters: 24,
    lastUpdated: '2小时前'
  },
  {
    title: '时间之沙',
    description: '当历史可以被改写，一个历史学家必须阻止一个神秘组织抹去关键的历史事件。',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800',
    status: { text: '待审核', class: 'bg-yellow-500/90' },
    tags: [
      { text: '悬疑', class: 'bg-yellow-50 text-yellow-700' },
      { text: '科幻', class: 'bg-blue-50 text-blue-700' }
    ],
    chapters: 15,
    lastUpdated: '1天前'
  },
  {
    title: '深海回响',
    description: '一支科考队在马里亚纳海沟深处唤醒了远古的未知生物，带来了无尽的恐惧。',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800',
    status: { text: '已驳回', class: 'bg-red-500/90' },
    tags: [
      { text: '恐怖', class: 'bg-gray-100 text-gray-600' },
      { text: '冒险', class: 'bg-purple-50 text-purple-700' }
    ],
    chapters: 5,
    lastUpdated: '3天前'
  },
  {
    title: '都市霓虹',
    description: '一个平凡的程序员意外获得读取他人思想的能力，卷入一场巨大的商业阴谋。',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800',
    status: { text: '已发布', class: 'bg-blue-500/90' },
    tags: [
      { text: '都市', class: 'bg-pink-50 text-pink-700' },
      { text: '异能', class: 'bg-green-50 text-green-700' }
    ],
    chapters: 102,
    lastUpdated: '1周前'
  },
  {
    title: '红尘一梦',
    description: '穿越回古代，成为一个不受宠的公主，她如何利用现代知识在宫廷斗争中生存。',
    cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800',
    status: { text: '编辑中', class: 'bg-green-500/90' },
    tags: [
      { text: '古风', class: 'bg-red-50 text-red-700' },
      { text: '言情', class: 'bg-indigo-50 text-indigo-700' }
    ],
    chapters: 56,
    lastUpdated: '5小时前'
  }
]);
</script>