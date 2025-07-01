<template>
  <div class="flex-1 flex overflow-hidden">
    <!-- 左侧章节列表 -->
    <div class="w-80 border-r border-gray-100 bg-[#FCFCFC] flex flex-col flex-shrink-0">
      <header class="h-20 px-6 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
        <h2 class="font-medium text-[#374151]">选择章节</h2>
        <select class="text-sm bg-white border border-gray-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition">
          <option>所有版本</option>
          <option>手动保存</option>
          <option>自动保存</option>
          <option>AI修改</option>
        </select>
      </header>

      <div class="flex-1 p-4 overflow-y-auto space-y-2 custom-scrollbar">
        <!-- 选中章节 -->
        <div class="bg-white rounded-lg border-2 border-[#4B5563] cursor-pointer p-4">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium text-sm text-[#374151]">第四章：跃迁点</h3>
            <span class="text-xs font-medium px-2 py-0.5 rounded-full text-blue-700 bg-blue-100">当前</span>
          </div>
          <p class="text-xs text-[#6B7280]">最后修改：10分钟前</p>
          <p class="text-xs text-[#9CA3AF] mt-1">12个历史版本</p>
        </div>

        <!-- 其他章节 -->
        <div class="bg-white rounded-lg border-2 border-transparent hover:border-gray-200 cursor-pointer p-4 transition-colors">
          <h3 class="font-medium text-sm text-[#374151] mb-2">第三章：意外的信号</h3>
          <p class="text-xs text-[#6B7280]">最后修改：2小时前</p>
          <p class="text-xs text-[#9CA3AF] mt-1">8个历史版本</p>
        </div>

        <div class="bg-white rounded-lg border-2 border-transparent hover:border-gray-200 cursor-pointer p-4 transition-colors">
          <h3 class="font-medium text-sm text-[#374151] mb-2">第二章：艾拉</h3>
          <p class="text-xs text-[#6B7280]">最后修改：1天前</p>
          <p class="text-xs text-[#9CA3AF] mt-1">5个历史版本</p>
        </div>
      </div>
    </div>

    <!-- 右侧版本对比 -->
    <div class="flex-1 flex flex-col bg-white">
      <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
        <div>
          <h1 class="text-lg font-medium text-[#374151]">第四章 版本对比</h1>
          <p class="text-sm text-[#6B7280] mt-1">当前版本 vs AI润色版本 (1小时前)</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-colors flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 12h-4m0 0H8m4 0V8m0 4v4m-4-8l8 8"></path></svg>
            切换对比模式
          </button>
          <button class="px-4 py-2 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
            恢复此版本
          </button>
        </div>
      </header>

      <!-- 版本时间线 -->
      <div class="px-8 py-3 border-b border-gray-100 bg-[#F9FAFB]">
        <div class="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar-horizontal">
          <button class="w-7 h-7 flex-shrink-0 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
            <svg class="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <div class="flex gap-2">
            <div class="text-xs font-medium px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 flex items-center gap-1.5 cursor-pointer flex-shrink-0">
              <svg class="w-2 h-2" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4"/></svg>
              当前版本
            </div>
            <div class="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors flex-shrink-0">
              AI润色 • 1小时前
            </div>
            <div class="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors flex-shrink-0">
              手动保存 • 3小时前
            </div>
            <div class="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors flex-shrink-0">
              自动保存 • 5小时前
            </div>
            <div class="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors flex-shrink-0">
              自动保存 • 8小时前
            </div>
          </div>
          <button class="w-7 h-7 flex-shrink-0 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors">
            <svg class="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>

      <div class="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <div class="max-w-3xl mx-auto">
          <div class="text-[#374151] leading-relaxed text-base">
            <p>
              <del class="diff-del">控制台的警报声将卡尔文从浅眠中惊醒。</del>
              <ins class="diff-add">警报的尖啸犹如一把利刃，划破了卡尔文短暂的假寐。</ins>
              他猛地坐直，眼前的屏幕上一片红色闪烁。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// History page logic will be implemented here
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  display: block;
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.custom-scrollbar-horizontal::-webkit-scrollbar {
  height: 4px;
}

.diff-del {
  background-color: #FEE2E2;
  text-decoration: line-through;
  text-decoration-color: #F87171;
  padding: 2px 1px;
}
.diff-add {
  background-color: #D1FAE5;
  text-decoration: none;
  padding: 2px 1px;
}
</style>