<!-- 文件路径: src/novel/dashboard/views/RecentView.vue -->

<template>
  <div class="flex-1 p-8 overflow-auto bg-[#FCFCFC] hide-scrollbar">
    <div class="max-w-6xl mx-auto">
      <div class="mb-6 pb-4 border-b border-gray-100">
        <h1 class="text-xl font-semibold text-[#374151]">最近编辑</h1>
        <p class="text-sm text-gray-500 mt-1">查看并继续您最近的工作</p>
      </div>

      <div v-if="groupedRecentItems.length > 0" class="space-y-8">
        <div v-for="group in groupedRecentItems" :key="group.period">
          <h2 class="text-sm font-medium text-[#9CA3AF] mb-3 px-2">{{ group.period }}</h2>
          <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <ul class="divide-y divide-gray-100">
              <li
                  v-for="item in group.items"
                  :key="item.id"
                  class="p-4 flex items-center justify-between group hover:bg-gray-50/50 transition-colors"
              >
                <div class="flex items-center gap-4 flex-1 min-w-0">
                  <router-link :to="`/novel/editor?id=${item.novelId}`">
                    <img :src="item.novelCover" class="w-10 h-14 object-cover rounded-md flex-shrink-0 shadow-sm" alt="cover">
                  </router-link>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-[#374151] truncate">
                      <router-link :to="`/novel/editor?id=${item.novelId}`" class="hover:text-blue-600">{{ item.novelTitle }}</router-link>
                    </p>
                    <p class="text-xs text-gray-500 mt-1">
                      编辑了 <span class="font-medium text-gray-600">{{ item.editedItemName }}</span>
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-6">
                  <span class="text-sm text-gray-400 w-28 text-right">{{ item.formattedTime }}</span>
                  <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <router-link :to="`/novel/editor?id=${item.novelId}`" class="px-3 py-1.5 bg-[#4B5563] text-white rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors">继续编辑</router-link>
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
      <div v-else class="text-center py-20 text-gray-500">
        没有最近的编辑活动。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRecentStore } from '@/novel/dashboard/stores/recentStore';

const recentStore = useRecentStore();
const { groupedRecentItems } = storeToRefs(recentStore);

onMounted(() => {
  recentStore.fetchRecentItems();
});
</script>