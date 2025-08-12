<!-- src/settings/views/UsageLogs.vue -->
<template>
  <main class="flex-1 bg-white flex flex-col">
    <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
      <h1 class="text-lg font-medium text-[#374151]">用量与日志</h1>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <button v-for="tab in timeTabs" :key="tab" @click="store.changePeriod(tab)" :class="{'bg-white shadow-sm text-[#374151]': filters.period === tab, 'text-[#6B7280]': filters.period !== tab}" class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors">
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
    <div v-if="store.isLoading && logs.length === 0" class="flex-1 flex items-center justify-center bg-[#FCFCFC]">
      <p>加载中...</p>
    </div>
    <div v-else class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] space-y-6" :class="{'opacity-50': store.isLoading}">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-xl p-4 border border-gray-100">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs text-[#9CA3AF]">{{ stat.label }}</p>
            <span v-html="statUIMap[stat.label]?.icon" class="w-5 h-5 text-gray-500"></span>
          </div>
          <p class="text-2xl font-semibold text-[#374151]">{{ stat.value }}</p>
          <div class="mt-2 flex items-center text-xs" :class="stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'">
            <svg v-if="stat.trend.startsWith('+')" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            <span>{{ stat.trend }}</span>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-medium text-[#374151]">使用趋势</h3>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-blue-500 rounded-sm"></div>
              <span class="text-xs text-[#6B7280]">请求数</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-purple-500 rounded-sm"></div>
              <span class="text-xs text-[#6B7280]">Token消耗 (k)</span>
            </div>
          </div>
        </div>
        <UsageTrendChart :data="chartData" />
      </div>
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4 flex-wrap gap-4">
          <h3 class="text-base font-medium text-[#374151]">API 调用日志</h3>
          <div class="flex items-center gap-3">
            <select v-model="modelFilter" class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4B5563] bg-white">
              <option>所有模型</option>
              <option>gpt-4-turbo</option>
              <option>claude-3-opus</option>
              <option>gemini-pro</option>
            </select>
            <select v-model="statusFilter" class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4B5563] bg-white">
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
              <td class="py-3 px-4">
                <span class="text-xs font-medium px-2 py-1 rounded-full" :class="log.status === '成功' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ log.status }}
                </span>
              </td>
              <td class="py-3 px-4">{{ log.duration }}</td>
              <td class="py-3 px-4"><a href="#" class="text-[#3B82F6] hover:underline">查看</a></td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-4 flex items-center justify-between">
          <p class="text-sm text-[#6B7280]">
            显示第 {{ (pagination.currentPage - 1) * pagination.limit + 1 }} - {{ Math.min(pagination.currentPage * pagination.limit, pagination.totalLogs) }} 条，共 {{ pagination.totalLogs }} 条
          </p>
          <div class="flex items-center gap-2">
            <button @click="store.changePage(pagination.currentPage - 1)" class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50" :disabled="pagination.currentPage <= 1">上一页</button>
            <button @click="store.changePage(pagination.currentPage + 1)" class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50" :disabled="pagination.currentPage >= pagination.totalPages">下一页</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useUsageLogsStore } from '@/settings/stores/usageLogsStore';
import UsageTrendChart from '@/settings/components/UsageTrendChart.vue';

const store = useUsageLogsStore();
const { stats, logs, filters, pagination, chartData } = storeToRefs(store);

const timeTabs: ('日' | '周' | '月')[] = ['日', '周', '月'];

const modelFilter = ref(filters.value.model);
const statusFilter = ref(filters.value.status);

const statUIMap: Record<string, { icon: string }> = {
  '本月请求数': { icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>` },
  '本月Token消耗': { icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 7v10m0 0h16M4 7l8 8 8-8M4 7h16"></path></svg>` },
  '平均响应时间': { icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>` },
  '请求成功率': { icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>` },
};

watch(modelFilter, (newValue) => {
  store.changeFilter({ model: newValue });
});

watch(statusFilter, (newValue) => {
  store.changeFilter({ status: newValue });
});

onMounted(() => {
  store.fetchUsageData();
});

</script>