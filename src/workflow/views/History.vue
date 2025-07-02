<template>
  <div class="flex-1 overflow-auto bg-[#FCFCFC] p-8">
    <!-- 页面操作/筛选栏 (原Header内容) -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-lg font-medium text-[#374151]">运行历史</h1>
      <div class="flex items-center gap-3">
        <select class="text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all py-2 px-3"><option>所有工作流</option><option>社交媒体帖子生成器</option><option>公司周报摘要</option></select>
        <select class="text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all py-2 px-3"><option>所有状态</option><option>成功</option><option>失败</option><option>运行中</option><option>已取消</option></select>
        <input type="date" class="text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all py-2 px-3 text-[#6B7280]">
        <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          导出
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg p-4 border border-gray-100">
        <p class="text-2xl font-light text-[#374151]">156</p>
        <p class="text-sm text-[#9CA3AF] mt-1">总执行次数</p>
      </div>
      <div class="bg-white rounded-lg p-4 border border-gray-100">
        <p class="text-2xl font-light text-green-600">148</p>
        <p class="text-sm text-[#9CA3AF] mt-1">成功次数</p>
      </div>
      <div class="bg-white rounded-lg p-4 border border-gray-100">
        <p class="text-2xl font-light text-[#374151]">94.8%</p>
        <p class="text-sm text-[#9CA3AF] mt-1">成功率</p>
      </div>
      <div class="bg-white rounded-lg p-4 border border-gray-100">
        <p class="text-2xl font-light text-[#374151]">12.5s</p>
        <p class="text-sm text-[#9CA3AF] mt-1">平均耗时</p>
      </div>
    </div>

    <!-- 历史记录表格 -->
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <table class="min-w-full divide-y divide-gray-100">
        <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">运行 ID</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">工作流名称</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">触发方式</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">开始时间</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">持续时间</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">状态</th>
          <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
        <tr v-for="run in runHistory" :key="run.id" class="hover:bg-gray-50/50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280] font-mono">{{ run.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#374151]">{{ run.workflowName }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                                <span class="flex items-center gap-1">
                                    <span v-html="run.trigger.icon"></span>
                                    {{ run.trigger.text }}
                                </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{{ run.startTime }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{{ run.duration }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full" :class="run.status.class">
                                    <span v-if="run.status.icon" v-html="run.status.icon" class="mr-1"></span>
                                    {{ run.status.text }}
                                </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-[#3B82F6] hover:text-blue-700 mr-3">{{ run.primaryAction }}</button>
            <button v-if="run.secondaryAction" class="text-[#3B82F6] hover:text-blue-700 mr-3">{{ run.secondaryAction }}</button>
            <button class="text-gray-400 hover:text-gray-600 inline-block align-middle">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
            </button>
          </td>
        </tr>
        </tbody>
      </table>

      <div class="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-100">
        <div class="text-sm text-gray-500">
          显示第 <span class="font-medium text-gray-700">1</span> 到 <span class="font-medium text-gray-700">5</span> 条，共 <span class="font-medium text-gray-700">156</span> 条记录
        </div>
        <div class="flex items-center gap-2">
          <button class="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100">上一页</button>
          <button class="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100">下一页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const runHistory = ref([
  {
    id: '#f8a1b3',
    workflowName: '社交媒体帖子生成器',
    trigger: { text: '手动', icon: '<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>' },
    startTime: '2024-05-20 10:30',
    duration: '12.5s',
    status: { text: '成功', class: 'bg-green-100 text-green-800' },
    primaryAction: '查看详情',
  },
  {
    id: '#e7b2c4',
    workflowName: '公司周报摘要',
    trigger: { text: '定时', icon: '<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>' },
    startTime: '2024-05-20 09:15',
    duration: '45.2s',
    status: { text: '失败', class: 'bg-red-100 text-red-800' },
    primaryAction: '查看日志',
    secondaryAction: '重试'
  },
  {
    id: '#d6c3d5',
    workflowName: '小说角色生成器',
    trigger: { text: 'API', icon: '<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>' },
    startTime: '2024-05-19 18:45',
    duration: '8.1s',
    status: { text: '成功', class: 'bg-green-100 text-green-800' },
    primaryAction: '查看详情',
  },
  {
    id: '#c5d4e6',
    workflowName: '社交媒体帖子生成器',
    trigger: { text: '手动', icon: '<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>' },
    startTime: '2024-05-19 14:20',
    duration: '1.2s',
    status: { text: '已取消', class: 'bg-yellow-100 text-yellow-800' },
    primaryAction: '查看详情',
  },
  {
    id: '#b4d5f7',
    workflowName: '数据分析报告',
    trigger: { text: 'Webhook', icon: '<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>' },
    startTime: '2024-05-19 11:30',
    duration: '23.7s',
    status: { text: '运行中', class: 'bg-blue-100 text-blue-800', icon: '<svg class="animate-spin h-3 w-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>' },
    primaryAction: '实时监控',
    secondaryAction: '停止'
  },
]);
</script>