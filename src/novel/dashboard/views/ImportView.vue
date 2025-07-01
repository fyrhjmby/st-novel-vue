<template>
  <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] flex items-center justify-center">
    <div class="w-full max-w-2xl bg-white rounded-xl p-8 border border-gray-100 shadow-sm">

      <!-- 文件上传区域 -->
      <div class="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-gray-50/50 transition-colors cursor-pointer">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M7 18C4.5 18 3 16.5 3 14C3 11.5 5 10 7 10C7.3 10 7.5 10 7.8 10.1C8.5 7.2 11 5 14 5C17.3 5 20 7.7 20 11C20 11.3 20 11.7 19.9 12C21.1 12.5 22 13.6 22 15C22 16.9 20.4 18.5 18.5 18.5"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 13V21M15 16L12 13L9 16"/>
        </svg>
        <h3 class="text-lg font-medium text-[#374151]">将文件拖拽至此</h3>
        <p class="text-sm text-[#6B7280] mt-1">或</p>
        <button class="mt-4 px-6 py-2.5 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-[#374151] transition-colors">
          选择文件
        </button>
        <p class="text-xs text-gray-400 mt-4">支持 .txt, .docx, .md, .epub</p>
      </div>

      <!-- 导入设置区域 -->
      <div class="mt-8 text-left space-y-4 w-full">
        <h4 class="text-base font-medium text-[#374151]">导入设置</h4>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg border border-gray-100">
            <div>
              <label for="auto-detect-chapters" class="text-sm font-medium text-[#374151] cursor-pointer">自动识别章节</label>
              <p class="text-xs text-[#9CA3AF] mt-1">根据常见格式自动分割章节</p>
            </div>
            <!-- 自定义 Toggle 开关 -->
            <label for="auto-detect-chapters" class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="auto-detect-chapters" class="sr-only peer" checked>
              <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#4B5563] transition-all peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
          <div class="p-4 bg-[#F9FAFB] rounded-lg border border-gray-100">
            <label for="chapter-rule" class="text-sm font-medium text-[#374151] block mb-2">章节识别规则</label>
            <input type="text" id="chapter-rule" value="第.+章|Chapter \d+" class="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-mono text-[#374151] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors">
            <p class="text-xs text-[#9CA3AF] mt-2">使用正则表达式匹配章节标题</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import logic will be implemented here
</script>

<style scoped>
/* Scoped styles can be added here if needed */
</style>