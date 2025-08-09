<template>
  <main class="flex-1 bg-white flex flex-col">
    <div v-if="promptStore.isLoading" class="flex-1 flex items-center justify-center">
      <p class="text-gray-500">正在加载提示词详情...</p>
    </div>
    <div v-else-if="!prompt" class="flex-1 flex items-center justify-center">
      <p class="text-red-500">{{ promptStore.error || '未找到该提示词。' }}</p>
    </div>
    <template v-else>
      <!-- 详情头部 -->
      <header class="px-8 pt-6 pb-0">
        <div class="flex items-start justify-between mb-6">
          <div class="flex items-start gap-4">
            <button @click="router.back()" class="p-2 hover:bg-gray-50 rounded-lg transition-colors mt-1"><svg class="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg></button>
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-2xl font-medium text-[#374151]">{{ prompt.title }}</h1>
                <span class="px-3 py-1.5 text-xs font-medium rounded-full" :class="prompt.tagClass">{{ prompt.tag }}</span>
                <span v-if="prompt.status" class="inline-flex items-center gap-1.5 text-xs font-medium" :class="prompt.status === '公开' ? 'text-[#10B981]' : 'text-[#6B7280]'">
                  <div class="w-2 h-2 rounded-full" :class="prompt.status === '公开' ? 'bg-[#10B981]' : 'bg-[#6B7280]'"></div>{{ prompt.status }}
                </span>
              </div>
              <div class="flex items-center gap-4 text-sm text-[#6B7280]">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full" :class="prompt.authorAvatarClass"></div>
                  <span>由 <span class="text-[#374151] font-medium">{{ prompt.author }}</span> 创建</span>
                </div>
                <span v-if="prompt.updated">•</span>
                <span v-if="prompt.updated">{{ prompt.updated }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button class="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
              <svg class="w-5 h-5 text-[#6B7280] group-hover:text-[#374151]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </button>
            <button class="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group">
              <svg class="w-5 h-5 text-[#6B7280] group-hover:text-[#374151]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
            </button>
            <button class="px-6 py-2.5 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-[#374151] transition-colors flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span>立即使用</span>
            </button>
          </div>
        </div>
        <div class="flex items-center gap-6 border-b border-gray-100">
          <button v-for="tab in tabs" :key="tab.name" @click="activeTab = tab.name" class="px-1 py-3 text-sm font-medium" :class="activeTab === tab.name ? 'border-b-2 border-[#4B5563] text-[#374151]' : 'text-[#6B7280] hover:text-[#374151]'">
            {{ tab.name }}
          </button>
        </div>
      </header>

      <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC]">
        <div class="grid grid-cols-3 gap-6">
          <div class="col-span-2 space-y-6">
            <div class="bg-white rounded-xl p-6 border border-gray-100">
              <h3 class="text-base font-medium text-[#374151] mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                简介
              </h3>
              <p class="text-sm text-[#6B7280] leading-relaxed mb-4">{{ prompt.description }}</p>
            </div>

            <div v-if="prompt.features" class="bg-white rounded-xl p-6 border border-gray-100">
              <h3 class="text-base font-medium text-[#374151] mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                核心功能
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="feature in prompt.features" :key="feature.title" class="p-4 rounded-lg" :class="feature.bgClass">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center mb-3" :class="feature.iconBgClass" v-html="feature.icon"></div>
                  <h4 class="text-sm font-medium text-[#374151] mb-1">{{ feature.title }}</h4>
                  <p class="text-xs text-[#6B7280]">{{ feature.description }}</p>
                </div>
              </div>
            </div>

            <div v-if="prompt.examples" class="bg-white rounded-xl border border-gray-100">
              <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 class="text-base font-medium text-[#374151] flex items-center gap-2">
                  <svg class="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                  使用示例
                </h3>
              </div>
              <div class="p-6 space-y-4">
                <div v-for="example in prompt.examples" :key="example.tag" class="example-card bg-gray-50 rounded-lg p-4 border-l-4 transition-transform hover:translate-x-1" :class="example.borderColorClass">
                  <p class="text-sm text-[#374151] font-medium mb-2">原始表达：</p>
                  <p class="text-sm text-[#6B7280] mb-3">{{ example.original }}</p>
                  <p class="text-sm text-[#374151] font-medium mb-2">优化后：</p>
                  <p class="text-sm text-[#6B7280]">{{ example.optimized }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="space-y-6">
            <div class="bg-white rounded-xl p-6 border border-gray-100">
              <h3 class="text-base font-medium text-[#374151] mb-4">使用统计</h3>
              <div class="space-y-4">
                <div v-for="stat in stats" :key="stat.label">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-[#6B7280]">{{ stat.label }}</span>
                    <span class="text-sm font-medium text-[#374151]">{{ stat.value }}</span>
                  </div>
                  <div class="w-full bg-gray-100 rounded-full h-2">
                    <div class="h-2 rounded-full" :class="stat.barClass" :style="{width: stat.width}"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePromptStore } from '@/prompt/stores/promptStore';

const route = useRoute();
const router = useRouter();
const promptStore = usePromptStore();

const prompt = computed(() => promptStore.currentPrompt);

const activeTab = ref('概览');
const tabs = ref([
  { name: '概览' },
  { name: '模板详情' },
  { name: '评价' },
  { name: '使用指南' },
  { name: '版本历史' },
]);

const fetchPrompt = (id: string) => {
  promptStore.fetchPromptById(id);
};

onMounted(() => {
  fetchPrompt(route.params.id as string);
});

watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchPrompt(newId as string);
  }
});

const stats = computed(() => {
  if (!prompt.value) return [];
  return [
    { label: '收藏数', value: prompt.value.likes.toLocaleString(), width: '85%', barClass: 'bg-gradient-to-r from-blue-500 to-purple-500' },
    { label: '使用次数', value: (prompt.value.usage || 0).toLocaleString(), width: '92%', barClass: 'bg-gradient-to-r from-green-500 to-teal-500' },
    { label: '查看次数', value: prompt.value.views.toLocaleString(), width: '70%', barClass: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
  ]
});
</script>