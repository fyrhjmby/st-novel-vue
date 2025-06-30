// =
// 文件: ..\src\novel\components\editor\EditorAIPanel.vue
//
// 说明: 编辑器右侧的 AI 助手面板，展示任务队列和生成预览。
//

<template>
  <aside class="w-96 bg-[#FAFAFA] border-l border-gray-100 flex flex-col flex-shrink-0">
    <!-- 用户信息区 -->
    <div class="h-20 flex items-center justify-end px-6 border-b border-gray-100">
      <div class="flex items-center gap-4">
        <button class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/></svg>
        </button>
        <button class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"/><path d="M13.73 21C13.5 21.6 12.8 22 12 22C11.2 22 10.5 21.6 10.27 21"/></svg>
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div class="ml-2 flex items-center gap-3">
          <div class="w-9 h-9 bg-gray-200 rounded-full"></div>
          <div>
            <p class="text-sm font-medium text-[#374151]">张小明</p>
            <p class="text-xs text-[#9CA3AF]">免费版</p>
          </div>
        </div>
      </div>
    </div>

    <!-- AI 任务队列 -->
    <div class="p-4 border-b border-gray-200" style="height: 40%;">
      <h3 class="font-medium text-sm text-gray-700 mb-3 px-2">AI任务队列</h3>
      <div class="space-y-2 overflow-y-auto h-[calc(100%-36px)] pr-1">
        <!-- 失败状态 -->
        <div class="p-3 bg-red-50 rounded-lg border border-red-200">
          <div class="flex justify-between items-center mb-1">
            <p class="font-medium text-sm text-gray-800">润色"第四章"</p>
            <span class="text-xs text-red-600 font-semibold">失败</span>
          </div>
          <p class="text-xs text-red-700 mt-1">生成超时，请 <a href="#" class="underline font-medium">重试</a>。</p>
        </div>
        <!-- 进行中状态 -->
        <div class="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div class="flex justify-between items-center mb-2">
            <p class="font-medium text-sm text-gray-800">扩写"第五章"大纲</p>
            <span class="text-xs text-blue-600 font-semibold">进行中...</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-1.5"><div class="bg-blue-500 h-1.5 rounded-full" style="width: 75%"></div></div>
        </div>
        <!-- 已完成状态 -->
        <div class="p-3 bg-green-50 rounded-lg border border-green-200">
          <p class="font-medium text-sm text-gray-800">角色对话分析</p>
        </div>
      </div>
    </div>

    <!-- AI 生成预览 -->
    <div class="p-4 flex-1 flex flex-col">
      <h3 class="font-medium text-sm text-gray-700 mb-3 px-2">AI生成预览 (差异对比)</h3>
      <div class="flex-grow bg-white rounded-lg border border-gray-200 p-4 overflow-y-auto text-sm">
        <p class="leading-relaxed text-gray-700">
          警报的<del class="diff-del">声将卡尔文从浅眠中惊醒</del><ins class="diff-add">尖啸犹如一把利刃，划破了卡尔文短暂的假寐</ins>。他猛<del class="diff-del">地坐直</del><ins class="diff-add">然挺直身躯</ins>，<ins class="diff-add">猩红的警示灯在他眼中投下不祥的光晕</ins>。<del class="diff-del">眼前的屏幕上一片红色闪烁</del>。
        </p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
// AI panel logic goes here
</script>

<style scoped>
.diff-del {
  background-color: #FEE2E2;
  text-decoration: line-through;
  text-decoration-color: #EF4444;
  color: #B91C1C;
  padding: 0 2px;
  border-radius: 3px;
}
.diff-add {
  background-color: #D1FAE5;
  text-decoration: none;
  color: #065F46;
  padding: 0 2px;
  border-radius: 3px;
}
</style>