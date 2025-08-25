<!-- 文件路径: src/novel/dashboard/views/DashboardView.vue -->

<template>
  <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] hide-scrollbar">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-4">
        <label class="flex items-center gap-2 w-64 bg-white border border-gray-200 rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/></svg>
          <input
              type="text"
              class="grow text-sm bg-transparent outline-none text-[#374151]"
              placeholder="搜索小说名或标签..."
              v-model="searchQuery"
          />
        </label>
        <select
            v-model="selectedCategory"
            class="text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-[#374151]"
        >
          <option>全部类型</option>
          <option v-for="category in availableCategories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      <div class="flex items-center gap-4">
        <router-link to="/novel/import" class="text-sm text-[#6B7280] hover:text-[#374151] transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M7 18C4.5 18 3 16.5 3 14C3 11.5 5 10 7 10C7.3 10 7.5 10 7.8 10.1C8.5 7.2 11 5 14 5C17.3 5 20 7.7 20 11C20 11.3 20 11.7 19.9 12C21.1 12.5 22 13.6 22 15C22 16.9 20.4 18.5 18.5 18.5"/><path d="M12 13V21M15 16L12 13L9 16"/></svg>
          <span>导入小说</span>
        </router-link>
        <router-link to="/novel/new" class="text-sm font-medium text-white bg-[#4B5563] hover:bg-gray-700 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5V19M5 12H19"/></svg>
          <span>新建小说</span>
        </router-link>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div
          v-for="novel in filteredNovels"
          :key="novel.id"
          class="group bg-white rounded-xl border border-gray-100 p-4 flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1"
      >
        <router-link :to="`/novel/editor?id=${novel.id}`" @click="handleNovelClick(novel)" class="block aspect-[4/5] relative w-full mb-4 rounded-lg overflow-hidden">
          <img :src="novel.cover" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" alt="Book Cover">
          <div class="absolute top-0 left-0 w-full h-full bg-black/5 group-hover:bg-black/10 transition-colors"></div>
        </router-link>

        <div class="flex flex-col flex-grow">
          <div class="flex justify-between items-start">
            <h3 class="text-sm font-medium text-[#374151] leading-tight truncate pr-2 flex-grow">
              <router-link :to="`/novel/editor?id=${novel.id}`" @click="handleNovelClick(novel)" class="hover:text-blue-600 transition-colors">{{ novel.title }}</router-link>
            </h3>
            <div class="relative flex-shrink-0">
              <button @click.stop="toggleDropdown(novel.id)" class="text-gray-400 hover:text-gray-600 rounded-full w-6 h-6 flex items-center justify-center">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
              </button>
              <div v-if="activeDropdown === novel.id" class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                <div class="py-1">
                  <button @click="handleDeleteNovel(novel.id)" class="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09a2.09 2.09 0 00-2.09 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                    <span>删除小说</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
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
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useNovelStore } from '@/novel/dashboard/stores/novelStore';
import { useRecentStore } from '@/novel/dashboard/stores/recentStore';
import type { NovelDashboardItem } from '@/novel/types';

const novelStore = useNovelStore();
const recentStore = useRecentStore();
const {
  filteredNovels,
  availableCategories,
  searchQuery,
  selectedCategory
} = storeToRefs(novelStore);

const activeDropdown = ref<string | null>(null);

const toggleDropdown = (novelId: string) => {
  activeDropdown.value = activeDropdown.value === novelId ? null : novelId;
};

const closeDropdown = () => {
  activeDropdown.value = null;
};

const handleDeleteNovel = (novelId: string) => {
  if (confirm('您确定要将这本小说移至回收站吗？')) {
    novelStore.deleteNovel(novelId);
    closeDropdown();
  }
};

const handleNovelClick = (novel: NovelDashboardItem) => {
  recentStore.logRecentAccess(novel);
};

onMounted(() => {
  novelStore.initializeDashboard(); // Use the dedicated initialization action
  window.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.relative')) {
      closeDropdown();
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('click', closeDropdown);
});
</script>