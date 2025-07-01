<template>
  <div class="flex-1 flex overflow-hidden">
    <!-- 左侧聊天列表 -->
    <aside class="w-80 bg-[#FAFAFA] border-r border-gray-100 flex flex-col flex-shrink-0">
      <div class="p-4 border-b border-gray-100">
        <button class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5V19M5 12H19"/></svg>
          新建对话
        </button>
      </div>

      <div class="flex-1 p-4 space-y-2 overflow-y-auto">
        <!-- 选中状态 -->
        <a href="#" class="block p-3 bg-[#EFF6FF] border border-[#3B82F6] rounded-lg">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"></path></svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm text-[#374151] truncate">角色性格讨论</p>
              <p class="text-xs text-[#6B7280] truncate mt-1">关于卡尔文的内心世界...</p>
              <p class="text-xs text-[#9CA3AF] mt-2">2小时前</p>
            </div>
          </div>
        </a>

        <!-- 未选中状态 -->
        <a href="#" class="block p-3 hover:bg-gray-100 rounded-lg transition-colors">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-[#F3F4F6] rounded-full flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-[#6B7280]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v6h-2z"></path></svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm text-[#374151] truncate">情节灵感</p>
              <p class="text-xs text-[#6B7280] truncate mt-1">跃迁点的科学原理...</p>
              <p class="text-xs text-[#9CA3AF] mt-2">昨天</p>
            </div>
          </div>
        </a>
      </div>
    </aside>

    <!-- 右侧聊天界面 -->
    <main class="flex-1 flex flex-col bg-white">
      <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-gradient-to-br from-[#4B5563] to-[#374151] rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M12 4.5v15M15.75 21v-1.5" /></svg>
          </div>
          <div>
            <h2 class="font-medium text-[#374151]">AI创作助手</h2>
            <button class="text-sm text-[#6B7280] flex items-center gap-2 hover:text-[#374151] transition-colors mt-1">
              <span class="w-2 h-2 bg-[#10B981] rounded-full"></span>
              在线 • GPT-4o
              <svg class="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"></path></svg>
            </button>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button class="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="上下文管理">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
          </button>
          <button class="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="设置">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-.95.542.057 1.007.56 1.061 1.11L12 8.583l.235-3.535c.057-.542.56-1.007 1.11-.95.542.057 1.007.56 1.061 1.11L15.417 8.583l3.536-.235c.542-.057 1.007.56 1.061 1.11.057.542-.42 1.007-.95 1.061l-3.536.235.235 3.536c.057.542-.42 1.007-.95 1.061-.542.057-1.007-.42-1.061-.95L12 15.417l-.235 3.536c-.057.542-.56 1.007-1.11.95-.542-.057-1.007-.56-1.061-1.11L9.417 15.417l-3.536.235c-.542-.057-1.007-.42-.95-1.061.057-.542.42-1.007.95-1.061l3.536-.235-.235-3.536c-.057-.542.42-1.007.95-1.061.542-.057 1.007.42 1.061.95L12 9.417l.235-3.536zM12 14.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" /></svg>
          </button>
        </div>
      </header>

      <div class="flex-1 p-6 overflow-y-auto">
        <div class="max-w-3xl mx-auto space-y-6">
          <!-- 用户消息 -->
          <div class="flex justify-end">
            <div class="bg-[#3B82F6] text-white p-4 rounded-xl rounded-br-lg max-w-[70%] text-sm">
              我想讨论一下卡尔文这个角色的内心世界。在面对跃迁点时，他应该有什么样的心理活动？
            </div>
          </div>

          <!-- AI回复 -->
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-gradient-to-br from-[#4B5563] to-[#374151] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M12 4.5v15M15.75 21v-1.5" /></svg>
            </div>
            <div class="bg-[#F3F4F6] text-[#374151] p-4 rounded-xl rounded-bl-lg max-w-[70%] text-sm">
              <p class="mb-3">当然，这是一个很好的切入点。卡尔文在面对跃迁点时的心理活动可以从多个层面展现：</p>
              <ol class="list-decimal list-inside space-y-2">
                <li><strong>希望与恐惧的交织</strong>：跃迁点代表着回家的可能，但也意味着巨大的未知风险。可以描写他手心出汗，但眼神却异常明亮。</li>
                <li><strong>孤独感的顶峰</strong>：在做出这个重大决定时，他比任何时候都更加意识到自己的孤独。没有战友，只有AI。</li>
                <li><strong>对过去的眷恋</strong>："回家"这个词会触发他的记忆闸门，可以闪回一些与家人或恋人的片段。</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="p-4 border-t border-gray-100 bg-[#FAFAFA]">
        <div class="flex gap-3 items-end max-w-3xl mx-auto">
          <button class="w-9 h-9 flex-shrink-0 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3.375 3.375 0 1118.375 12.74z" /></svg>
          </button>
          <div class="flex-1 bg-white border border-gray-200 rounded-lg focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-shadow">
            <textarea
                class="w-full bg-transparent p-2.5 text-sm text-[#374151] resize-none outline-none"
                placeholder="输入您的问题，按 Enter 发送"
                rows="1"
            ></textarea>
          </div>
          <button class="w-10 h-10 flex-shrink-0 bg-[#4B5563] text-white rounded-lg hover:bg-[#374151] transition-colors flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"></path></svg>
          </button>
        </div>
        <div class="text-center mt-2 text-xs text-[#9CA3AF]">
          <span>按 Shift+Enter 换行 • 当前会话: 1,847 tokens</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Chat logic will be implemented here
</script>

<style scoped>
/* Scoped styles can be added here if needed */
</style>