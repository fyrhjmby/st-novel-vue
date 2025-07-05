// =
// 文件: ..\src/novel/dashboard/views/DashboardView.vue
//
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
        <router-link :to="`/novel/editor?id=${novel.id}`" class="block aspect-[4/5] relative w-full mb-4 rounded-lg overflow-hidden">
          <img :src="novel.cover" class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" alt="Book Cover">
          <div class="absolute top-0 left-0 w-full h-full bg-black/5 group-hover:bg-black/10 transition-colors"></div>
        </router-link>

        <div class="flex flex-col flex-grow">
          <h3 class="text-sm font-medium text-[#374151] leading-tight truncate">
            <router-link :to="`/novel/editor?id=${novel.id}`" class="hover:text-blue-600 transition-colors">{{ novel.title }}</router-link>
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
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDashboardStore } from '@/novel/dashboard/stores/dashboardStore';

const dashboardStore = useDashboardStore();

const {
  filteredNovels,
  availableCategories,
  searchQuery,
  selectedCategory
} = storeToRefs(dashboardStore);

onMounted(() => {
  dashboardStore.fetchAllData();
});
</script>