<template>
  <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC]">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-xl font-medium text-[#374151]">调度任务</h1>
        <p class="text-sm text-[#9CA3AF] mt-1">管理按计划自动运行的工作流</p>
      </div>
      <button class="px-4 py-2 bg-[#374151] text-white rounded-lg text-sm font-medium hover:bg-[#1F2937] transition-colors flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
        创建调度任务
      </button>
    </div>
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <table class="min-w-full divide-y divide-gray-100">
        <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">目标工作流</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">调度规则</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">下次运行时间</th>
          <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
        <tr v-if="store.isLoading">
          <td colspan="5" class="text-center py-10 text-gray-500">正在加载调度任务...</td>
        </tr>
        <tr v-else-if="store.schedules.length === 0">
          <td colspan="5" class="text-center py-10 text-gray-500">没有调度任务</td>
        </tr>
        <tr v-else v-for="schedule in store.schedules" :key="schedule.id" class="hover:bg-gray-50/50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap">
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" :checked="schedule.status === 'enabled'" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span class="ms-3 text-sm font-medium" :class="schedule.status === 'enabled' ? 'text-green-600' : 'text-gray-500'">
                {{ schedule.status === 'enabled' ? '启用中' : '已禁用' }}
              </span>
            </label>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-[#374151]">{{ schedule.workflowName }}</div>
            <div class="text-xs text-[#9CA3AF] mt-1 font-mono">ID: {{ schedule.workflowId }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-[#374151]">{{ schedule.schedule.description }}</div>
            <div class="text-xs text-gray-500 font-mono mt-1">{{ schedule.schedule.cron }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
            {{ schedule.nextRun }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-[#3B82F6] hover:text-blue-700 mr-4">立即运行</button>
            <button class="text-[#3B82F6] hover:text-blue-700 mr-4">编辑</button>
            <button class="text-red-600 hover:text-red-800">删除</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useSchedulesStore } from '@/workflow/stores/schedulesStore';

const store = useSchedulesStore();

onMounted(() => {
  store.loadSchedules();
});
</script>