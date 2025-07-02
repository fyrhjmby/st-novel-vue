<template>
  <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC]">
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <select class="text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all py-2 px-3">
          <option>所有分类</option>
          <option>内容创作</option>
          <option>数据分析</option>
          <option>营销自动化</option>
          <option>客户服务</option>
          <option>开发工具</option>
        </select>
        <div class="hidden sm:flex items-center bg-[#F3F4F6] rounded-lg p-1 text-sm font-medium text-[#6B7280]">
          <button class="px-3 py-1 rounded-md bg-white shadow-sm text-[#374151]">全部</button>
          <button class="px-3 py-1 rounded-md hover:bg-gray-200">官方推荐</button>
          <button class="px-3 py-1 rounded-md hover:bg-gray-200">最受欢迎</button>
          <button class="px-3 py-1 rounded-md hover:bg-gray-200">最新</button>
        </div>
      </div>
      <div class="relative">
        <input type="text" placeholder="搜索模板..." class="w-64 pl-10 pr-4 py-2 text-sm bg-[#F3F4F6] border-transparent rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all">
        <svg class="w-5 h-5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/></svg>
      </div>
    </div>


    <!-- 精选推荐 -->
    <div class="mb-8">
      <h3 class="text-sm font-medium text-[#374151] mb-4">本周精选</h3>
      <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-medium">AI内容创作大师套装</h3>
                <p class="text-sm text-white/80">包含10+专业工作流模板</p>
              </div>
            </div>
            <p class="text-sm text-white/90 mb-4 max-w-2xl">从博客文章到社交媒体，从视频脚本到邮件营销，一站式解决所有内容创作需求。基于最新的GPT-4和Claude模型优化。</p>
            <div class="flex items-center gap-4 text-sm">
                            <span class="flex items-center gap-1">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                4.9 (2.3k评价)
                            </span>
              <span>15.2k 次使用</span>
              <span>由官方团队维护</span>
            </div>
          </div>
          <button class="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            立即使用
          </button>
        </div>
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="mb-6">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-sm text-gray-500">热门标签：</span>
        <button v-for="tag in popularTags" :key="tag.name" class="px-3 py-1 rounded-full text-sm hover:opacity-80" :class="tag.class">{{ tag.name }}</button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="template in workflowTemplates" :key="template.title" class="bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all group flex flex-col">
        <div class="p-6 flex-1 flex flex-col">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" :class="template.iconBgClass">
              <span v-html="template.icon"></span>
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-[#374151]">{{ template.title }}</h3>
              <p class="text-xs text-[#9CA3AF] mt-1">由 <span class="font-semibold text-[#4B5563]">{{ template.author }}</span> 提供</p>
              <div class="flex items-center gap-1 mt-2">
                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <span class="text-xs text-gray-600">{{ template.rating }} ({{ template.reviews }})</span>
              </div>
            </div>
          </div>
          <p class="text-sm text-[#6B7280] flex-1 mb-4">{{ template.description }}</p>
          <div class="border-t border-gray-100 pt-4 mt-auto flex items-center justify-between">
            <div class="text-sm text-[#9CA3AF] flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
              <span class="font-medium">{{ template.usage }}</span> 次使用
            </div>
            <div class="flex items-center gap-2">
              <button class="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </button>
              <button class="px-4 py-2 bg-[#374151] text-white rounded-lg text-sm font-medium hover:bg-[#1F2937] transition-colors">使用模板</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="mt-8 flex items-center justify-center gap-2">
      <button class="px-3 py-1 rounded-lg text-gray-500 hover:bg-gray-100">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
      </button>
      <button class="px-3 py-1 rounded-lg bg-blue-500 text-white">1</button>
      <button class="px-3 py-1 rounded-lg text-gray-700 hover:bg-gray-100">2</button>
      <button class="px-3 py-1 rounded-lg text-gray-700 hover:bg-gray-100">3</button>
      <span class="px-2 text-gray-400">...</span>
      <button class="px-3 py-1 rounded-lg text-gray-700 hover:bg-gray-100">12</button>
      <button class="px-3 py-1 rounded-lg text-gray-500 hover:bg-gray-100">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const popularTags = ref([
  { name: '内容生成', class: 'bg-blue-100 text-blue-700' },
  { name: '数据处理', class: 'bg-green-100 text-green-700' },
  { name: '自动化营销', class: 'bg-purple-100 text-purple-700' },
  { name: 'API集成', class: 'bg-amber-100 text-amber-700' },
  { name: '图像处理', class: 'bg-rose-100 text-rose-700' },
]);

const workflowTemplates = ref([
  {
    title: '会议纪要生成器',
    author: '官方',
    rating: '4.8',
    reviews: '234',
    description: '上传会议录音或文字记录，自动生成结构化、带要点的会议纪要。',
    usage: '2.1k',
    icon: `<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
    iconBgClass: 'bg-blue-100',
  },
  {
    title: '市场研究分析师',
    author: '官方',
    rating: '4.7',
    reviews: '189',
    description: '输入行业或产品，自动抓取网络信息，生成SWOT分析报告。',
    usage: '1.8k',
    icon: `<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>`,
    iconBgClass: 'bg-green-100',
  },
  {
    title: '短视频脚本创作',
    author: '社区',
    rating: '4.6',
    reviews: '156',
    description: '只需一个创意点，即可自动生成包含场景、对话和动作的完整短视频脚本。',
    usage: '972',
    icon: `<svg class="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`,
    iconBgClass: 'bg-rose-100',
  },
  {
    title: '客服对话优化器',
    author: '企业版',
    rating: '4.9',
    reviews: '512',
    description: '分析客服对话记录，提供改进建议，生成标准化回复模板。',
    usage: '3.5k',
    icon: `<svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>`,
    iconBgClass: 'bg-indigo-100',
  },
]);
</script>