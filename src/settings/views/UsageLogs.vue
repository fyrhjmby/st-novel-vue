<template>
  <main class="flex-1 bg-white flex flex-col">
    <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
      <h1 class="text-lg font-medium text-[#374151]">用量与日志</h1>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button v-for="tab in timeTabs" :key="tab" @click="activeTimeTab = tab" :class="{'bg-white shadow-sm text-[#374151]': activeTimeTab === tab, 'text-[#6B7280]': activeTimeTab !== tab}" class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors">
            {{ tab }}
          </button>
        </div>
        <div class="w-px h-6 bg-gray-200"></div>
        <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          导出报告
        </button>
      </div>
    </header>
    <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-xl p-4 border border-gray-100">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs text-[#9CA3AF]">{{ stat.label }}</p>
            <span v-html="stat.icon"></span>
          </div>
          <p class="text-2xl font-semibold text-[#374151]">{{ stat.value }}</p>
          <div class="mt-2 flex items-center gap-2">
            <div class="flex-1 h-1 bg-gray-200 rounded">
              <div class="h-full rounded" :class="stat.progressColor" :style="{width: stat.progressWidth}"></div>
            </div>
            <span class="text-xs" :class="stat.trendColor">{{ stat.trend }}</span>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-medium text-[#374151]">使用趋势</h3>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-blue-500 rounded"></div>
              <span class="text-xs text-[#6B7280]">请求数</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-purple-500 rounded"></div>
              <span class="text-xs text-[#6B7280]">Token消耗</span>
            </div>
          </div>
        </div>
        <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p class="text-gray-400 text-sm">[交互式图表 - 展示30天使用趋势]</p>
        </div>
      </div>
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4 flex-wrap gap-4">
          <h3 class="text-base font-medium text-[#374151]">API 调用日志</h3>
          <div class="flex items-center gap-3">
            <select class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4B5563] bg-white">
              <option>所有模型</option>
              <option>GPT-4</option>
              <option>Claude 3</option>
            </select>
            <select class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4B5563] bg-white">
              <option>所有状态</option>
              <option>成功</option>
              <option>失败</option>
            </select>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50"><tr class="border-b border-gray-100 text-xs text-[#6B7280]"><th class="py-3 px-4 font-medium">时间戳</th><th class="py-3 px-4 font-medium">端点</th><th class="py-3 px-4 font-medium">模型</th><th class="py-3 px-4 font-medium">Token</th><th class="py-3 px-4 font-medium">状态</th><th class="py-3 px-4 font-medium">耗时</th><th class="py-3 px-4 font-medium">详情</th></tr></thead>
            <tbody>
            <tr v-for="log in logs" :key="log.id" class="border-b border-gray-100 text-[#374151] hover:bg-gray-50">
              <td class="py-3 px-4">{{ log.timestamp }}</td>
              <td class="py-3 px-4 font-mono text-xs">{{ log.endpoint }}</td>
              <td class="py-3 px-4">{{ log.model }}</td>
              <td class="py-3 px-4">{{ log.tokens }}</td>
              <td class="py-3 px-4"><span class="text-xs font-medium px-2 py-1 rounded-full" :class="log.statusClass">{{ log.status }}</span></td>
              <td class="py-3 px-4">{{ log.duration }}</td>
              <td class="py-3 px-4"><a href="#" class="text-[#3B82F6] hover:underline">查看</a></td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <p class="text-sm text-[#6B7280]">显示 1-3 条，共 3 条</p>
          <div class="flex items-center gap-2">
            <button class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50" disabled>上一页</button>
            <button class="px-3 py-1.5 bg-[#4B5563] text-white border border-[#4B5563] rounded-lg text-sm">1</button>
            <button class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50" disabled>下一页</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTimeTab = ref('月');
const timeTabs = ['日', '周', '月'];

const stats = ref([
  { label: '总请求数', value: '12,564', icon: `<svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>`, progressColor: 'bg-blue-500', progressWidth: '75%', trend: '+8.2%', trendColor: 'text-green-600' },
  { label: 'Token 消耗', value: '856K', icon: `<svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>`, progressColor: 'bg-purple-500', progressWidth: '85.6%', trend: '85.6%', trendColor: 'text-[#6B7280]' },
  { label: '平均响应时间', value: '1.2s', icon: `<svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`, progressColor: 'bg-green-500', progressWidth: '25%', trend: '优秀', trendColor: 'text-green-600' },
  { label: '错误率', value: '0.8%', icon: `<svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`, progressColor: 'bg-red-500', progressWidth: '8%', trend: '-0.2%', trendColor: 'text-red-600' },
]);

const logs = ref([
  { id: 1, timestamp: '2024-06-18 10:32:05', endpoint: '/v1/chat/completions', model: 'gpt-4-turbo', tokens: '1,245', status: '200 OK', statusClass: 'bg-green-100 text-green-700', duration: '1.25s' },
  { id: 2, timestamp: '2024-06-18 10:31:50', endpoint: '/v1/chat/completions', model: 'claude-3-opus', tokens: '2,105', status: '200 OK', statusClass: 'bg-green-100 text-green-700', duration: '2.01s' },
  { id: 3, timestamp: '2024-06-18 10:30:12', endpoint: '/v1/chat/completions', model: 'gpt-4-turbo', tokens: '0', status: '400 Error', statusClass: 'bg-red-100 text-red-700', duration: '0.05s' },
]);

</script>