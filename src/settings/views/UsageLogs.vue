<!-- src/settings/views/UsageLogs.vue -->
<template>
  <main class="flex-1 bg-[var(--color-bg-primary)] flex flex-col">
    <header class="h-20 px-8 flex items-center justify-between border-b border-[var(--color-border-primary)] flex-shrink-0">
      <h1 class="text-lg font-medium text-[var(--color-text-primary)]">用量与日志</h1>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1 bg-[var(--color-bg-muted)] p-1 rounded-lg">
          <button v-for="tab in timeTabs" :key="tab" @click="store.changePeriod(tab)" :class="{'bg-[var(--color-bg-primary)] shadow-sm text-[var(--color-text-primary)]': filters.period === tab, 'text-[var(--color-text-secondary)]': filters.period !== tab}" class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors hover:text-[var(--color-text-primary)]">
            {{ tab }}
          </button>
        </div>
        <button class="px-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] flex items-center gap-2 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          导出报告
        </button>
      </div>
    </header>
    <div v-if="store.isLoading && logs.length === 0" class="flex-1 flex items-center justify-center bg-[var(--color-bg-app)]">
      <p class="text-[var(--color-text-muted)]">加载中...</p>
    </div>
    <div v-else class="flex-1 p-8 overflow-auto bg-[var(--color-bg-app)] space-y-8" :class="{'opacity-50 transition-opacity': store.isLoading}">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="stat in stats" :key="stat.label" class="bg-[var(--color-bg-secondary)] rounded-xl p-5 border border-transparent hover:border-[var(--color-border-primary)] transition-colors">
          <div class="flex items-start justify-between mb-4">
            <p class="text-sm text-[var(--color-text-secondary)]">{{ stat.label }}</p>
            <span v-html="statUIMap[stat.label]?.icon" class="w-6 h-6 text-[var(--color-text-muted)]"></span>
          </div>
          <div class="flex items-baseline gap-2">
            <p class="text-3xl font-semibold text-[var(--color-text-primary)]">{{ stat.value }}</p>
            <div class="flex items-center text-sm" :class="stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'">
              <svg v-if="stat.trend.startsWith('+')" class="w-4 h-4 mr-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
              <svg v-else class="w-4 h-4 mr-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
              <span>{{ stat.trend }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-[var(--color-bg-primary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-medium text-[var(--color-text-primary)]">使用趋势</h3>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <div class="w-2.5 h-2.5 bg-[var(--color-text-accent)] rounded-sm"></div>
              <span class="text-xs text-[var(--color-text-secondary)]">请求数</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2.5 h-2.5 bg-[var(--color-accent-purple)] rounded-sm"></div>
              <span class="text-xs text-[var(--color-text-secondary)]">Token消耗 (k)</span>
            </div>
          </div>
        </div>
        <UsageTrendChart :data="chartData" />
      </div>
      <div class="bg-[var(--color-bg-primary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
        <div class="flex items-center justify-between mb-4 flex-wrap gap-4">
          <h3 class="text-base font-medium text-[var(--color-text-primary)]">API 调用日志</h3>
          <div class="flex items-center gap-3">
            <select :value="filters.model" @change="store.changeFilter({ model: ($event.target as HTMLSelectElement).value })" class="form-select-styled px-3 py-2 border border-[var(--color-border-primary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] transition-colors">
              <option>所有模型</option>
              <option>gpt-4-turbo</option>
              <option>claude-3-opus</option>
              <option>gemini-pro</option>
            </select>
            <select :value="filters.status" @change="store.changeFilter({ status: ($event.target as HTMLSelectElement).value })" class="form-select-styled px-3 py-2 border border-[var(--color-border-primary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] transition-colors">
              <option>所有状态</option>
              <option>成功</option>
              <option>失败</option>
            </select>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="border-b border-[var(--color-border-primary)]"><tr class="text-xs text-[var(--color-text-muted)] uppercase tracking-wider"><th class="py-3 px-5 font-medium">时间戳</th><th class="py-3 px-5 font-medium">端点</th><th class="py-3 px-5 font-medium">模型</th><th class="py-3 px-5 font-medium">Token</th><th class="py-3 px-5 font-medium">状态</th><th class="py-3 px-5 font-medium">耗时</th><th class="py-3 px-5 font-medium"></th></tr></thead>
            <tbody>
            <template v-if="logs.length > 0">
              <tr v-for="log in logs" :key="log.id" class="border-b border-[var(--color-border-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] transition-colors">
                <td class="py-4 px-5">{{ log.timestamp }}</td>
                <td class="py-4 px-5 font-mono text-xs">{{ log.endpoint }}</td>
                <td class="py-4 px-5">{{ log.model }}</td>
                <td class="py-4 px-5">{{ log.tokens }}</td>
                <td class="py-4 px-5">
                  <span class="status-pill" :class="log.status === '成功' ? 'status-pill-success' : 'status-pill-error'">
                    {{ log.status }}
                  </span>
                </td>
                <td class="py-4 px-5">{{ log.duration }}</td>
                <td class="py-4 px-5 text-right"><a href="#" class="font-medium text-[var(--color-text-accent)] hover:underline">查看</a></td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="7" class="text-center py-12 text-[var(--color-text-muted)]">
                没有找到匹配的日志记录。
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-6 flex items-center justify-between">
          <p class="text-sm text-[var(--color-text-secondary)]">
            显示第 {{ (pagination.currentPage - 1) * pagination.limit + 1 }} - {{ Math.min(pagination.currentPage * pagination.limit, pagination.totalLogs) }} 条，共 {{ pagination.totalLogs }} 条
          </p>
          <div class="flex items-center gap-2">
            <button @click="store.changePage(pagination.currentPage - 1)" class="px-3 py-2 border border-[var(--color-border-primary)] rounded-lg text-sm hover:bg-[var(--color-bg-tertiary)] disabled:opacity-50 transition-colors" :disabled="pagination.currentPage <= 1">上一页</button>
            <button @click="store.changePage(pagination.currentPage + 1)" class="px-3 py-2 border border-[var(--color-border-primary)] rounded-lg text-sm hover:bg-[var(--color-bg-tertiary)] disabled:opacity-50 transition-colors" :disabled="pagination.currentPage >= pagination.totalPages">下一页</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUsageLogsStore } from '@/settings/stores/usageLogsStore';
import UsageTrendChart from '@/settings/components/UsageTrendChart.vue';

const store = useUsageLogsStore();
const { stats, logs, filters, pagination, chartData } = storeToRefs(store);

const timeTabs: ('日' | '周' | '月')[] = ['日', '周', '月'];

const statUIMap: Record<string, { icon: string }> = {
  '本月请求数': { icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>` },
  '本月Token消耗': { icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 7v10m0 0h16M4 7l8 8 8-8M4 7h16"></path></svg>` },
  '平均响应时间': { icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>` },
  '请求成功率': { icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>` },
};

onMounted(() => {
  store.fetchUsageData();
});

</script>

<style scoped>
@import '../style.css';
</style>