<template>
  <div class="min-h-screen p-8 bg-[#F5F5F7]">
    <div class="max-w-[1200px] mx-auto">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-2xl font-light text-[#374151] mb-2">上下文预览</h1>
        <p class="text-[#6B7280]">在执行AI任务前，检查并确认将要提供给AI的全部信息。</p>
      </div>

      <!-- 主内容区 -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <!-- 顶部操作栏 -->
        <div class="h-16 px-8 flex items-center justify-between border-b border-gray-100">
          <button class="text-sm text-[#6B7280] hover:text-[#374151] transition-colors flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
            返回编辑器
          </button>
        </div>

        <!-- 上下文列表 -->
        <div class="p-8 space-y-4">
          <!-- 固定上下文 -->
          <div class="border border-gray-100 rounded-xl overflow-hidden">
            <div class="px-6 py-4 bg-[#FAFAFA] cursor-pointer hover:bg-[#F3F4F6] transition-colors flex items-center justify-between">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-[#4B5563] collapse-arrow" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                <svg class="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <div>
                  <h3 class="font-medium text-[#374151]">固定上下文</h3>
                  <p class="text-xs text-[#9CA3AF] mt-0.5">始终包含在 AI 对话中的基础信息</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-xs text-[#9CA3AF]">648 字符</span>
                <label class="flex items-center gap-2 cursor-pointer">
                  <span class="text-xs text-[#6B7280]">启用</span>
                  <input type="checkbox" class="w-4 h-4 text-[#4B5563] border-gray-300 rounded focus:ring-[#4B5563]" checked>
                </label>
              </div>
            </div>
            <div class="collapse-content">
              <!-- Collapsed Content -->
            </div>
          </div>

          <!-- 动态上下文 -->
          <div class="border border-gray-100 rounded-xl overflow-hidden">
            <div class="px-6 py-4 bg-[#FAFAFA] cursor-pointer hover:bg-[#F3F4F6] transition-colors flex items-center justify-between">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-[#4B5563] collapse-arrow" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                <svg class="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                <div>
                  <h3 class="font-medium text-[#374151]">动态上下文</h3>
                  <p class="text-xs text-[#9CA3AF] mt-0.5">根据当前创作内容自动更新的信息</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-xs text-[#9CA3AF]">892 字符</span>
                <label class="flex items-center gap-2 cursor-pointer">
                  <span class="text-xs text-[#6B7280]">启用</span>
                  <input type="checkbox" class="w-4 h-4 text-[#4B5563] border-gray-300 rounded focus:ring-[#4B5563]" checked>
                </label>
              </div>
            </div>
            <div class="collapse-content">
            </div>
          </div>

          <!-- RAG 上下文 -->
          <div class="border border-gray-100 rounded-xl overflow-hidden">
            <div class="px-6 py-4 bg-[#FAFAFA] cursor-pointer hover:bg-[#F3F4F6] transition-colors flex items-center justify-between">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-[#4B5563] collapse-arrow" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                <svg class="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                <div>
                  <h3 class="font-medium text-[#374151]">RAG 上下文</h3>
                  <p class="text-xs text-[#9CA3AF] mt-0.5">从知识库检索的相关参考信息</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-xs text-[#9CA3AF]">456 字符</span>
                <label class="flex items-center gap-2 cursor-pointer">
                  <span class="text-xs text-[#6B7280]">启用</span>
                  <input type="checkbox" class="w-4 h-4 text-[#4B5563] border-gray-300 rounded focus:ring-[#4B5563]" checked>
                </label>
              </div>
            </div>
            <div class="collapse-content">
            </div>
          </div>
          <div class="border border-gray-100 rounded-xl overflow-hidden">
            <div class="px-6 py-4 bg-[#FAFAFA] cursor-pointer hover:bg-[#F3F4F6] transition-colors flex items-center justify-between">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-[#4B5563] collapse-arrow expanded" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                <svg class="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                <div>
                  <h3 class="font-medium text-[#374151]">提示词</h3>
                  <p class="text-xs text-[#9CA3AF] mt-0.5">当前任务的具体指令</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-xs text-[#9CA3AF]">462 字符</span>
                <label class="flex items-center gap-2 cursor-pointer">
                  <span class="text-xs text-[#6B7280]">启用</span>
                  <input type="checkbox" class="w-4 h-4 text-[#4B5563] border-gray-300 rounded focus:ring-[#4B5563]" checked>
                </label>
              </div>
            </div>
            <div class="collapse-content expanded">
              <div class="px-6 py-4 border-t border-gray-100">
                <textarea class="context-textarea" placeholder="输入提示词...">请续写下一段内容，要求：

1. 延续当前紧张神秘的氛围
2. 详细描写空间站内部的环境细节
3. 通过卡尔文的视角展现他的内心活动
4. 适当加入一些技术细节增强科幻感
5. 在段落末尾设置一个小悬念，引导读者继续阅读
6. 字数控制在 300-400 字左右

重点描写方向：卡尔文进入空间站控制室，发现仍在运行的神秘设备，以及他对这些发现的反应和推测。</textarea>
              </div>
            </div>
          </div>
        </div>

        <div class="px-8 py-4 bg-[#FAFAFA] border-t border-gray-100 flex items-center justify-between">
          <div class="flex items-center gap-6 text-xs text-[#9CA3AF]">
            <span>加载时间: 36ms</span>
          </div>
          <div class="flex items-center gap-3">
            <button class="px-4 py-2 text-sm text-[#6B7280] bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              取消
            </button>
            <button class="px-4 py-2 bg-[#10B981] text-white rounded-lg text-sm font-medium hover:bg-[#059669] transition-colors">
              执行
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.collapse-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.collapse-content.expanded {
  max-height: 500px; /* Or a sufficiently large value */
  transition: max-height 0.3s ease-in;
}

.collapse-arrow {
  transition: transform 0.3s ease;
}

.collapse-arrow.expanded {
  transform: rotate(90deg);
}

.context-textarea {
  background: transparent;
  border: none;
  resize: none;
  outline: none;
  width: 100%;
  line-height: 1.6;
  color: #6B7280;
  font-size: 14px;
  padding: 12px 16px;
  min-height: 100px;
  transition: background-color 0.2s ease;
}

.context-textarea:focus {
  background: #F9FAFB;
  border-radius: 8px;
}
</style>