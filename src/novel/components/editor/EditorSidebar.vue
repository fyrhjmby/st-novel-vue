// =
// 文件: ..\src\novel\components\editor\EditorSidebar.vue
//
// 说明: 编辑器左侧边栏，包含返回链接和小说管理菜单。
//

<template>
  <aside class="w-64 bg-[#FAFAFA] border-r border-gray-100 flex flex-col flex-shrink-0">
    <!-- 顶部小说信息区域 -->
    <div class="p-4 space-y-4 border-b border-gray-100 h-20 flex items-center">
      <router-link :to="`/novel/manage/${novelId}`" class="flex items-center gap-3 px-2 group w-full">
        <div class="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:scale-105 transition-transform">
          <svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/></svg>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-medium text-[#374151] text-sm truncate">星际漫游者</h3>
          <p class="text-xs text-[#9CA3AF] truncate">科幻 • 编辑中</p>
        </div>
        <svg class="w-4 h-4 text-gray-400 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 18L9 12L15 6"/></svg>
      </router-link>
    </div>

    <!-- 管理菜单 -->
    <nav class="flex-1 px-4 py-6">
      <div class="mb-8">
        <p class="text-xs font-medium text-[#9CA3AF] px-3 mb-3 uppercase tracking-wider">小说管理</p>
        <div class="space-y-1">
          <router-link v-for="item in managementNav" :key="item.name" :to="item.path" class="flex items-center gap-3 px-3 py-2.5 text-[#6B7280] hover:bg-gray-100 rounded-lg text-sm transition-colors" active-class="bg-[#4B5563] text-white font-medium">
            <span v-html="item.icon" class="w-5 h-5"></span>
            <span>{{ item.name }}</span>
          </router-link>
        </div>
      </div>

      <div>
        <p class="text-xs font-medium text-[#9CA3AF] px-3 mb-3 uppercase tracking-wider">工具</p>
        <div class="space-y-1">
          <router-link v-for="item in toolsNav" :key="item.name" :to="item.path" class="flex items-center gap-3 px-3 py-2.5 text-[#6B7280] hover:bg-gray-100 rounded-lg text-sm transition-colors" active-class="bg-[#4B5563] text-white font-medium">
            <span v-html="item.icon" class="w-5 h-5"></span>
            <span>{{ item.name }}</span>
          </router-link>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
// 从路由参数获取小说ID，使导航链接动态化
const novelId = route.params.id || 1; // 默认为1，以防万一

// 小说管理菜单项
const managementNav = ref([
  { name: '编辑章节', path: `/novel/editor/${novelId}`, icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>` },
  { name: '大纲视图', path: `/novel/manage/${novelId}/outline`, icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 10V21M3 10L12 3L21 10M3 10H21M12 3V21M8 21V15C8 13.9 8.9 13 10 13H14C15.1 13 16 13.9 16 15V21"/></svg>` },
  { name: '角色设定', path: `/novel/manage/${novelId}/character-settings`, icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>` },
  { name: '世界观', path: `/novel/manage/${novelId}/worldview`, icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>` },
]);

// 工具菜单项
const toolsNav = ref([
  { name: '小说设置', path: `/novel/manage/${novelId}/settings`, icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>` }
]);
</script>

<style scoped>
/* 确保激活链接的文本颜色是白色 */
.router-link-exact-active {
  color: white !important;
}
</style>