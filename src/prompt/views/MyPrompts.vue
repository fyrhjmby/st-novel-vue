<template>
  <main class="flex-1 bg-white flex flex-col">
    <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100">
      <h1 class="text-lg font-medium text-[#374151]">我的提示词</h1>
      <button class="px-5 py-2.5 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-[#374151] transition-colors flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
        <span>创建新提示词</span>
      </button>
    </header>
    <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC]">
      <!-- 统计概览 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-xl p-5 border border-gray-100">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="stat.iconBgClass" v-html="stat.icon"></div>
            <span class="text-xs font-medium px-2 py-1 rounded-full" :class="stat.trendClass" >{{ stat.trend }}</span>
          </div>
          <p class="text-2xl font-light text-[#374151]">{{ stat.value }}</p>
          <p class="text-sm text-[#9CA3AF] mt-1">{{ stat.label }}</p>
        </div>
      </div>

      <!-- 筛选和视图切换 -->
      <div class="bg-white rounded-xl p-6 border border-gray-100 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="relative">
              <svg class="w-5 h-5 text-[#9CA3AF] absolute top-1/2 left-3 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/></svg>
              <input type="text" placeholder="搜索我的提示词..." class="w-64 bg-gray-50 border border-gray-200 rounded-lg h-10 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5563]/20 focus:bg-white focus:border-[#4B5563] transition">
            </div>
            <select class="bg-gray-50 border border-gray-200 rounded-lg h-10 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5563]/20 focus:bg-white focus:border-[#4B5563] transition">
              <option>全部分类</option>
              <option>沟通交流</option>
              <option>文案写作</option>
              <option>编程开发</option>
              <option>生活娱乐</option>
            </select>
            <select class="bg-gray-50 border border-gray-200 rounded-lg h-10 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5563]/20 focus:bg-white focus:border-[#4B5563] transition">
              <option>最近更新</option>
              <option>最多收藏</option>
              <option>最多使用</option>
              <option>名称排序</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <button class="p-2 bg-[#4B5563] text-white rounded-lg hover:bg-[#374151] transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </button>
            <button class="p-2 bg-gray-100 text-[#6B7280] rounded-lg hover:bg-gray-200 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 提示词网格视图 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="prompt in myPrompts" :key="prompt.title" class="prompt-card bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 cursor-pointer relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
          <div v-if="prompt.isHot" class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400"></div>
          <div class="absolute top-3 right-3">
            <span class="inline-flex items-center gap-1.5 text-xs font-medium" :class="prompt.status === '公开' ? 'text-[#10B981]' : 'text-[#6B7280]'">
              <div class="w-2 h-2 rounded-full" :class="prompt.status === '公开' ? 'bg-[#10B981]' : 'bg-[#6B7280]'"></div>
              {{ prompt.status }}
            </span>
          </div>
          <div class="flex items-start gap-4 mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" :class="prompt.iconBgClass" v-html="prompt.icon"></div>
            <div class="flex-1">
              <h4 class="font-medium text-[#374151] mb-1 flex items-center gap-2">
                {{ prompt.title }}
                <svg v-if="prompt.isHot" class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              </h4>
              <span class="text-xs font-medium px-2 py-1 rounded-full" :class="prompt.tagClass">{{ prompt.tag }}</span>
            </div>
          </div>
          <p class="text-sm text-[#9CA3AF] mb-4 line-clamp-2">{{ prompt.description }}</p>
          <div class="flex items-center justify-between text-xs text-[#9CA3AF]">
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                <span>{{ prompt.likes }}</span>
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                <span>{{ prompt.usage }}</span>
              </div>
            </div>
            <span>{{ prompt.updated }}</span>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
            <button class="flex-1 px-3 py-2 bg-gray-50 text-[#6B7280] rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">编辑</button>
            <button class="flex-1 px-3 py-2 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-[#374151] transition-colors">使用</button>
            <button class="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <svg class="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
          </div>
        </div>
        <!-- 创建新提示词卡片 -->
        <div class="bg-white rounded-xl p-6 border-2 border-dashed border-gray-200 hover:border-[#4B5563] cursor-pointer flex flex-col items-center justify-center min-h-[280px] group transition-all">
          <div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#4B5563]/10 transition-colors">
            <svg class="w-8 h-8 text-[#6B7280] group-hover:text-[#4B5563] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
          </div>
          <p class="text-sm font-medium text-[#6B7280] group-hover:text-[#4B5563] transition-colors">创建新提示词</p>
          <p class="text-xs text-[#9CA3AF] mt-1">开始构建你的AI提示词</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const stats = ref([
  { label: '提示词总数', value: '15', trend: '+12%', trendClass: 'text-green-600 bg-green-50', iconBgClass: 'bg-blue-50', icon: `<svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`},
  { label: '公开分享', value: '8', trend: '公开', trendClass: 'text-[#10B981] font-medium', iconBgClass: 'bg-green-50', icon: `<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`},
  { label: '收藏过千', value: '3', trend: '热门', trendClass: 'text-[#F59E0B] font-medium animate-pulse', iconBgClass: 'bg-yellow-50', icon: `<svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>`},
  { label: '总使用次数', value: '42.8k', trend: '+28%', trendClass: 'text-purple-600 bg-purple-50', iconBgClass: 'bg-purple-50', icon: `<svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`},
]);

const myPrompts = ref([
  {
    title: '高情商沟通大师',
    description: '将任何直白、生硬的表达，转化为礼貌、得体且不失分寸的沟通话术。',
    icon: `<svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>`,
    iconBgClass: 'bg-blue-50',
    tag: '沟通交流',
    tagClass: 'text-[#059669] bg-green-100',
    status: '公开',
    likes: '1.8k',
    usage: '12.3k',
    updated: '更新于 3天前',
    isHot: false,
  },
  {
    title: '周报生成器',
    description: '根据本周工作要点，自动生成结构清晰、重点突出的周报。',
    icon: `<svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>`,
    iconBgClass: 'bg-purple-50',
    tag: '文案写作',
    tagClass: 'text-[#2563EB] bg-blue-100',
    status: '私有',
    likes: '-',
    usage: '856',
    updated: '更新于 1周前',
    isHot: false,
  },
  {
    title: '旅游行程规划',
    description: '根据目的地、预算和偏好，生成详细的旅游行程安排。',
    icon: `<svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    iconBgClass: 'bg-yellow-50',
    tag: '生活娱乐',
    tagClass: 'text-[#F59E0B] bg-yellow-100',
    status: '公开',
    likes: '3.2k',
    usage: '28.7k',
    updated: '更新于 2周前',
    isHot: true,
  }
]);
</script>