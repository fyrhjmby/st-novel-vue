// =
// 文件: ..\src\novel\shared\components\GlobalAIAssistant\AITaskConfigModal.vue
//

<template>
  <!-- Modal-Backdrop -->
  <!-- 使用 v-if 和从 useAITaskStore 获取的全局状态来控制显示 -->
  <div v-if="isConfigModalOpen" @click.self="closeTaskConfig" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-opacity duration-300">

    <!-- Modal-Container -->
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-100 flex flex-col max-h-[90vh] transition-transform duration-300 scale-95 animate-fade-in-up">
      <div class="p-6 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
        <div>
          <!-- 标题现在是动态的, 从 computed property 'taskTitle' 获取 -->
          <h3 class="text-lg font-medium text-[#374151]">AI任务配置 - {{ taskTitle }}</h3>
          <p class="text-sm text-[#6B7280] mt-1">配置AI助手如何处理您的内容</p>
        </div>
        <!-- 点击关闭按钮时调用全局的关闭方法 -->
        <button @click="closeTaskConfig" class="w-9 h-9 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors">
          <svg class="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="p-6 space-y-6 overflow-y-auto custom-scrollbar">
        <!-- AI模型配置 -->
        <div>
          <label class="flex items-center justify-between mb-3">
            <span class="text-sm font-medium text-[#374151]">AI模型选择</span>
            <a href="#" class="text-xs text-[#3B82F6] cursor-pointer flex items-center gap-1.5 hover:underline">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
              了解模型差异
            </a>
          </label>
          <select class="w-full text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            <option selected>GPT-4o (推荐 - 均衡性能)</option>
            <option>Claude 3 Opus (文学创作专长)</option>
            <option>混合模型 (多模型协作)</option>
            <option>自定义微调模型</option>
          </select>
        </div>

        <!-- 提示词选择 -->
        <div>
          <label for="prompt-template" class="text-sm font-medium text-[#374151] block mb-3">任务提示词模板</label>
          <select id="prompt-template" class="w-full text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            <option selected>文学润色 - 注重修辞和意境</option>
            <option>简洁优化 - 删繁就简，保留精华</option>
            <option>情感强化 - 增强情感表达</option>
            <option>节奏调整 - 优化叙事节奏</option>
          </select>
        </div>

        <!-- 上下文选择 -->
        <div>
          <label class="text-sm font-medium text-[#374151] block mb-3">上下文配置</label>
          <div class="space-y-3">
            <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-[#4B5563]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                  </div>
                  <div>
                    <p class="font-medium text-sm text-[#374151]">固定上下文</p>
                    <p class="text-xs text-[#9CA3AF]">小说设定、人物档案、世界观</p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" class="sr-only peer" checked><div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#4B5563] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div></label>
              </div>
            </div>

            <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-[#4B5563]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19.5 12c0-5.23-4.27-9.5-9.5-9.5S.5 6.77.5 12s4.27 9.5 9.5 9.5M12 2v2m0 18v-2M4.5 4.5l1.42 1.42M18.08 18.08l-1.42-1.42m0-11.32l1.42-1.42M4.5 19.5l1.42-1.42M2 12h2m18 0h-2"></path></svg>
                  </div>
                  <div>
                    <p class="font-medium text-sm text-[#374151]">动态上下文</p>
                    <p class="text-xs text-[#9CA3AF]">自动包含前后相关章节</p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" class="sr-only peer" checked><div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#4B5563] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div></label>
              </div>
            </div>

            <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-[#F3F4F6] rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-[#4B5563]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                  </div>
                  <div>
                    <p class="font-medium text-sm text-[#374151]">RAG智能搜索</p>
                    <p class="text-xs text-[#9CA3AF]">自动检索相关内容</p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" class="sr-only peer"><div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#4B5563] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div></label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="text-sm font-medium text-[#374151] block mb-3">高级设置</label>
          <div class="space-y-4 p-4 bg-[#F9FAFB] rounded-lg border border-gray-100">
            <div class="flex items-center justify-between">
              <span class="text-sm text-[#6B7280]">创作温度</span>
              <div class="flex items-center gap-3">
                <input type="range" min="0" max="100" value="70" class="w-32 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                <span class="text-sm font-mono text-[#374151] w-8 text-right">0.7</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-[#6B7280]">保留原文风格</span>
              <label class="relative inline-flex items-center cursor-pointer"><input type="checkbox" class="sr-only peer" checked><div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#4B5563] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div></label>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 bg-[#FAFAFA] border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
        <button @click="closeTaskConfig" class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-colors">取消</button>
        <button @click="closeTaskConfig" class="px-4 py-2 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4.5 12.75l6 6 9-13.5" /></svg>
          保存配置并执行
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// [修复] 导入路径已更新为正确的共享模块位置
import { useAITaskStore } from '@/novel/shared/composables/useAITaskStore';

const { isConfigModalOpen, taskTitle, closeTaskConfig } = useAITaskStore();
</script>

<style scoped>
/* 添加一个简单的动画效果 */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out forwards;
}

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

/* Custom range input style */
input[type=range] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}
input[type=range]::-webkit-slider-runnable-track {
  background: #E5E7EB;
  height: 0.25rem;
  border-radius: 0.25rem;
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  margin-top: -6px;
  background-color: #ffffff;
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  border: 1px solid #D1D5DB;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
input[type=range]:focus::-webkit-slider-thumb {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px #3B82F640;
}
</style>