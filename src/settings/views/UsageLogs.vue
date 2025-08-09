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
              <td class="py-3 px-4"><span class="text-xs font-medium px-2 py-1 rounded-full" :class="log.statusClass">{{ log.status }}</span></td>
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