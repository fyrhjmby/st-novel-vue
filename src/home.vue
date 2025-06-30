<template>
  <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] hide-scrollbar">
    <div class="mb-8">
      <h2 class="text-2xl font-light text-[#374151] mb-2">欢迎回来</h2>
      <p class="text-[#6B7280]">今天想创作什么内容？</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 bg-[#F3F4F6] rounded-lg flex items-center justify-center" v-html="stat.icon"></div>
          <span class="text-xs font-medium px-2 py-1 rounded-md" :class="stat.trendClass">{{ stat.trend }}</span>
        </div>
        <p class="text-2xl font-light text-[#374151]">{{ stat.value }}</p>
        <p class="text-sm text-[#9CA3AF] mt-1">{{ stat.label }}</p>
      </div>
    </div>

    <div class="mb-8">
      <h3 class="text-base font-medium text-[#374151] mb-4">快速开始</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button v-for="action in quickStartActions" :key="action.title" class="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm text-left group">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform" :class="action.iconBgClass">
            <span v-html="action.icon" class="w-6 h-6"></span>
          </div>
          <h4 class="font-medium text-[#374151] mb-1">{{ action.title }}</h4>
          <p class="text-sm text-[#9CA3AF]">{{ action.description }}</p>
        </button>
      </div>
    </div>

    <div>
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-medium text-[#374151]">最近项目</h3>
        <button class="text-sm text-[#6B7280] hover:text-[#374151] transition-colors">查看全部 →</button>
      </div>
      <div class="space-y-3">
        <div v-for="project in recentProjects" :key="project.title" class="bg-white rounded-xl p-5 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm flex items-center gap-4">
          <div class="w-14 h-14 rounded-lg flex-shrink-0" :class="project.bgClass"></div>
          <div class="flex-1">
            <h4 class="font-medium text-[#374151]">{{ project.title }}</h4>
            <p class="text-sm text-[#9CA3AF] mt-1">{{ project.details }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full" :class="project.status === '编辑中' ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'"></span>
            <span class="text-sm text-[#9CA3AF]">{{ project.status }}</span>
          </div>
          <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-colors">
            继续
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const stats = ref([
  { label: '作品总数', value: '24', trend: '+12%', trendClass: 'text-[#10B981] bg-green-50', icon: `<svg class="w-5 h-5 text-[#4B5563]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7H15M9 11H15M9 15H13"/></svg>` },
  { label: '总字数', value: '128.5k', trend: '+8%', trendClass: 'text-[#10B981] bg-green-50', icon: `<svg class="w-5 h-5 text-[#4B5563]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20L12 10"/><path d="M18 20L18 4"/><path d="M6 20L6 16"/></svg>` },
  { label: 'AI 使用次数', value: '856', trend: '进行中', trendClass: 'text-[#3B82F6] bg-blue-50', icon: `<svg class="w-5 h-5 text-[#4B5563]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6V12L16 16"/></svg>` },
  { label: '获得赞赏', value: '342', trend: '+24', trendClass: 'text-[#10B981] bg-green-50', icon: `<svg class="w-5 h-5 text-[#4B5563]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61C20.3 4.07 19.5 3.87 18.75 4.12L5.23 8.62C4.34 8.91 3.75 9.76 3.75 10.72C3.75 11.68 4.34 12.53 5.23 12.82L10.5 14.53L12.21 19.8C12.5 20.69 13.35 21.28 14.31 21.28C15.27 21.28 16.12 20.69 16.41 19.8L20.91 6.28C21.16 5.53 20.96 4.73 20.42 4.19L20.84 4.61Z"/></svg>` },
]);

const quickStartActions = ref([
  { title: '创建新作品', description: '开始全新的创作之旅', icon: `<svg class="text-white" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5V19M5 12H19"/></svg>`, iconBgClass: 'bg-[#4B5563]' },
  { title: 'AI 助手', description: '智能创作伴侣', icon: `<svg class="text-[#4B5563]" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/></svg>`, iconBgClass: 'bg-[#F3F4F6]' },
  { title: '导入文档', description: '继续未完成的创作', icon: `<svg class="text-[#4B5563]" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"><path d="M7 18C4.5 18 3 16.5 3 14C3 11.5 5 10 7 10C7.3 10 7.5 10 7.8 10.1C8.5 7.2 11 5 14 5C17.3 5 20 7.7 20 11C20 11.3 20 11.7 19.9 12C21.1 12.5 22 13.6 22 15C22 16.9 20.4 18.5 18.5 18.5"/><path d="M12 13V21M15 16L12 13L9 16"/></svg>`, iconBgClass: 'bg-[#F3F4F6]' }
]);

const recentProjects = ref([
  { title: '星际漫游者', details: '科幻冒险 · 24章 · 2小时前', status: '编辑中', bgClass: 'bg-gradient-to-br from-indigo-100 to-purple-100' },
  { title: '月光下的约定', details: '现代言情 · 18章 · 昨天', status: '暂停', bgClass: 'bg-gradient-to-br from-pink-100 to-rose-100' }
]);
</script>