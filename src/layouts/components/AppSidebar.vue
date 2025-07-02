<template>
  <aside class="w-64 bg-[#FAFAFA] border-r border-gray-100 flex flex-col flex-shrink-0">
    <div class="p-4 space-y-4 border-b border-gray-100">
      <div class="flex items-center gap-3 px-2">
        <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
        </div>
        <div>
          <h3 class="font-medium text-[#374151] text-sm">AI Creator</h3>
          <p class="text-xs text-[#9CA3AF]">创作平台</p>
        </div>
      </div>
    </div>

    <!-- 主导航 -->
    <nav class="flex-1 px-4 py-6">
      <div class="mb-8">
        <p class="text-xs font-medium text-[#9CA3AF] px-3 mb-3 uppercase tracking-wider">主要功能</p>
        <div class="space-y-1">
          <router-link v-for="item in mainNav" :key="item.name" :to="item.path" class="flex items-center gap-3 px-3 py-2.5 text-[#6B7280] hover:bg-gray-100 rounded-lg text-sm transition-colors" active-class="bg-[#4B5563] text-white font-medium">
            <span v-html="item.icon"></span>
            <span>{{ item.name }}</span>
          </router-link>
        </div>
      </div>

      <div>
        <p class="text-xs font-medium text-[#9CA3AF] px-3 mb-3 uppercase tracking-wider">工具</p>
        <div class="space-y-1">
          <template v-for="item in toolsNav" :key="item.name">
            <router-link v-if="!item.disabled" :to="item.path" class="flex items-center gap-3 px-3 py-2.5 text-[#6B7280] hover:bg-gray-100 rounded-lg text-sm transition-colors" active-class="bg-[#4B5563] text-white font-medium">
              <span v-html="item.icon"></span>
              <span>{{ item.name }}</span>
            </router-link>
            <div v-else class="flex items-center gap-3 px-3 py-2.5 text-gray-400 rounded-lg text-sm cursor-not-allowed">
              <span v-html="item.icon"></span>
              <span>{{ item.name }}</span>
            </div>
          </template>
        </div>
      </div>
    </nav>

    <!-- 底部设置 -->
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

const mainNav = ref([
  { name: '工作台', path: '/home', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`},
  { name: '创作中心', path: '/novel', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/></svg>`},
  { name: '角色扮演', path: '/roleplay', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21V18C20 16.3 19.3 14.8 18.2 13.7C17.1 12.6 15.6 12 14 12H10C8.4 12 6.9 12.6 5.8 13.7C4.7 14.8 4 16.3 4 18V21"/><circle cx="12" cy="7" r="4"/></svg>`}
]);

const toolsNav = ref([
  { name: '工作流', path: '/workflow', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 3V15M9 15L5 11M9 15L13 11"/><path d="M15 21V9M15 9L19 13M15 9L11 13"/></svg>`, disabled: false },
  { name: '提示词库', path: '/prompt', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12H16"/></svg>`, disabled: false }
]);
</script>

<style scoped>
.router-link-exact-active {
  color: white !important;
}
</style>