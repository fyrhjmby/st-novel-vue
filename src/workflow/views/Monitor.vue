<template>
  <div class="flex flex-col h-full w-full bg-white">
    <!-- 监控页面专属工具栏 -->
    <div class="px-8 py-3 flex items-center justify-between border-b border-gray-100 bg-white flex-shrink-0">
      <div>
        <h1 class="text-base font-medium text-[#374151]">实时监控: <span class="font-mono">#RUN-f8a1b3</span></h1>
        <p class="text-sm text-[#9CA3AF] mt-1">工作流: 社交媒体帖子生成器</p>
      </div>
      <div class="flex items-center gap-4">
        <span class="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full font-medium">
            <svg class="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            运行中
        </span>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">进度</span>
          <div class="w-32 bg-gray-200 rounded-full h-2">
            <div class="bg-blue-600 h-2 rounded-full" style="width: 45%"></div>
          </div>
          <span class="text-sm font-medium text-gray-700">45%</span>
        </div>
        <button class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          停止
        </button>
      </div>
    </div>

    <div class="flex-1 flex overflow-hidden">
      <div class="flex-1 workflow-canvas-bg relative p-8">
        <div class="absolute top-4 right-4 bg-white rounded-lg shadow-md border border-gray-200 p-4 w-64">
          <h4 class="text-sm font-medium text-gray-700 mb-3">实时性能</h4>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between"><span class="text-gray-500">CPU使用率</span><span class="font-medium text-gray-700">23%</span></div>
            <div class="flex justify-between"><span class="text-gray-500">内存占用</span><span class="font-medium text-gray-700">156MB</span></div>
            <div class="flex justify-between"><span class="text-gray-500">已用Token</span><span class="font-medium text-gray-700">342 / 850</span></div>
            <div class="flex justify-between"><span class="text-gray-500">已用时间</span><span class="font-medium text-gray-700">00:03:21</span></div>
          </div>
        </div>

        <div class="absolute" style="top: 80px; left: 80px;">
          <div class="w-64 bg-white rounded-xl shadow-md border-2 border-green-500">
            <div class="p-3 border-b border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-2"><div class="p-1 rounded-md bg-green-100 text-green-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"/></svg></div><p class="font-medium text-sm text-[#374151]">开始</p></div>
              <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            </div>
            <div class="p-3 text-xs text-gray-500"><span class="font-semibold text-green-700">已完成</span> (0.1s)<div class="mt-2 bg-gray-50 rounded p-2"><p class="text-gray-600">输入: "AI在创意写作中的应用"</p></div></div>
          </div>
        </div>
        <div class="absolute" style="top: 220px; left: 390px;">
          <div class="w-64 bg-white rounded-xl shadow-md border-2 border-blue-500 running-node">
            <div class="p-3 border-b border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-2"><div class="p-1 rounded-md bg-blue-100 text-blue-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg></div><p class="font-medium text-sm text-[#374151]">大语言模型</p></div>
              <svg class="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </div>
            <div class="p-3 text-xs text-gray-500"><span class="font-semibold text-blue-700">运行中...</span><div class="mt-2 space-y-1"><div class="flex justify-between"><span>Token使用</span><span>342 / 850</span></div><div class="w-full bg-gray-200 rounded-full h-1"><div class="bg-blue-600 h-1 rounded-full" style="width: 40%"></div></div></div></div>
          </div>
        </div>
        <div class="absolute" style="top: 360px; left: 690px;">
          <div class="w-64 bg-white rounded-xl shadow-md border border-gray-200 opacity-60">
            <div class="p-3 border-b border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-2"><div class="p-1 rounded-md bg-red-100 text-red-600"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg></div><p class="font-medium text-sm text-gray-500">结束</p></div>
            </div>
            <div class="p-3 text-xs text-gray-400"><span class="font-semibold">等待中</span></div>
          </div>
        </div>
      </div>

      <aside class="w-96 bg-[#F9FAFB] border-l border-gray-200 flex flex-col">
        <div class="p-5 border-b border-gray-200 flex items-center justify-between">
          <h3 class="font-medium text-[#374151]">运行日志</h3>
          <div class="flex items-center gap-2">
            <button class="p-1 hover:bg-gray-200 rounded text-gray-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg></button>
            <button class="p-1 hover:bg-gray-200 rounded text-gray-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></button>
          </div>
        </div>
        <div class="flex-1 p-5 space-y-4 overflow-y-auto font-mono text-xs leading-relaxed">
          <div class="flex gap-3"><span class="text-gray-400 flex-shrink-0">10:30:01</span><span class="text-green-500">[成功]</span><p class="text-gray-600">工作流启动</p></div>
          <div class="flex gap-3"><span class="text-gray-400 flex-shrink-0">10:30:01</span><span class="text-green-500">[成功]</span><p class="text-gray-600">节点 [开始] 执行完毕 (0.1s)</p></div>
          <div class="flex gap-3"><span class="text-gray-400 flex-shrink-0">10:30:02</span><span class="text-blue-500">[信息]</span><p class="text-gray-600">节点 [大语言模型] 开始执行...</p></div>
          <div class="flex gap-3"><span class="text-gray-400 flex-shrink-0">10:30:03</span><span class="text-blue-500">[信息]</span><p class="text-gray-600">向 GPT-4-Turbo 发送请求</p></div>
          <div class="flex gap-3 bg-blue-50 -mx-5 px-5 py-2"><span class="text-gray-400 flex-shrink-0">10:30:04</span><span class="text-blue-500">[调试]</span><div class="text-gray-600"><p>API请求详情:</p><pre class="mt-1 text-xs bg-white rounded p-2 border border-blue-200">{
"model": "gpt-4-turbo",
"temperature": 0.7,
"max_tokens": 1000
}</pre></div></div>
          <div class="flex gap-3"><span class="text-gray-400 flex-shrink-0">10:30:05</span><span class="text-blue-500">[信息]</span><p class="text-gray-600">正在生成内容...</p></div>
        </div>
        <div class="p-5 border-t border-gray-200">
          <h4 class="text-sm font-medium text-gray-700 mb-3">实时输出预览</h4>
          <div class="bg-white rounded-lg border border-gray-200 p-3 text-sm">
            <p class="text-gray-600 leading-relaxed"><span class="text-blue-600">🤖 AI正在创造魔法...</span> 想象一下，当作家遇到创作瓶颈时，AI就像一位永不疲倦的灵感缪斯</p>
            <div class="mt-2 flex items-center justify-between text-xs text-gray-500"><span>字数: 42 / 280</span><span class="animate-pulse">生成中...</span></div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>