<template>
  <aside class="w-64 bg-[#FAFAFA] border-r border-gray-100 flex flex-col flex-shrink-0">
    <!-- 侧边栏头部区域 (已与主侧边栏统一) -->
    <div class="p-4 space-y-4 border-b border-gray-100">
      <router-link to="/home" class="flex items-center gap-3 px-2 group">
        <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
        </div>
        <div>
          <h3 class="font-medium text-[#374151] text-sm">AI Creator</h3>
          <p class="text-xs text-[#9CA3AF]">创作平台</p>
        </div>
      </router-link>
    </div>

    <!-- 主导航 -->
    <nav class="flex-1 px-4 py-6">
      <p class="text-xs font-medium text-[#9CA3AF] px-3 mb-3 uppercase tracking-wider">工作空间</p>
      <div class="space-y-1">
        <router-link
            v-for="item in navItems"
            :key="item.name"
            :to="item.path"
            class="flex items-center gap-3 px-3 py-2.5 text-[#6B7280] hover:bg-gray-100 rounded-lg text-sm transition-colors"
            active-class="bg-[#4B5563] text-white font-medium"
        >
          <span v-html="item.icon" class="w-5 h-5"></span>
          <span>{{ item.name }}</span>
        </router-link>
      </div>
    </nav>

    <!-- 底部设置 -->
    <div class="p-4 border-t border-gray-100 mt-auto">
      <router-link to="/settings" class="flex items-center gap-3 px-3 py-2.5 text-[#6B7280] hover:bg-gray-100 rounded-lg text-sm transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 1V6M12 18V23M4.22 4.22L7.76 7.76M16.24 16.24L19.78 19.78M1 12H6M18 12H23M4.22 19.78L7.76 16.24M16.24 7.76L19.78 4.22"/></svg>
        <span>设置</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const navItems = ref([
  { name: '我的小说', path: '/novel/dashboard', icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7H15M9 11H15M9 15H13"/></svg>` },
  { name: '最近编辑', path: '/novel/recent', icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6V12L16 16"/></svg>` },
  { name: '回收站', path: '/novel/trash', icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18M5 6V20a2 2 0 002 2h10a2 2 0 002-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>` },
  { name: '导出小说', path: '/novel/export', icon: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>` }
])
</script>

<style scoped>
.router-link-exact-active {
  color: white !important;
}
</style>