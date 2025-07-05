// 文件路径: src\novel\context_preview\views\ContextPreviewView.vue

<template>
  <div
      v-if="isVisible"
      class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      @click.self="handleCancel"
  >
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
      <!-- 头部 -->
      <div class="flex-shrink-0 px-8 py-5 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h1 class="text-xl font-semibold text-[#374151]">上下文预览</h1>
          <p class="text-sm text-[#6B7280] mt-1">{{ taskInfoText }}</p>
        </div>
        <button @click="handleCancel" class="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <!-- 上下文列表 (可滚动) -->
      <div class="flex-grow p-6 space-y-4 overflow-y-auto bg-gray-50/50">
        <!-- 固定上下文 -->
        <div class="border border-gray-200/70 rounded-lg overflow-hidden bg-white shadow-sm">
          <div @click="toggleCollapse('fixed')" class="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between">
            <div class="flex items-center gap-4">
              <svg class="w-5 h-5 text-gray-400 collapse-arrow" :class="{ 'expanded': collapsedStates.fixed }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
              <svg class="w-6 h-6 text-[#6B7280]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <div>
                <h3 class="font-medium text-[#374151]">固定上下文</h3>
                <p class="text-xs text-[#9CA3AF] mt-0.5">始终包含在 AI 对话中的基础信息</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-xs text-[#9CA3AF]">648 字符</span>
              <label @click.stop class="flex items-center gap-2 cursor-pointer">
                <span class="text-xs text-[#6B7280]">启用</span>
                <input type="checkbox" class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" checked>
              </label>
            </div>
          </div>
          <div class="collapse-content" :class="{ 'expanded': collapsedStates.fixed }">
            <div class="px-6 pb-4 border-t border-gray-100 pt-4 text-sm text-gray-600">内容占位...</div>
          </div>
        </div>

        <!-- 动态上下文 -->
        <div class="border border-gray-200/70 rounded-lg overflow-hidden bg-white shadow-sm">
          <div @click="toggleCollapse('dynamic')" class="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between">
            <div class="flex items-center gap-4">
              <svg class="w-5 h-5 text-gray-400 collapse-arrow" :class="{ 'expanded': collapsedStates.dynamic }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
              <svg class="w-6 h-6 text-[#6B7280]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <div>
                <h3 class="font-medium text-[#374151]">动态上下文</h3>
                <p class="text-xs text-[#9CA3AF] mt-0.5">根据当前创作内容自动更新的信息</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-xs text-[#9CA3AF]">892 字符</span>
              <label @click.stop class="flex items-center gap-2 cursor-pointer">
                <span class="text-xs text-[#6B7280]">启用</span>
                <input type="checkbox" class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" checked>
              </label>
            </div>
          </div>
          <div class="collapse-content" :class="{ 'expanded': collapsedStates.dynamic }">
            <div class="px-6 pb-4 border-t border-gray-100 pt-4 text-sm text-gray-600">内容占位...</div>
          </div>
        </div>

        <!-- RAG 上下文 -->
        <div class="border border-gray-200/70 rounded-lg overflow-hidden bg-white shadow-sm">
          <div @click="toggleCollapse('rag')" class="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between">
            <div class="flex items-center gap-4">
              <svg class="w-5 h-5 text-gray-400 collapse-arrow" :class="{ 'expanded': collapsedStates.rag }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
              <svg class="w-6 h-6 text-[#6B7280]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
              <div>
                <h3 class="font-medium text-[#374151]">RAG 上下文</h3>
                <p class="text-xs text-[#9CA3AF] mt-0.5">从知识库检索的相关参考信息</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-xs text-[#9CA3AF]">456 字符</span>
              <label @click.stop class="flex items-center gap-2 cursor-pointer">
                <span class="text-xs text-[#6B7280]">启用</span>
                <input type="checkbox" class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" checked>
              </label>
            </div>
          </div>
          <div class="collapse-content" :class="{ 'expanded': collapsedStates.rag }">
            <div class="px-6 pb-4 border-t border-gray-100 pt-4 text-sm text-gray-600">内容占位...</div>
          </div>
        </div>

        <!-- 提示词 -->
        <div class="border border-gray-200/70 rounded-lg overflow-hidden bg-white shadow-sm">
          <div @click="toggleCollapse('prompt')" class="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between">
            <div class="flex items-center gap-4">
              <svg class="w-5 h-5 text-gray-400 collapse-arrow" :class="{ 'expanded': collapsedStates.prompt }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
              <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <div>
                <h3 class="font-medium text-[#374151]">提示词</h3>
                <p class="text-xs text-[#9CA3AF] mt-0.5">当前任务的具体指令</p>
              </div>
            </div>
          </div>
          <div class="collapse-content" :class="{ 'expanded': collapsedStates.prompt }">
            <div class="border-t border-gray-100">
              <textarea class="context-textarea" readonly>请续写下一段内容，要求：

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

      <!-- 尾部 -->
      <div class="flex-shrink-0 px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
        <div class="text-xs text-gray-400">
          <span>加载时间: 36ms</span>
        </div>
        <div class="flex items-center gap-3">
          <button @click="handleCancel" class="px-5 py-2 text-sm font-medium text-[#374151] bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
            取消
          </button>
          <button @click="handleExecute" class="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
            <i class="fa-solid fa-bolt fa-sm"></i>
            <span>执行</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useContextMenuStore } from '@/novel/context_preview/stores/contextPreviewStore';

const contextPreviewStore = useContextMenuStore();

const collapsedStates = reactive({
  fixed: false,
  dynamic: false,
  rag: false,
  prompt: true,
});

const isVisible = computed(() => contextPreviewStore.isVisible);
const task = computed(() => contextPreviewStore.task);

const taskInfoText = computed(() => {
  if (task.value) {
    return `即将对《${task.value.title}》执行AI任务：${task.value.type}。`;
  }
  return '检查并确认将要提供给AI的全部信息。';
});

const handleExecute = () => {
  contextPreviewStore.execute();
};

const handleCancel = () => {
  contextPreviewStore.hide();
};

const toggleCollapse = (section: keyof typeof collapsedStates) => {
  collapsedStates[section] = !collapsedStates[section];
};
</script>

<style scoped>
.collapse-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.collapse-content.expanded {
  max-height: 500px;
  transition: max-height 0.35s ease-in;
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
  line-height: 1.7;
  color: #4B5563;
  font-size: 14px;
  padding: 1rem 1.5rem;
  min-height: 200px;
  cursor: default;
}
</style>