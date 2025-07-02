<template>
  <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC]">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-xl font-medium text-[#374151]">回收站</h1>
        <p class="text-sm text-[#9CA3AF] mt-1">项目将在此处保留30天，之后将被永久删除</p>
      </div>
      <button class="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        清空回收站
      </button>
    </div>

    <!-- 已删除项目列表 -->
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <table class="min-w-full divide-y divide-gray-100">
        <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">项目名称</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">类型</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">删除时间</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">剩余天数</th>
          <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
        <tr v-for="item in deletedItems" :key="item.id" class="hover:bg-gray-50/50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#374151]">{{ item.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="item.type.class">
                {{ item.type.text }}
              </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{{ item.deletedDate }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{{ item.daysLeft }} 天</td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-[#3B82F6] hover:text-blue-700 mr-4">恢复</button>
            <button class="text-red-600 hover:text-red-800">永久删除</button>
          </td>
        </tr>
        <tr v-if="deletedItems.length === 0">
          <td colspan="5" class="text-center py-10 text-gray-500">
            回收站是空的
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
    id: 'del-01',
    name: '旧的市场分析报告流程',
    type: { text: '工作流', class: 'bg-blue-100 text-blue-800' },
    deletedDate: '2024-05-18 14:30',
    daysLeft: 27,
  },
  {
    id: 'del-02',
    name: '每日灵感推送（已停用）',
    type: { text: '调度任务', class: 'bg-purple-100 text-purple-800' },
    deletedDate: '2024-05-20 09:00',
    daysLeft: 29,
  },
  {
    id: 'del-03',
    name: '测试变量',
    type: { text: '变量', class: 'bg-orange-100 text-orange-800' },
    deletedDate: '2024-05-21 11:15',
    daysLeft: 30,
  }
]);
</script>