<template>
  <aside class="w-64 bg-[#FAFAFA] border-r border-gray-100 flex flex-col flex-shrink-0">
    <div class="p-4 space-y-4 border-b border-gray-100">
      <div class="flex items-center gap-3 px-2">
        <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
        </div>
        <div>
          <h3 class="font-medium text-[#374151] text-sm">AI Prompt</h3>
          <p class="text-xs text-[#9CA3AF]">提示词平台</p>
        </div>
      </div>
    </div>
    <nav class="flex-1 px-4 py-6">
      <div class="mb-8">
        <p class="text-xs font-medium text-[#9CA3AF] px-3 mb-3 uppercase tracking-wider">浏览</p>
        <div class="space-y-1">
          <router-link v-for="item in browseNav" :key="item.name" :to="item.path" class="flex items-center gap-3 px-3 py-2.5 text-[#6B7280] hover:bg-gray-100 rounded-lg text-sm transition-colors" active-class="bg-[#4B5563] text-white font-medium">
            <span v-html="item.icon"></span>
            <span>{{ item.name }}</span>
          </router-link>
        </div>
      </div>
      <div>
        <p class="text-xs font-medium text-[#9CA3AF] px-3 mb-3 uppercase tracking-wider">管理</p>
        <div class="space-y-1">
          <router-link v-for="item in manageNav" :key="item.name" :to="item.path" class="flex items-center gap-3 px-3 py-2.5 text-[#6B7280] hover:bg-gray-100 rounded-lg text-sm transition-colors" active-class="bg-[#4B5563] text-white font-medium">
            <span v-html="item.icon"></span>
            <span>{{ item.name }}</span>
          </router-link>
        </div>
      </div>
    </nav>
    <div class="p-4 border-t border-gray-100 mt-auto">
      <router-link to="/settings" class="flex items-center gap-3 px-3 py-2.5 text-[#6B7280] hover:bg-gray-100 rounded-lg text-sm transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1V6M12 18V23M4.22 4.22L7.76 7.76M16.24 16.24L19.78 19.78M1 12H6M18 12H23M4.22 19.78L7.76 16.24M16.24 7.76L19.78 4.22"/></svg>
        <span>设置</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const browseNav = ref([
  { name: '提示词市场', path: '/prompt/market', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>` },
  { name: '我的收藏', path: '/prompt/favorites', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>` }
]);

const manageNav = ref([
  { name: '我的提示词', path: '/prompt/my', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L13.196 5.196z"/></svg>` },
  { name: '使用统计', path: '/prompt/statistics', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20L12 10M18 20L18 4M6 20L6 16"/></svg>` }
]);
</script>

<style scoped>
.router-link-active {
  background-color: #4B5563;
  color: white;
  font-weight: 500;
}
</style>