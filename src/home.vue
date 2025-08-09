<template>
  <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] hide-scrollbar">
    <div class="mb-8">
      <h2 class="text-2xl font-light text-[#374151] mb-2">欢迎回来</h2>
      <p class="text-[#6B7280]">今天想创作什么内容？</p>
    </div>

    <!-- 统计卡片 -->
    <div class="mb-8">
      <StatsCards :stats="stats" />
    </div>

    <!-- 快速开始 -->
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

    <!-- 最近项目 -->
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
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDashboardStore } from '@/home/stores/dashboardStore';
import StatsCards from '@/home/components/StatsCards.vue';

const dashboardStore = useDashboardStore();
const { stats, quickStartActions, recentProjects } = storeToRefs(dashboardStore);

onMounted(() => {
  dashboardStore.fetchDashboardData();
});
</script>