// =
// 文件: ..\src\novel\views\NovelRecent.vue
//

<template>
  <div class="flex-1 p-8 overflow-auto bg-[#FCFCFC] hide-scrollbar">
    <div class="max-w-6xl mx-auto">
      <!-- 页面标题 -->
      <div class="mb-6 pb-4 border-b border-gray-100">
        <h1 class="text-xl font-semibold text-[#374151]">最近编辑</h1>
        <p class="text-sm text-gray-500 mt-1">查看并继续您最近的工作</p>
      </div>

      <!-- 最近编辑列表 -->
      <div class="space-y-8">
        <div v-for="group in recentItems" :key="group.period">
          <h2 class="text-sm font-medium text-[#9CA3AF] mb-3 px-2">{{ group.period }}</h2>
          <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <ul class="divide-y divide-gray-100">
              <li
                  v-for="item in group.items"
                  :key="item.id"
                  class="p-4 flex items-center justify-between group hover:bg-gray-50/50 transition-colors"
              >
                <div class="flex items-center gap-4 flex-1 min-w-0">
                  <router-link :to="`/novel/editor`">
                    <img :src="item.cover" class="w-10 h-14 object-cover rounded-md flex-shrink-0 shadow-sm" alt="cover">
                  </router-link>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-[#374151] truncate">
                      <router-link :to="`/novel/editor`" class="hover:text-blue-600">{{ item.title }}</router-link>
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      编辑了 <span class="font-medium text-gray-600">{{ item.lastEditedChapter }}</span>
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-6">
                  <span class="text-sm text-gray-400 w-28 text-right">{{ item.lastEditedTime }}</span>
                  <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="px-3 py-1.5 bg-[#4B5563] text-white rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors">继续编辑</button>
                    <button class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"/></svg>
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const recentItems = ref([
  {
    period: '今天',
    items: [
      {
        id: 1,
        title: '星际漫游者',
        cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800',
        lastEditedChapter: '第四章：跃迁点',
        lastEditedTime: '2小时前'
      },
      {
        id: 5,
        title: '红尘一梦',
        cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800',
        lastEditedChapter: '第五十六章：终局',
        lastEditedTime: '5小时前'
      }
    ]
  },
  {
    period: '昨天',
    items: [
      {
        id: 2,
        title: '时间之沙',
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800',
        lastEditedChapter: '大纲',
        lastEditedTime: '下午 3:45'
      },
      {
        id: 1,
        title: '星际漫游者',
        cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800',
        lastEditedChapter: '角色设定 - 艾拉',
        lastEditedTime: '上午 10:12'
      },
    ]
  },
]);
</script>