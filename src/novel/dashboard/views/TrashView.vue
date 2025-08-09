<!-- 文件路径: src/novel/dashboard/views/TrashView.vue -->

<template>
  <div class="flex-1 p-8 overflow-auto bg-[#FCFCFC] hide-scrollbar">
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
        <tr v-if="trashStore.trashedItems.length === 0">
          <td colspan="5" class="text-center py-10 text-gray-500">回收站是空的</td>
        </tr>
        <tr v-for="item in trashStore.trashedItems" :key="item.id" class="hover:bg-gray-50/50 transition-colors">
          <td class="px-6 py-4 font-medium text-[#374151] flex items-center gap-3">
            <span class="text-gray-400 w-5 h-5 flex-shrink-0" v-html="item.icon"></span>
            <span>{{ item.name }}</span>
          </td>
          <td class="px-6 py-4 text-[#6B7280]">{{ item.type }}</td>
          <td class="px-6 py-4 text-[#6B7280]">{{ new Date(item.deletedAt).toLocaleString() }}</td>
          <td class="px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="w-full bg-gray-200 rounded-full h-1.5">
                <div class="bg-orange-400 h-1.5 rounded-full" :style="{ width: item.retentionPercent + '%' }"></div>
              </div>
              <span class="text-orange-500 text-xs font-medium w-16 text-right">{{ item.retentionDays }} 天</span>
            </div>
          </td>
          <td class="px-6 py-4 text-right space-x-4">
            <button @click="trashStore.restoreItem(item.id)" class="font-medium text-blue-600 hover:text-blue-800 transition-colors">恢复</button>
            <button @click="trashStore.deleteItemPermanently(item.id)" class="font-medium text-red-600 hover:text-red-800 transition-colors">永久删除</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTrashStore } from '@/novel/dashboard/stores/trashStore';

const trashStore = useTrashStore();

onMounted(() => {
  trashStore.fetchTrashedItems();
});
</script>