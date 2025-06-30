// =
// 文件: ..\src\novel\views\NovelTrash.vue
//

<template>
  <div class="flex-1 p-8 overflow-auto bg-[#FCFCFC] hide-scrollbar">
    <!-- 提示信息栏 -->
    <div class="flex justify-between items-center mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
      <p class="text-sm text-blue-800 flex items-center gap-2">
        <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
        项目将在回收站中保留30天，之后将被永久删除。
      </p>
      <button class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V7h18v12a2 2 0 01-2 2zM3 7h18M10 12v4M14 12v4M8 7V4a1 1 0 011-1h6a1 1 0 011 1v3"/></svg>
        清空回收站
      </button>
    </div>

    <!-- 表格容器 -->
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <table class="w-full text-sm text-left">
        <thead class="text-xs text-[#6B7280] uppercase bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 font-medium w-2/5">项目名称</th>
          <th scope="col" class="px-6 py-3 font-medium">类型</th>
          <th scope="col" class="px-6 py-3 font-medium">删除时间</th>
          <th scope="col" class="px-6 py-3 font-medium">剩余时间</th>
          <th scope="col" class="px-6 py-3 font-medium text-right">操作</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
        <tr v-for="item in deletedItems" :key="item.id" class="hover:bg-gray-50/50 transition-colors">
          <td class="px-6 py-4 font-medium text-[#374151] flex items-center gap-3">
            <span class="text-gray-400 w-5 h-5 flex-shrink-0" v-html="item.icon"></span>
            <span>{{ item.name }}</span>
          </td>
          <td class="px-6 py-4 text-[#6B7280]">{{ item.type }}</td>
          <td class="px-6 py-4 text-[#6B7280]">{{ item.deletedAt }}</td>
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="w-full bg-gray-200 rounded-full h-1.5">
                <div class="bg-orange-400 h-1.5 rounded-full" :style="{ width: item.retentionPercent + '%' }"></div>
              </div>
              <span class="text-orange-500 text-xs font-medium w-16 text-right">{{ item.retentionDays }} 天</span>
            </div>
          </td>
          <td class="px-6 py-4 text-right space-x-4">
            <button class="font-medium text-blue-600 hover:text-blue-800 transition-colors">恢复</button>
            <button class="font-medium text-red-600 hover:text-red-800 transition-colors">永久删除</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const deletedItems = ref([
  {
    id: 1,
    name: '废弃的赛博朋克大纲',
    type: '小说',
    icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"></path></svg>`,
    deletedAt: '2024-05-20 14:30',
    retentionDays: 28,
    retentionPercent: 93,
  },
  {
    id: 2,
    name: '一个短篇故事',
    type: '章节',
    icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
    deletedAt: '2024-05-18 09:12',
    retentionDays: 26,
    retentionPercent: 87,
  },
  {
    id: 3,
    name: '无题角色设定',
    type: '角色',
    icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`,
    deletedAt: '2024-05-15 22:01',
    retentionDays: 23,
    retentionPercent: 76,
  },
]);
</script>

<style scoped>
/* Scoped styles can be added here if needed, but Tailwind CSS covers most cases. */
</style>