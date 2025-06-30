<template>
  <aside class="w-64 bg-[#FAFAFA] border-r border-gray-100 flex flex-col flex-shrink-0">
    <div class="p-4 space-y-4 border-b border-gray-100">
      <div class="flex items-center gap-3 px-2">
        <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </div>
        <router-link to="/home" class="flex items-center gap-3 group">
          <div><h3 class="font-medium text-[#374151] text-sm">设置中心</h3>
            <p class="text-xs text-[#9CA3AF]">Settings</p>
          </div>
        </router-link>
      </div>
    </div>
    <nav class="flex-1 px-4 py-6">
      <div>
        <p class="text-xs font-medium text-[#9CA3AF] px-3 mb-3 uppercase tracking-wider">主要功能</p>
        <div class="space-y-1">
          <router-link
              v-for="item in navItems"
              :key="item.name"
              :to="item.path"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-[#6B7280] hover:bg-gray-100"
              active-class="bg-[#4B5563] text-white font-medium"
              exact-active-class="bg-[#4B5563] text-white font-medium"
          >
            <span v-html="item.icon"></span>
            <span>{{ item.label }}</span>
          </router-link>
        </div>
      </div>
    </nav>
    <div class="p-4 border-t border-gray-100 mt-auto">
      <router-link
          to="/settings/help"
          class="flex items-center gap-3 px-3 py-2.5 text-[#6B7280] hover:bg-gray-100 rounded-lg text-sm transition-colors"
          active-class="bg-[#4B5563] text-white font-medium"
          exact-active-class="bg-[#4B5563] text-white font-medium"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9C9.3 8.33 9.75 7.76 10.35 7.41C10.95 7.05 11.65 6.93 12.33 7.07C13.01 7.21 13.61 7.59 14.02 8.14C14.43 8.69 14.61 9.37 14.53 10.04C14.45 10.71 14.11 11.32 13.58 11.73C13.3 11.95 13.02 12.14 12.74 12.31C12.46 12.48 12.2 12.65 11.98 12.85C11.76 13.04 11.59 13.27 11.48 13.53C11.36 13.79 11.31 14.08 11.31 14.39"/><circle cx="12" cy="17" r="0.5"/></svg>
        <span>帮助中心</span>
      </router-link>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const navItems = ref([
  { path: '/settings/user', name: 'UserSettings', label: '用户设置', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 7C16 9.21 14.21 11 12 11C9.79 11 8 9.21 8 7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7Z"/><path d="M12 14C7.29 14 3 16.29 3 21V22H21V21C21 16.29 16.71 14 12 14Z"/></svg>` },
  { path: '/settings/api', name: 'ApiManagement', label: 'API管理', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>` },
  { path: '/settings/usage-logs', name: 'UsageLogs', label: '用量与日志', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 19V13M15 19V8M21 19V3M3 19L3 16"/></svg>` },
  { path: '/settings/system', name: 'SystemSettings', label: '系统设置', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>` },
  { path: '/settings/data-privacy', name: 'DataPrivacy', label: '数据与隐私', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 1v6m0 0l-3-3m3 3l3-3m3 5.5A6.5 6.5 0 115.5 9.5a6.5 6.5 0 0113 0z"/></svg>` },
]);
</script>