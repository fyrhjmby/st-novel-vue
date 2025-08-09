<template>
  <main class="flex-1 bg-[#FCFCFC] flex flex-col p-8 overflow-y-auto">
    <header class="mb-8">
      <h1 class="text-2xl font-semibold text-[#374151]">使用统计</h1>
      <p class="text-sm text-[#9CA3AF] mt-1">关于您创建的提示词的整体表现分析</p>
    </header>

    <!-- 总体数据 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in overallStats" :key="stat.label" class="bg-white p-6 rounded-xl border border-gray-100">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4" :class="stat.iconBgClass" v-html="stat.icon"></div>
        <p class="text-3xl font-light text-[#374151]">{{ stat.value }}</p>
        <p class="text-sm text-[#6B7280] mt-1">{{ stat.label }}</p>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-6">
      <!-- 热门提示词 -->
      <div class="col-span-3 lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-4">热门提示词排行 (按使用次数)</h3>
        <div class="space-y-4">
          <div v-for="(prompt, index) in topPromptsByUsage" :key="prompt.id">
            <div class="flex items-center gap-4">
              <span class="text-lg font-semibold text-gray-400 w-6 text-center">{{ index + 1 }}</span>
              <div class="flex-1">
                <p class="font-medium text-sm text-[#374151] truncate">{{ prompt.title }}</p>
                <div class="w-full bg-gray-100 rounded-full h-2 mt-2">
                  <div class="h-2 rounded-full" :class="getBarColor(index)" :style="{ width: prompt.percentage + '%' }"></div>
                </div>
              </div>
              <span class="text-sm font-semibold text-[#374151]">{{ (prompt.usage || 0).toLocaleString() }} 次</span>
            </div>
          </div>
          <div v-if="topPromptsByUsage.length === 0" class="text-center py-8 text-gray-500">
            暂无使用数据
          </div>
        </div>
      </div>

      <!-- 分类统计 -->
      <div class="col-span-3 lg:col-span-1 bg-white p-6 rounded-xl border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-4">分类统计</h3>
        <div class="space-y-5">
          <div v-for="(category, index) in categoryStats" :key="category.tag" class="flex items-center">
            <div class="w-3 h-3 rounded-full mr-3" :class="getBarColor(index)"></div>
            <span class="text-sm text-[#6B7280] flex-1">{{ category.tag }}</span>
            <span class="text-sm font-medium text-[#374151]">{{ category.count }} 个</span>
          </div>
          <div v-if="categoryStats.length === 0" class="text-center py-8 text-gray-500">
            暂无分类数据
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { usePromptStore } from '@/prompt/stores/promptStore';

const promptStore = usePromptStore();

onMounted(() => {
  promptStore.fetchAllPrompts();
});

const myPrompts = computed(() => promptStore.myPrompts);

const overallStats = computed(() => {
  const totalPrompts = myPrompts.value.length;
  const totalUsage = myPrompts.value.reduce((sum, p) => sum + (p.usage || 0), 0);
  const totalLikes = myPrompts.value.reduce((sum, p) => sum + (p.likes || 0), 0);
  const publicCount = myPrompts.value.filter(p => p.status === '公开').length;

  return [
    { label: '提示词总数', value: totalPrompts, iconBgClass: 'bg-blue-100', icon: `<svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>` },
    { label: '总使用次数', value: totalUsage.toLocaleString(), iconBgClass: 'bg-purple-100', icon: `<svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>` },
    { label: '总收藏数', value: totalLikes.toLocaleString(), iconBgClass: 'bg-red-100', icon: `<svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>` },
    { label: '公开分享数', value: publicCount, iconBgClass: 'bg-green-100', icon: `<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"/></svg>` },
  ];
});

const topPromptsByUsage = computed(() => {
  const sorted = [...myPrompts.value].sort((a, b) => (b.usage || 0) - (a.usage || 0));
  const top5 = sorted.slice(0, 5);
  const maxUsage = top5[0]?.usage || 0;

  if (maxUsage === 0) return [];

  return top5.map(p => ({
    ...p,
    percentage: ((p.usage || 0) / maxUsage) * 100
  }));
});

const categoryStats = computed(() => {
  const stats = new Map<string, number>();
  myPrompts.value.forEach(p => {
    stats.set(p.tag, (stats.get(p.tag) || 0) + 1);
  });
  return Array.from(stats, ([tag, count]) => ({ tag, count }))
      .sort((a,b) => b.count - a.count);
});

const barColors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
const getBarColor = (index: number) => {
  return barColors[index % barColors.length];
};
</script>