<template>
  <div class="flex-1 p-10 overflow-auto bg-gray-50/50">
    <!-- 页面头部 -->
    <div class="mb-10">
      <h1 class="text-2xl font-semibold text-gray-800">早上好, AI Creator</h1>
      <p class="text-gray-500 mt-1">这是您工作流今天的概览。</p>
    </div>

    <div v-if="store.isLoading" class="text-center py-20">
      <p class="text-gray-500">正在加载仪表盘数据...</p>
    </div>

    <div v-else class="space-y-10">
      <!-- 数据统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div v-for="stat in store.stats" :key="stat.label" class="bg-white rounded-xl p-6 border border-gray-100/80 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="getIconBgClass(stat.iconColor)">
              <span v-html="getIconSvg(stat.iconName, stat.iconColor)"></span>
            </div>
            <div class="flex items-center">
              <span v-if="stat.trend" class="text-xs font-medium px-2 py-1 rounded-full" :class="getTrendClasses(stat.trend.direction)">
                {{ stat.trend.value }}
              </span>
              <div v-if="stat.isRealtime" class="flex items-center gap-1.5 ml-2">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span class="text-gray-500 text-xs font-medium">实时</span>
              </div>
            </div>
          </div>
          <p class="text-3xl font-light text-gray-800">
            {{ stat.value }}
            <span v-if="stat.valueSubtext" class="text-xl text-gray-400">{{ stat.valueSubtext }}</span>
          </p>
          <p class="text-sm text-gray-500 mt-1">{{ stat.label }}</p>
          <div v-if="stat.details" class="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 flex justify-between">
            <span>{{ stat.details.label1 }}: <span class="font-semibold text-gray-700">{{ stat.details.value1 }}</span></span>
            <span>{{ stat.details.label2 }}: <span class="font-semibold text-gray-700">{{ stat.details.value2 }}</span></span>
          </div>
          <div v-if="stat.progress" class="mt-4 space-y-2">
            <div class="flex justify-between text-xs font-medium">
              <span class="text-green-600">成功率</span>
              <span class="text-gray-600">{{ stat.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5">
              <div class="bg-green-500 h-1.5 rounded-full" :style="{ width: stat.progress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速操作与最近活动 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- 快速开始 -->
        <div>
          <h3 class="text-base font-semibold text-gray-700 mb-4">快速开始</h3>
          <div class="space-y-3">
            <router-link v-for="action in store.quickStartActions" :key="action.title" :to="action.path" class="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200/80 hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="getIconBgClass(action.iconColor)">
                <span v-html="getIconSvg(action.iconName, action.iconColor)"></span>
              </div>
              <div class="flex-1">
                <p class="font-medium text-gray-800 group-hover:text-blue-700">{{ action.title }}</p>
                <p class="text-sm text-gray-500">{{ action.description }}</p>
              </div>
              <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-transform transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
            </router-link>
          </div>
        </div>

        <!-- 最近使用 -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-semibold text-gray-700">最近使用</h3>
            <router-link to="/workflow/my-flows" class="text-sm font-medium text-blue-600 hover:text-blue-800">查看全部</router-link>
          </div>
          <div class="bg-white rounded-xl border border-gray-100/80 shadow-sm p-2">
            <div v-for="project in store.recentProjects" :key="project.title" class="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50/80">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" :class="getIconBgClass(project.iconColor)">
                <span v-html="getIconSvg(project.iconName, project.iconColor, true)"></span>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-800">{{ project.title }}</p>
                <p class="text-xs text-gray-500">{{ project.details }}</p>
              </div>
              <span class="text-xs text-gray-400">{{ project.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useDashboardStore } from '@/workflow/stores/dashboardStore';
import { TrendDirectionEnum } from '@/workflow/types';
import { iconRegistry, colorMap } from '@/workflow/utils/style-mappers';

const store = useDashboardStore();

onMounted(() => {
  store.loadDashboardData();
});

const getTrendClasses = (direction: TrendDirectionEnum) => {
  if (direction === TrendDirectionEnum.Up) return 'text-green-700 bg-green-100';
  if (direction === TrendDirectionEnum.Down) return 'text-rose-700 bg-rose-100';
  return '';
};

const getIconBgClass = (color: string) => {
  return colorMap[color]?.bg || 'bg-gray-100';
};

const getIconSvg = (name: string, color: string, small: boolean = false) => {
  // Add new history icon if not present in the original registry
  if (!iconRegistry['history']) {
    iconRegistry['history'] = `<svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 4v6h6m-6 0a9 9 0 115.12 8.5M23 20v-6h-6m6 0a9 9 0 10-5.12-8.5"/></svg>`;
  }

  const iconHtml = iconRegistry[name] || '';
  const iconColorClass = colorMap[color]?.text || 'text-gray-600';
  const sizeClass = small ? 'w-4 h-4' : 'w-5 h-5';
  return iconHtml.replace(/class="([^"]*)"/, `class="${sizeClass} ${iconColorClass}"`);
};
</script>