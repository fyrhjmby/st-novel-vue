// =
// 文件: ..\src/novel/views/NovelWorldview.vue
//

<template>
  <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] hide-scrollbar">
    <div class="space-y-8 max-w-7xl mx-auto">
      <!-- 分类: 地点 -->
      <div>
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>
          <h2 class="text-base font-medium text-[#374151]">地点</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- 现有卡片 -->
          <div class="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm cursor-pointer">
            <h3 class="font-medium text-[#374151] mb-1">探索者四号</h3>
            <p class="text-sm text-[#9CA3AF] line-clamp-2">主角所在的深空探测飞船，配备了实验性的“艾拉”AI系统和基础的生态循环模块。</p>
            <div class="mt-4 text-xs text-gray-400">更新于：2天前</div>
          </div>
          <div class="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm cursor-pointer">
            <h3 class="font-medium text-[#374151] mb-1">跃迁点</h3>
            <p class="text-sm text-[#9CA3AF] line-clamp-2">一种罕见的宇宙弦理论现象，被认为是超光速旅行的唯一可能通道，但极度不稳定。</p>
            <div class="mt-4 text-xs text-gray-400">更新于：1小时前</div>
          </div>
        </div>
      </div>

      <!-- 分类: 技术 -->
      <div>
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
          </div>
          <h2 class="text-base font-medium text-[#374151]">技术</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm cursor-pointer">
            <h3 class="font-medium text-[#374151] mb-1">再生咖啡</h3>
            <p class="text-sm text-[#9CA3AF] line-clamp-2">飞船内物质循环系统的产物，味道苦涩，但能提供必要的咖啡因和微量元素。</p>
            <div class="mt-4 text-xs text-gray-400">更新于：5天前</div>
          </div>
          <div class="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm cursor-pointer">
            <h3 class="font-medium text-[#374151] mb-1">艾拉AI系统</h3>
            <p class="text-sm text-[#9CA3AF] line-clamp-2">第五代通用人工智能，负责飞船的全部操作。其逻辑核心被设定为“确保任务完成”，有时会与船员的生存需求产生冲突。</p>
            <div class="mt-4 text-xs text-gray-400">更新于：2天前</div>
          </div>
          <!-- 添加新设定的占位符卡片 -->
          <button class="bg-white rounded-xl p-6 border border-dashed border-gray-200 hover:border-blue-400 transition-all hover:shadow-sm text-left group flex flex-col items-center justify-center text-gray-500 hover:text-blue-600">
            <div class="w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <svg class="w-6 h-6" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5V19M5 12H19"/></svg>
            </div>
            <h4 class="font-medium text-[#374151] mb-1">新建设定</h4>
            <p class="text-sm text-[#9CA3AF]">为此分类添加新条目</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic can be added here
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>