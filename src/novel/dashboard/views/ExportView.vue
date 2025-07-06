<template>
  <div class="flex-1 flex overflow-hidden bg-[#FCFCFC]">
    <div class="w-[420px] border-r border-gray-100 p-8 flex flex-col bg-white flex-shrink-0">
      <div class="space-y-8 flex-grow">
        <div>
          <h3 class="text-base font-medium text-[#374151] mb-4">导出格式</h3>
          <div class="grid grid-cols-3 gap-3">
            <button
                @click="selectedFormat = 'pdf'"
                :class="['flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all aspect-square', selectedFormat === 'pdf' ? 'border-blue-500 text-blue-600 bg-blue-50/50' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300']">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <span class="block text-xs font-semibold">PDF</span>
            </button>
            <button
                @click="selectedFormat = 'docx'"
                :class="['flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all aspect-square', selectedFormat === 'docx' ? 'border-blue-500 text-blue-600 bg-blue-50/50' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300']">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <span class="block text-xs font-semibold">DOCX</span>
            </button>
            <button
                @click="selectedFormat = 'epub'"
                :class="['flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all aspect-square', selectedFormat === 'epub' ? 'border-blue-500 text-blue-600 bg-blue-50/50' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300']">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"></path></svg>
              <span class="block text-xs font-semibold">EPUB</span>
            </button>
          </div>
        </div>

        <div>
          <h3 class="text-base font-medium text-[#374151] mb-4">包含内容</h3>
          <div class="space-y-3">
            <label class="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" class="sr-only peer" checked>
              <div class="w-5 h-5 rounded flex items-center justify-center border border-gray-300 peer-checked:bg-[#4B5563] peer-checked:border-[#4B5563]">
                <svg class="w-3.5 h-3.5 text-white hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              </div>
              <span class="text-sm text-[#374151] flex-1">小说正文</span>
            </label>
            <label class="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" class="sr-only peer" checked>
              <div class="w-5 h-5 rounded flex items-center justify-center border border-gray-300 peer-checked:bg-[#4B5563] peer-checked:border-[#4B5563]">
                <svg class="w-3.5 h-3.5 text-white hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              </div>
              <span class="text-sm text-[#374151] flex-1">章节大纲</span>
            </label>
            <label class="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" class="sr-only peer">
              <div class="w-5 h-5 rounded flex items-center justify-center border border-gray-300 peer-checked:bg-[#4B5563] peer-checked:border-[#4B5563]">
                <svg class="w-3.5 h-3.5 text-white hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              </div>
              <span class="text-sm text-[#374151] flex-1">角色设定集</span>
            </label>
            <label class="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
              <input type="checkbox" class="sr-only peer">
              <div class="w-5 h-5 rounded flex items-center justify-center border border-gray-300 peer-checked:bg-[#4B5563] peer-checked:border-[#4B5563]">
                <svg class="w-3.5 h-3.5 text-white hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              </div>
              <span class="text-sm text-[#374151] flex-1">作者笔记</span>
            </label>
          </div>
        </div>
      </div>

      <button class="w-full mt-8 flex h-11 items-center justify-center gap-2 bg-[#374151] hover:bg-[#4B5563] text-white font-medium text-sm rounded-lg px-4 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2 2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        <span>开始导出</span>
      </button>
    </div>

    <!-- 右侧预览区 -->
    <div class="flex-1 p-8 bg-[#f5f5f7] overflow-auto custom-scrollbar">
      <div class="bg-white p-12 shadow-lg mx-auto" style="width: 210mm; min-height: 297mm;">
        <div class="text-center mb-16">
          <h1 class="text-4xl" style="font-family: 'Georgia', serif;">星际漫游者</h1>
          <p class="text-lg text-gray-500 mt-2" style="font-family: 'Georgia', serif;">创作者</p>
        </div>
        <div class="text-lg leading-relaxed text-justify" style="font-family: 'Georgia', serif;">
          <h2 class="text-2xl font-bold mb-4">第一章：深空孤影</h2>
          <p class="mb-6">这是章节的详细内容，讲述了主角卡尔文在孤独的宇宙中开始他的旅程。周围只有无尽的星空和飞船引擎的低鸣。</p>
          <p class="mb-6">一个神秘的信号打破了长久的平静，它似乎来自一个未知的源头，艾拉无法解析其格式。这给卡尔文带来了希望，也带来了恐惧。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedFormat = ref('pdf');
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  display: block;
  width: 6px;
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
</style>