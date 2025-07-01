<template>
  <main class="flex-1 bg-white flex flex-col">
    <!-- 详情头部 -->
    <header class="px-8 pt-6 pb-0">
      <div class="flex items-start justify-between mb-6">
        <div class="flex items-start gap-4">
          <button @click="$router.back()" class="p-2 hover:bg-gray-50 rounded-lg transition-colors mt-1"><svg class="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg></button>
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-2xl font-medium text-[#374151]">高情商沟通大师</h1>
              <span class="px-3 py-1.5 text-xs font-medium text-[#059669] bg-green-100 rounded-full">沟通交流</span>
              <span class="inline-flex items-center gap-1.5 text-xs font-medium text-[#10B981]">
                <div class="w-2 h-2 rounded-full bg-[#10B981]"></div>公开
              </span>
            </div>
            <div class="flex items-center gap-4 text-sm text-[#6B7280]">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full"></div>
                <span>由 <span class="text-[#374151] font-medium">李欣然</span> 创建</span>
              </div>
              <span>•</span>
              <span>更新于 2024年5月20日</span>
              <span>•</span>
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                <span class="font-medium">4.8</span>
                <span class="text-[#9CA3AF]">(238)</span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button class="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
            <svg class="w-5 h-5 text-[#6B7280] group-hover:text-[#374151]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </button>
          <button class="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
            <svg class="w-5 h-5 text-[#6B7280] group-hover:text-[#374151]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
          </button>
          <button class="px-6 py-2.5 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-[#374151] transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            <span>立即使用</span>
          </button>
        </div>
      </div>

      <!-- Tab导航 -->
      <div class="flex items-center gap-6 border-b border-gray-100">
        <button v-for="tab in tabs" :key="tab.name" @click="activeTab = tab.name" class="px-1 py-3 text-sm font-medium" :class="activeTab === tab.name ? 'border-b-2 border-[#4B5563] text-[#374151]' : 'text-[#6B7280] hover:text-[#374151]'">
          {{ tab.name }}
          <span v-if="tab.count" class="ml-2 px-2 py-0.5 bg-gray-100 text-xs rounded-full">{{ tab.count }}</span>
        </button>
      </div>
    </header>

    <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC]">
      <div class="grid grid-cols-3 gap-6">
        <!-- 左侧主要内容 -->
        <div class="col-span-2 space-y-6">
          <!-- 简介卡片 -->
          <div class="bg-white rounded-xl p-6 border border-gray-100">
            <h3 class="text-base font-medium text-[#374151] mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              简介
            </h3>
            <p class="text-sm text-[#6B7280] leading-relaxed mb-4">
              将任何直白、生硬的表达，转化为礼貌、得体且不失分寸的沟通话术。无论是向上级汇报坏消息，还是拒绝不合理的要求，或是提出批评性意见，这个提示词都能帮你找到最合适的表达方式。
            </p>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in ['#职场沟通', '#情商提升', '#人际关系', '#话术优化']" :key="tag" class="px-3 py-1.5 bg-gray-50 text-xs text-[#6B7280] rounded-lg">{{ tag }}</span>
            </div>
          </div>

          <!-- 核心功能 -->
          <div class="bg-white rounded-xl p-6 border border-gray-100">
            <h3 class="text-base font-medium text-[#374151] mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
              核心功能
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="feature in features" :key="feature.title" class="p-4 rounded-lg" :class="feature.bgClass">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-3" :class="feature.iconBgClass" v-html="feature.icon"></div>
                <h4 class="text-sm font-medium text-[#374151] mb-1">{{ feature.title }}</h4>
                <p class="text-xs text-[#6B7280]">{{ feature.description }}</p>
              </div>
            </div>
          </div>

          <!-- 使用示例 -->
          <div class="bg-white rounded-xl border border-gray-100">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 class="text-base font-medium text-[#374151] flex items-center gap-2">
                <svg class="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                使用示例
              </h3>
              <button class="text-sm text-[#4B5563] hover:text-[#374151] font-medium">查看更多</button>
            </div>
            <div class="p-6 space-y-4">
              <div v-for="example in examples" :key="example.title" class="example-card bg-gray-50 rounded-lg p-4 border-l-4 transition-transform hover:translate-x-1" :class="example.borderColorClass">
                <div class="flex items-start justify-between mb-2">
                  <span class="text-xs font-medium px-2 py-1 rounded" :class="example.tagBgClass">{{ example.tag }}</span>
                  <button class="text-xs text-[#6B7280] hover:text-[#374151]">试试看</button>
                </div>
                <p class="text-sm text-[#374151] font-medium mb-2">原始表达：</p>
                <p class="text-sm text-[#6B7280] mb-3">{{ example.original }}</p>
                <p class="text-sm text-[#374151] font-medium mb-2">优化后：</p>
                <p class="text-sm text-[#6B7280]">{{ example.optimized }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧信息栏 -->
        <div class="space-y-6">
          <!-- 统计数据 -->
          <div class="bg-white rounded-xl p-6 border border-gray-100">
            <h3 class="text-base font-medium text-[#374151] mb-4">使用统计</h3>
            <div class="space-y-4">
              <div v-for="stat in stats" :key="stat.label">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-[#6B7280]">{{ stat.label }}</span>
                  <span class="text-sm font-medium text-[#374151]">{{ stat.value }}</span>
                </div>
                <div class="w-full bg-gray-100 rounded-full h-2">
                  <div class="h-2 rounded-full" :class="stat.barClass" :style="{width: stat.width}"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 相关推荐 -->
          <div class="bg-white rounded-xl p-6 border border-gray-100">
            <h3 class="text-base font-medium text-[#374151] mb-4">相关推荐</h3>
            <div class="space-y-3">
              <a href="#" v-for="rec in recommendations" :key="rec.title" class="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="rec.iconBgClass" v-html="rec.icon"></div>
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-[#374151] mb-1">{{ rec.title }}</h4>
                    <p class="text-xs text-[#9CA3AF]">{{ rec.description }}</p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <!-- 快速操作 -->
          <div class="bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl p-6 text-white">
            <h3 class="text-base font-medium mb-4">快速开始</h3>
            <p class="text-sm text-gray-300 mb-4">立即体验高情商沟通的魅力</p>
            <button class="w-full py-3 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span>开始使用</span>
            </button>
            <div class="mt-4 pt-4 border-t border-gray-600">
              <p class="text-xs text-gray-400 text-center">已有 12,356 人使用</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('概览');
const tabs = ref([
  { name: '概览' },
  { name: '模板详情' },
  { name: '评价', count: '238' },
  { name: '使用指南' },
  { name: '版本历史' },
]);

const features = ref([
  { title: '话术转换', description: '将直白表达转为委婉得体的沟通方式', icon: `<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>`, bgClass: 'bg-blue-50', iconBgClass: 'bg-blue-100' },
  { title: '场景适配', description: '根据不同场合提供最合适的表达建议', icon: `<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`, bgClass: 'bg-green-50', iconBgClass: 'bg-green-100' },
  { title: '多种风格', description: '提供正式、友好、幽默等多种沟通风格', icon: `<svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>`, bgClass: 'bg-purple-50', iconBgClass: 'bg-purple-100' },
  { title: '即时优化', description: '快速生成多个优化版本供选择', icon: `<svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`, bgClass: 'bg-yellow-50', iconBgClass: 'bg-yellow-100' }
]);

const examples = ref([
  { tag: '职场汇报', original: '"项目搞砸了，预算超了50%，时间也延期了。"', optimized: '"关于XX项目，我需要向您汇报一些挑战。目前项目遇到了一些预料之外的困难，导致预算超出原计划50%，交付时间也需要相应调整。我已经准备了详细的问题分析和解决方案..."', borderColorClass: 'border-blue-500', tagBgClass: 'text-blue-600 bg-blue-100' },
  { tag: '拒绝请求', original: '"不行，这个需求太离谱了，做不了。"', optimized: '"感谢您的信任。我仔细评估了这个需求，考虑到目前的资源限制和技术可行性，恐怕短期内难以实现。不过，我有一个替代方案可能会帮助您达到类似的效果..."', borderColorClass: 'border-green-500', tagBgClass: 'text-green-600 bg-green-100' }
]);

const stats = ref([
  { label: '收藏数', value: '1,832', width: '85%', barClass: 'bg-gradient-to-r from-blue-500 to-purple-500' },
  { label: '使用次数', value: '12,356', width: '92%', barClass: 'bg-gradient-to-r from-green-500 to-teal-500' },
  { label: '满意度', value: '96%', width: '96%', barClass: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
]);

const recommendations = ref([
  { title: '商务谈判助手', description: '专业谈判话术指导', icon: `<svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>`, iconBgClass: 'bg-purple-100' },
  { title: '客户服务话术', description: '提升客户满意度', icon: `<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>`, iconBgClass: 'bg-blue-100' },
  { title: '团队管理沟通', description: '高效团队沟通技巧', icon: `<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>`, iconBgClass: 'bg-green-100' },
]);
</script>