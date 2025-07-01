<template>
  <!-- 菜单卡片容器 -->
  <div class="w-80 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
    <!-- 顶部标题栏 -->
    <div class="bg-gradient-to-r from-[#4B5563] to-[#374151] text-white p-5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.43 2.43c-1.105 0-2.023-.918-2.023-2.023a3.75 3.75 0 013.75-3.75c.916 0 1.749.312 2.422.845l.005.004a.75.75 0 01.017 1.056l-1.06 1.06c-.24.24-.407.553-.407.896v.113a.75.75 0 001.5 0v-.058a1.5 1.5 0 01.447-1.087l.16-.16a1.5 1.5 0 00-2.122-2.122l-.16.16a1.5 1.5 0 01-1.087.447h-.058a.75.75 0 000 1.5h.113c.343 0 .656-.167.896-.407l1.06-1.06a.75.75 0 011.056.017z" /><path stroke-linecap="round" stroke-linejoin="round" d="M16.47 8.53a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h15.94l-2.47-2.47a.75.75 0 010-1.06z" /></svg>
        </div>
        <div>
          <h3 class="font-medium">AI 助手</h3>
          <p class="text-xs text-white/80">智能创作伴侣</p>
        </div>
      </div>
      <button class="w-8 h-8 hover:bg-white/10 rounded-lg flex items-center justify-center transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <!-- 任务列表 -->
    <div class="p-6 space-y-4 max-h-96 overflow-y-auto">
      <div>
        <p class="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider mb-3">生成任务</p>
        <div class="space-y-2">
          <a href="#" class="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F3F4F6] transition-colors group">
            <div class="w-10 h-10 bg-[#F3F4F6] text-[#4B5563] rounded-lg flex items-center justify-center group-hover:bg-[#4B5563] group-hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
            </div>
            <div class="flex-1">
              <p class="font-medium text-sm text-[#374151]">章节生成</p>
              <p class="text-xs text-[#9CA3AF]">根据大纲创建新章节</p>
            </div>
            <svg class="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
          </a>

          <a href="#" class="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F3F4F6] transition-colors group">
            <div class="w-10 h-10 bg-[#F3F4F6] text-[#4B5563] rounded-lg flex items-center justify-center group-hover:bg-[#4B5563] group-hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.43 2.43c-1.105 0-2.023-.918-2.023-2.023a3.75 3.75 0 013.75-3.75c.916 0 1.749.312 2.422.845l.005.004a.75.75 0 01.017 1.056l-1.06 1.06c-.24.24-.407.553-.407.896v.113a.75.75 0 001.5 0v-.058a1.5 1.5 0 01.447-1.087l.16-.16a1.5 1.5 0 00-2.122-2.122l-.16.16a1.5 1.5 0 01-1.087.447h-.058a.75.75 0 000 1.5h.113c.343 0 .656-.167.896-.407l1.06-1.06a.75.75 0 011.056.017z" /></svg>
            </div>
            <div class="flex-1">
              <p class="font-medium text-sm text-[#374151]">章节润色</p>
              <p class="text-xs text-[#9CA3AF]">优化文字表达和风格</p>
            </div>
            <svg class="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
          </a>
        </div>
      </div>

      <div>
        <p class="text-xs font-medium text-[#9CA3AF] uppercase tracking-wider mb-3">分析任务</p>
        <div class="space-y-2">
          <a href="#" class="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F3F4F6] transition-colors group">
            <div class="w-10 h-10 bg-[#F3F4F6] text-[#4B5563] rounded-lg flex items-center justify-center group-hover:bg-[#4B5563] group-hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM21 21l-5.197-5.197" /></svg>
            </div>
            <div class="flex-1">
              <p class="font-medium text-sm text-[#374151]">章节分析</p>
              <p class="text-xs text-[#9CA3AF]">分析情节和人物</p>
            </div>
            <svg class="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
          </a>

          <a href="#" class="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F3F4F6] transition-colors group">
            <div class="w-10 h-10 bg-[#F3F4F6] text-[#4B5563] rounded-lg flex items-center justify-center group-hover:bg-[#4B5563] group-hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1.125-1.5M13.5 16.5L12 21m-1.5-4.5L9 16.5" /></svg>
            </div>
            <div class="flex-1">
              <p class="font-medium text-sm text-[#374151]">阶段分析</p>
              <p class="text-xs text-[#9CA3AF]">评估故事节奏和结构</p>
            </div>
            <svg class="w-4 h-4 text-[#9CA3AF] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"></path></svg>
          </a>
        </div>
      </div>
    </div>

    <!-- 底部聊天入口 -->
    <div class="border-t border-gray-100 p-4 bg-[#FAFAFA]">
      <button class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227l.173.013h9.24a2.708 2.708 0 002.707-3.227V6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.01z"></path></svg>
        AI 聊天助手
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component logic will be added here
</script>

<style scoped>
/* Scoped styles can be added here if needed */
</style>