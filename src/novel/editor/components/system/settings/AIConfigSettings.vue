<template>
  <div class="aiconfig-view-container">
    <!-- Left Sidebar for Task Navigation -->
    <div class="aiconfig-sidebar">
      <h3 class="sidebar-title">AI 任务类型</h3>
      <nav class="sidebar-nav">
        <a
            v-for="task in availableTasks"
            :key="task.id"
            href="#"
            @click.prevent="activeTaskId = task.id"
            :class="['nav-item', { 'active': activeTaskId === task.id }]"
        >
          <i :class="[task.icon, 'nav-item-icon']"></i>
          <span>{{ task.name }}</span>
        </a>
      </nav>
    </div>

    <!-- Right Content Area: USES YOUR ORIGINAL UI CODE FROM AITaskConfigModal.vue -->
    <div class="aiconfig-content custom-scrollbar">
      <div v-if="activeTask" class="p-6 space-y-6">
        <!-- Header copied from your original UI -->
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-medium text-[#374151]">AI任务配置 - {{ activeTask.name }}</h3>
            <p class="text-sm text-[#6B7280] mt-1">配置AI助手如何处理您的内容</p>
          </div>
        </div>

        <!-- AI模型配置 copied from your original UI -->
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

        <!-- 提示词选择 copied from your original UI -->
        <div>
          <label for="prompt-template" class="text-sm font-medium text-[#374151] block mb-3">任务提示词模板</label>
          <select id="prompt-template" class="w-full text-sm px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            <option v-for="prompt in activeTask.prompts" :key="prompt" :selected="prompt === activeTask.defaultPrompt">{{ prompt }}</option>
          </select>
        </div>

        <!-- 上下文选择 copied from your original UI -->
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

        <!-- 高级设置 copied from your original UI -->
        <div>
          <label class="text-sm font-medium text-[#374151] block mb-3">高级设置</label>
          <div class="space-y-4 p-4 bg-[#F9FAFB] rounded-lg border border-gray-100">
            <div class="flex items-center justify-between">
              <span class="text-sm text-[#6B7280]">创作温度</span>
              <div class="flex items-center gap-3">
                <input type="range" min="0" max="100" value="70" class="w-32 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider">
                <span class="text-sm font-mono text-[#374151] w-8 text-right">0.7</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-[#6B7280]">保留原文风格</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked>
                <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#4B5563] peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const activeTaskId = ref('polish');

const availableTasks = ref([
  {
    id: 'polish',
    name: '润色',
    icon: 'fa-solid fa-palette',
    defaultPrompt: '文学润色 - 注重修辞和意境',
    prompts: ['文学润色 - 注重修辞和意境', '简洁优化 - 删繁就简', '情感强化 - 增强情感表达']
  },
  {
    id: 'continue',
    name: '续写',
    icon: 'fa-solid fa-wand-magic-sparkles',
    defaultPrompt: '标准续写',
    prompts: ['标准续写', '悬念式结尾', '对话场景续写', '动作场景续写']
  },
  {
    id: 'analyze',
    name: '分析',
    icon: 'fa-solid fa-magnifying-glass-chart',
    defaultPrompt: '情节结构分析',
    prompts: ['情节结构分析', '人物弧光分析', '修辞手法分析', '市场潜力评估']
  }
]);

const activeTask = computed(() => availableTasks.value.find(t => t.id === activeTaskId.value));
</script>

<style scoped>
.aiconfig-view-container { display: flex; height: 100%; width: 100%; }
.aiconfig-sidebar { width: 220px; background-color: #F9FAFB; border-right: 1px solid #E5E7EB; padding: 1.5rem 1rem; flex-shrink: 0; }
.sidebar-title { padding: 0 0.75rem; font-size: 0.75rem; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; }
.sidebar-nav { display: flex; flex-direction: column; gap: 0.25rem; }
.nav-item { display: flex; align-items: center; padding: 0.6rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #374151; text-decoration: none; transition: background-color 0.2s, color 0.2s; }
.nav-item:hover { background-color: #F3F4F6; }
.nav-item.active { background-color: #EBF1FD; color: #2563EB; }
.nav-item-icon { width: 1.25rem; text-align: center; margin-right: 0.75rem; }

.aiconfig-content { flex-grow: 1; overflow-y: auto; background-color: #FFFFFF; }

.custom-scrollbar::-webkit-scrollbar { display: block; width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

.range-slider { -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; }
.range-slider::-webkit-slider-runnable-track { background: #E5E7EB; height: 0.25rem; border-radius: 0.25rem; }
.range-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; margin-top: -6px; background-color: #ffffff; height: 1rem; width: 1rem; border-radius: 50%; border: 1px solid #D1D5DB; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
.range-slider:focus::-webkit-slider-thumb { outline: 2px solid transparent; outline-offset: 2px; box-shadow: 0 0 0 3px #3B82F640; }
</style>