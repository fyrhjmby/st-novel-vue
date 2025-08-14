<template>
  <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC]">
    <!-- 页面操作栏 (原Header内容) -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-8">
        <div class="flex items-center bg-[#F3F4F6] rounded-lg p-1 text-sm">
          <button class="px-3 py-1 rounded-md text-[#6B7280]">今日</button>
          <button class="px-3 py-1 rounded-md bg-white shadow-sm text-[#374151]">本周</button>
          <button class="px-3 py-1 rounded-md text-[#6B7280]">本月</button>
          <button class="px-3 py-1 rounded-md text-[#6B7280]">自定义</button>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="relative">
          <input type="text" placeholder="搜索工作流..."
                 class="w-64 pl-10 pr-4 py-2 text-sm bg-[#F3F4F6] border border-transparent rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all">
          <svg class="w-5 h-5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21L16.65 16.65"/>
          </svg>
        </div>
        <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg class="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
          </svg>
        </button>
        <button class="px-4 py-2 bg-[#374151] text-white rounded-lg text-sm font-medium hover:bg-[#1F2937] transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5V19M5 12H19"/>
          </svg>
          创建工作流
        </button>
      </div>
    </div>

    <div v-if="store.isLoading" class="text-center py-20">
      <p class="text-gray-500">正在加载仪表盘数据...</p>
    </div>

    <div v-else>
      <!-- 增强的数据统计卡片 -->
      <div class="grid grid-cols-4 gap-6 mb-8">
        <div v-for="stat in store.stats" :key="stat.label" class="bg-white rounded-xl p-6 border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="getIconBgClass(stat.iconColor)">
              <span v-html="getIconSvg(stat.iconName, stat.iconColor)"></span>
            </div>
            <span v-if="stat.trend" class="text-xs font-medium px-2 py-1 rounded-full" :class="getTrendClasses(stat.trend.direction)">
              {{ stat.trend.value }}
            </span>
            <div v-if="stat.isRealtime" class="flex items-center gap-1">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-gray-500 text-xs">实时</span>
            </div>
          </div>
          <p class="text-2xl font-light text-[#374151]">
            {{ stat.value }}
            <span v-if="stat.valueSubtext" class="text-lg text-gray-400">{{ stat.valueSubtext }}</span>
          </p>
          <p class="text-sm text-[#9CA3AF] mt-1">{{ stat.label }}</p>
          <div v-if="stat.details" class="mt-4 text-xs text-gray-500 flex justify-between">
            <span>{{ stat.details.label1 }}: {{ stat.details.value1 }}</span>
            <span>{{ stat.details.label2 }}: {{ stat.details.value2 }}</span>
          </div>
          <div v-if="stat.chart" class="mt-4 flex items-end gap-1 h-8">
            <div v-for="(bar, index) in stat.chart" :key="index" class="flex-1 chart-bar rounded-sm" :style="{ height: bar }"></div>
          </div>
          <div v-if="stat.progress" class="mt-4 space-y-1">
            <div class="flex justify-between text-xs">
              <span class="text-green-600">成功</span>
              <span class="text-gray-500">{{ stat.progress }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1">
              <div class="bg-green-500 h-1 rounded-full" :style="{ width: stat.progress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 快速操作区域 -->
      <div class="mb-8">
        <h3 class="text-sm font-medium text-[#374151] mb-4">快速开始</h3>
        <div class="grid grid-cols-4 gap-4">
          <button v-for="action in store.quickStartActions" :key="action.title" class="bg-white rounded-lg p-4 border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all text-center">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2" :class="getIconBgClass(action.iconColor)">
              <span v-html="getIconSvg(action.iconName, action.iconColor)"></span>
            </div>
            <span class="text-sm text-[#374151]">{{ action.title }}</span>
          </button>
        </div>
      </div>

      <!-- 最近使用的工作流 -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-[#374151]">最近使用</h3>
          <a href="#" class="text-sm text-[#3B82F6] hover:text-blue-700">查看全部</a>
        </div>
        <div class="grid grid-cols-4 gap-4">
          <div v-for="project in store.recentProjects" :key="project.title" class="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-md">
            <div class="flex items-center justify-between mb-3">
              <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="getIconBgClass(project.iconColor, true)">
                <span v-html="getIconSvg(project.iconName, project.iconColor, true)"></span>
              </div>
              <span class="text-xs text-gray-400">{{ project.time }}</span>
            </div>
            <p class="text-sm font-medium text-[#374151] mb-1">{{ project.title }}</p>
            <p class="text-xs text-[#9CA3AF]">{{ project.details }}</p>
          </div>
        </div>
      </div>

      <!-- 所有工作流列表 -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-[#374151]">所有工作流</h3>
          <div class="flex items-center gap-2">
            <button class="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18"/></svg></button>
            <button class="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg></button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="flow in store.allWorkflows" :key="flow.title" class="bg-white rounded-xl p-5 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-md flex flex-col">
            <div class="flex items-start justify-between mb-3">
              <h3 class="font-medium text-[#374151] leading-tight">{{ flow.title }}</h3>
              <span class="flex-shrink-0 flex items-center gap-1.5 text-xs px-2 py-1 rounded-full" :class="getWorkflowStatusClasses(flow.status).badge">
                <span class="w-2 h-2 rounded-full" :class="getWorkflowStatusClasses(flow.status).dot"></span>
                {{ getWorkflowStatusClasses(flow.status).text }}
              </span>
            </div>
            <p class="text-sm text-[#9CA3AF] mb-4 flex-1">{{ flow.description }}</p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-for="tag in flow.tags" :key="tag" class="text-xs text-[#4B5563] bg-[#F3F4F6] px-2 py-1 rounded-md">{{ tag }}</span>
            </div>
            <div class="flex items-center gap-4 text-xs text-[#9CA3AF] mb-4 border-t border-gray-100 pt-3">
              <span class="flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>{{ flow.usage }}</span>
              <span class="flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>{{ flow.successRate }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-xs text-[#9CA3AF]">{{ flow.updated }}</div>
              <div class="flex items-center gap-1">
                <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors"><svg class="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z"/></svg></button>
                <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors"><svg class="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg></button>
                <button class="px-4 py-2 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-[#374151] transition-colors">运行</button>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-xl p-5 border border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-center text-center">
            <div class="text-gray-500 hover:text-blue-600">
              <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              <span class="font-medium">创建新工作流</span>
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
import { TrendDirectionEnum, WorkflowStatusEnum } from '@/workflow/types';
import { iconRegistry, colorMap } from '@/workflow/utils/style-mappers';

const store = useDashboardStore();

onMounted(() => {
  store.loadDashboardData();
});

const getTrendClasses = (direction: TrendDirectionEnum) => {
  if (direction === TrendDirectionEnum.Up) return 'text-[#10B981] bg-green-50';
  if (direction === TrendDirectionEnum.Down) return 'text-rose-600 bg-rose-50';
  return '';
};

const getIconBgClass = (color: string, small: boolean = false) => {
  const baseClass = colorMap[color]?.bg || 'bg-gray-100';
  // The recent projects section seems to have a slightly different design in the original mock.
  // If we wanted to replicate it perfectly, we could add logic here. For now, we'll keep it consistent.
  return baseClass;
};

const getIconSvg = (name: string, color: string, small: boolean = false) => {
  const iconHtml = iconRegistry[name] || '';
  const iconColorClass = colorMap[color]?.text || 'text-gray-600';
  const sizeClass = small ? 'w-4 h-4' : 'w-5 h-5';
  // Use regex to replace class attribute, making it more robust.
  return iconHtml.replace(/class="([^"]*)"/, `class="${sizeClass} ${iconColorClass}"`);
};

const getWorkflowStatusClasses = (status: WorkflowStatusEnum) => {
  switch (status) {
    case WorkflowStatusEnum.Published:
      return { text: '已发布', badge: 'bg-green-100 text-green-800', dot: 'bg-green-500' };
    case WorkflowStatusEnum.Draft:
      return { text: '草稿', badge: 'bg-gray-100 text-gray-800', dot: 'bg-gray-400' };
    case WorkflowStatusEnum.Archived:
      return { text: '已归档', badge: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' };
    default:
      return { text: '未知', badge: 'bg-gray-100 text-gray-800', dot: 'bg-gray-400' };
  }
};
</script>