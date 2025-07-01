<template>
  <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100 bg-white flex-shrink-0">
    <div class="flex items-center gap-8">
      <h1 class="text-lg font-medium text-[#374151]">工作流仪表盘</h1>
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
  </header>

  <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC]">
    <!-- 增强的数据统计卡片 -->
    <div class="grid grid-cols-4 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="stat.iconBgClass">
            <span v-html="stat.icon"></span>
          </div>
          <span v-if="stat.trend" class="text-xs font-medium px-2 py-1 rounded-full" :class="stat.trendClass" v-html="stat.trend"></span>
        </div>
        <p class="text-2xl font-light text-[#374151]" v-html="stat.value"></p>
        <p class="text-sm text-[#9CA3AF] mt-1">{{ stat.label }}</p>
        <div v-if="stat.subtext" class="mt-4 text-xs text-gray-500" v-html="stat.subtext"></div>
        <div v-else-if="stat.chart" class="mt-4 flex items-end gap-1 h-8">
          <div v-for="(bar, index) in stat.chart" :key="index" class="flex-1 chart-bar rounded-sm" :style="{ height: bar }"></div>
        </div>
        <div v-else-if="stat.progress" class="mt-4 space-y-1">
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
        <button v-for="action in quickStartActions" :key="action.title" class="bg-white rounded-lg p-4 border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all text-center">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-2" :class="action.bgClass">
            <span v-html="action.icon"></span>
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
        <div v-for="project in recentProjects" :key="project.title" class="bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-md">
          <div class="flex items-center justify-between mb-3">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="project.iconBgClass">
              <span v-html="project.icon"></span>
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
          <button class="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 4h18M3 8h18M3 12h18M3 16h18M3 20h18"/></svg>
          </button>
          <button class="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="flow in allWorkflows" :key="flow.title" class="bg-white rounded-xl p-5 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-md flex flex-col">
          <div class="flex items-start justify-between mb-3">
            <h3 class="font-medium text-[#374151] leading-tight">{{ flow.title }}</h3>
            <span class="flex-shrink-0 flex items-center gap-1.5 text-xs px-2 py-1 rounded-full" :class="flow.status.class">
                            <span class="w-2 h-2 rounded-full" :class="flow.status.dotClass"></span>
                            {{ flow.status.text }}
                        </span>
          </div>
          <p class="text-sm text-[#9CA3AF] mb-4 flex-1">{{ flow.description }}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="tag in flow.tags" :key="tag" class="text-xs text-[#4B5563] bg-[#F3F4F6] px-2 py-1 rounded-md">{{ tag }}</span>
          </div>
          <div class="flex items-center gap-4 text-xs text-[#9CA3AF] mb-4 border-t border-gray-100 pt-3">
                        <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            {{ flow.usage }}
                        </span>
            <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            {{ flow.successRate }}
                        </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="text-xs text-[#9CA3AF]">{{ flow.updated }}</div>
            <div class="flex items-center gap-1">
              <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z"/></svg>
              </button>
              <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg class="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              </button>
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
</template>

<script setup lang="ts">
import { ref } from 'vue';

const stats = ref([
  {
    label: '工作流总数',
    value: '12',
    trend: '+8%',
    trendClass: 'text-[#10B981] bg-green-50',
    icon: `<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 3V15M9 15L5 11M9 15L13 11"/><path d="M15 21V9M15 9L19 13M15 9L11 13"/></svg>`,
    iconBgClass: 'bg-blue-50',
    chart: ['40%', '60%', '45%', '80%', '70%', '100%']
  },
  {
    label: '执行次数',
    value: '156 <span class="text-lg text-gray-400">/ 24h</span>',
    trend: `<div class="flex items-center gap-1"><div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span class="text-gray-500">实时</span></div>`,
    trendClass: '',
    icon: `<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6V12L16 16"/></svg>`,
    iconBgClass: 'bg-green-50',
    subtext: `<span>当前运行: 3</span><span class="mx-1">•</span><span>队列中: 7</span>`
  },
  {
    label: '平均成功率',
    value: '98.5%',
    trend: null,
    icon: `<svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20L12 10"/><path d="M18 20L18 4"/><path d="M6 20L6 16"/></svg>`,
    iconBgClass: 'bg-indigo-50',
    progress: 98.5
  },
  {
    label: '平均执行时间',
    value: '~12.3s',
    trend: '-15%',
    trendClass: 'text-rose-600 bg-rose-50',
    icon: `<svg class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
    iconBgClass: 'bg-rose-50',
    subtext: `<span>最快: 3.2s</span><span class="mx-1">•</span><span>最慢: 45.6s</span>`
  },
]);

const quickStartActions = ref([
  { title: '创建工作流', icon: `<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>`, bgClass: 'bg-blue-50'},
  { title: '导入工作流', icon: `<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>`, bgClass: 'bg-green-50'},
  { title: '复制模板', icon: `<svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`, bgClass: 'bg-indigo-50'},
  { title: '管理变量', icon: `<svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>`, bgClass: 'bg-amber-50'}
]);

const recentProjects = ref([
  { title: '社交媒体帖子', details: '执行 23 次', time: '5分钟前', icon: `<svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>`, iconBgClass: 'bg-blue-100' },
  { title: '周报生成器', details: '执行 8 次', time: '2小时前', icon: `<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`, iconBgClass: 'bg-green-100' },
]);

const allWorkflows = ref([
  {
    title: '社交媒体帖子生成器',
    description: '自动从核心主题生成适用于多平台的帖子内容。',
    tags: ['内容生成', '社交媒体'],
    status: { text: '已发布', class: 'text-[#10B981] bg-green-50', dotClass: 'bg-[#10B981]' },
    usage: '23次/天',
    successRate: '98%成功',
    updated: '2天前更新'
  },
  {
    title: '公司周报摘要',
    description: '上传多个文档，自动提取关键信息生成周报。',
    tags: ['文档处理', '信息提取'],
    status: { text: '草稿', class: 'text-[#6B7280] bg-gray-100', dotClass: 'bg-[#9CA3AF]' },
    usage: '8次/周',
    successRate: '100%成功',
    updated: '5小时前编辑'
  }
]);

</script>