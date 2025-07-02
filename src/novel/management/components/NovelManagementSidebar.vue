<template>
  <aside class="w-64 bg-[#FAFAFA] border-r border-gray-100 flex flex-col flex-shrink-0">
    <!-- 顶部小说信息区域 -->
    <div class="p-4 space-y-4 border-b border-gray-100 h-20 flex items-center">
      <router-link to="/novel/manage/outline" class="flex items-center gap-3 px-2 group w-full">
        <div class="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 group-hover:scale-105 transition-transform">
          <svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/></svg>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-medium text-[#374151] text-sm truncate">星际漫游者</h3>
          <p class="text-xs text-[#9CA3AF] truncate">科幻 • 编辑中</p>
        </div>
        <router-link to="/novel/dashboard" @click.stop class="w-4 h-4 text-gray-400 group-hover:-translate-x-1 transition-transform">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 18L9 12L15 6"/></svg>
        </router-link>
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

// [重构] "编辑章节"的路径现在明确指向新的静态路由
const managementNav = ref([
  { name: '编辑章节', path: `/novel/editor`, icon: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>` },
  { name: '大纲视图', path: `/novel/manage/outline`, icon: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>` },
  { name: '角色设定', path: `/novel/manage/character-settings`, icon: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-2.438c.155-.19.315-.386.44-1.251l-2.07-1.758a4.5 4.5 0 00-6.364-6.364l-2.07-1.758a9.337 9.337 0 00-4.12 2.438c-1.128 1.406-1.666 3.146-1.666 4.884 0 1.738.538 3.478 1.666 4.884a9.337 9.337 0 004.12 2.438zM15 19.128L12 12.586l-3 3.001" /></svg>` },
  { name: '世界观', path: `/novel/manage/worldview`, icon: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c1.356 0 2.673-.174 3.946-.512M12 21c-1.356 0-2.673-.174-3.946-.512M12 3a9.004 9.004 0 00-8.716 6.747M12 3a9.004 9.004 0 018.716 6.747M12 3c1.356 0 2.673.174 3.946.512M12 3c-1.356 0-2.673-.174-3.946-.512M3.284 15.842a9.002 9.002 0 000-7.684M20.716 15.842a9.002 9.002 0 000-7.684" /></svg>` },
]);

const toolsNav = ref([
  { name: '上下文管理', path: `/novel/manage/context`, icon: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-1.621A3 3 0 0113.5 18.257V17.25m6-3.75V17.25a3 3 0 01-3 3h-6a3 3 0 01-3-3V13.5m12-3V10.5a3 3 0 00-3-3h-6a3 3 0 00-3 3v3.75m12-3V6.75a3 3 0 00-3-3h-6a3 3 0 00-3 3v6.75" /></svg>` },
  { name: '小说设置', path: `/novel/manage/settings`, icon: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-.95.542.057 1.007.56 1.061 1.11L12 8.583l.235-3.535c.057-.542.56-1.007 1.11-.95.542.057 1.007.56 1.061 1.11L15.417 8.583l3.536-.235c.542-.057 1.007.56 1.061 1.11.057.542-.42 1.007-.95 1.061l-3.536.235.235 3.536c.057.542-.42 1.007-.95 1.061-.542.057-1.007-.42-1.061-.95L12 15.417l-.235 3.536c-.057.542-.56 1.007-1.11.95-.542-.057-1.007-.56-1.061-1.11L9.417 15.417l-3.536.235c-.542-.057-1.007-.42-.95-1.061.057-.542.42-1.007.95-1.061l3.536-.235L9.417 8.583z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 14.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" /></svg>` },
  { name: '版本历史', path: `/novel/manage/history`, icon: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.667 0l3.181-3.183m-4.991-2.691v4.992h-4.992m0 0l-3.181-3.183a8.25 8.25 0 0111.667 0l3.181 3.183" /></svg>` },
  { name: '导出', path: `/novel/manage/export`, icon: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>` },
]);
</script>

<style scoped>
.router-link-active.router-link-exact-active {
  color: white !important;
}
</style>