<template>
  <div class="flex-1 flex overflow-hidden bg-[#FCFCFC]">
    <!-- 左侧角色列表 -->
    <div class="w-1/3 max-w-sm border-r border-gray-100 p-4 flex flex-col">
      <div class="pb-4 mb-4 border-b border-gray-100">
        <button class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5V19M5 12H19"/></svg>
          创建新角色
        </button>
      </div>
      <div class="flex-grow overflow-y-auto pr-1 space-y-2 hide-scrollbar">
        <a href="#" class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div class="w-10 h-10 rounded-full flex-shrink-0">
            <img src="https://i.pravatar.cc/150?u=calvin" alt="Calvin" class="w-full h-full object-cover rounded-full">
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-[#374151] truncate text-sm">卡尔文</p>
            <p class="text-xs text-[#6B7280] truncate">主角, 探索者四号宇航员</p>
          </div>
          <span class="text-xs font-medium px-2 py-1 rounded-md text-blue-600 bg-blue-100">编辑中</span>
        </a>
        <a href="#" class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg group transition-colors">
          <div class="w-10 h-10 rounded-full flex-shrink-0 bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h.5A2.5 2.5 0 0020 5.5V3.935m-14 0A10.003 10.003 0 0112 2a10.003 10.003 0 017 1.935M6 21a2 2 0 01-2-2v-1a2 2 0 012-2h12a2 2 0 012 2v1a2 2 0 01-2 2H6z"/></svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-[#374151] truncate text-sm">艾拉</p>
            <p class="text-xs text-[#6B7280] truncate">AI, 飞船智能核心</p>
          </div>
        </a>
        <a href="#" class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg group transition-colors">
          <div class="w-10 h-10 rounded-full flex-shrink-0 bg-gray-100 text-gray-500 flex items-center justify-center group-hover:scale-105 transition-transform">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-medium text-[#374151] truncate text-sm">神秘信号源</p>
            <p class="text-xs text-[#6B7280] truncate">未知实体</p>
          </div>
        </a>
      </div>
    </div>
    <div class="w-2/3 p-8 overflow-y-auto hide-scrollbar">
      <div class="space-y-6 max-w-3xl mx-auto">
        <div class="flex items-start gap-6">
          <div class="relative flex-shrink-0">
            <div class="w-24 h-24 rounded-full bg-gray-200">
              <img src="https://i.pravatar.cc/150?u=calvin" alt="Calvin" class="w-full h-full object-cover rounded-full" />
            </div>
            <button class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 absolute bottom-0 right-0 hover:bg-gray-50 transition-colors">
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><circle cx="12" cy="13" r="3"/></svg>
            </button>
          </div>
          <div class="flex-grow space-y-4">
            <div>
              <label class="block text-sm font-medium text-[#6B7280] mb-1.5">姓名</label>
              <input type="text" value="卡尔文" class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#374151] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
            <div>
              <label class="block text-sm font-medium text-[#6B7280] mb-1.5">身份/标签</label>
              <input type="text" value="主角, 宇航员, 工程师" class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#374151] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label class="block text-sm font-medium text-[#6B7280] mb-1.5">性别</label><input type="text" value="男" class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#374151] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></div>
          <div><label class="block text-sm font-medium text-[#6B7280] mb-1.5">年龄</label><input type="text" value="35" class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#374151] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></div>
          <div><label class="block text-sm font-medium text-[#6B7280] mb-1.5">阵营</label><input type="text" value="人类联邦" class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#374151] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></div>
        </div>
        <div>
          <label class="block text-sm font-medium text-[#6B7280] mb-1.5">人物简介 (AI将参考此内容)</label>
          <textarea rows="4" class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#374151] leading-relaxed focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition">孤独的宇航员，在“探索者四号”上执行深空任务五年。性格坚毅、内敛，对技术有极高天赋，但内心深处极度渴望回家。在一次意外中发现了回家的可能性，从此踏上未知的旅程。</textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-[#6B7280] mb-1.5">角色笔记 (仅自己可见)</label>
          <textarea rows="3" placeholder="记录一些灵感或不希望AI看到的细节..." class="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#374151] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></textarea>
        </div>
        <div class="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors">删除角色</button>
          <button class="px-5 py-2 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">保存更改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic can be added here
</script>