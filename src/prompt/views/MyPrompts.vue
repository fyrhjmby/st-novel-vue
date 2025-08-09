<template>
  <main class="flex-1 bg-white flex flex-col">
    <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100">
      <h1 class="text-lg font-medium text-[#374151]">我的提示词</h1>
      <router-link :to="{ name: 'prompt-editor-new' }" class="px-5 py-2.5 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-[#374151] transition-colors flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
        <span>创建新提示词</span>
      </router-link>
    </header>
    <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC]">
      <!-- 统计概览 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-xl p-5 border border-gray-100">
          <div class="flex items-center justify-between mb-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="stat.iconBgClass" v-html="stat.icon"></div>
            <span v-if="stat.trend" class="text-xs font-medium px-2 py-1 rounded-full" :class="stat.trendClass" >{{ stat.trend }}</span>
          </div>
          <p class="text-2xl font-light text-[#374151]">{{ stat.value }}</p>
          <p class="text-sm text-[#9CA3AF] mt-1">{{ stat.label }}</p>
        </div>
      </div>

      <!-- 筛选和视图切换 -->
      <div class="bg-white rounded-xl p-6 border border-gray-100 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="relative">
              <svg class="w-5 h-5 text-[#9CA3AF] absolute top-1/2 left-3 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/></svg>
              <input type="text" placeholder="搜索我的提示词..." class="w-64 bg-gray-50 border border-gray-200 rounded-lg h-10 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B5563]/20 focus:bg-white focus:border-[#4B5563] transition">
            </div>
          </div>
        </div>
      </div>

      <!-- 提示词网格视图 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="prompt in promptStore.myPrompts" :key="prompt.id" class="prompt-card bg-white rounded-xl p-6 border border-gray-100 relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
          <div class="absolute top-3 right-3">
            <button @click.stop="openDeleteModal(prompt)" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
          <router-link :to="{ name: 'prompt-detail', params: { id: prompt.id } }" class="block">
            <div class="flex items-start gap-4 mb-4">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" :class="prompt.iconBgClass" v-html="prompt.icon"></div>
              <div class="flex-1">
                <h4 class="font-medium text-[#374151] mb-1 flex items-center gap-2">{{ prompt.title }}</h4>
                <span class="text-xs font-medium px-2 py-1 rounded-full" :class="prompt.tagClass">{{ prompt.tag }}</span>
              </div>
            </div>
            <p class="text-sm text-[#9CA3AF] mb-4 line-clamp-2">{{ prompt.description }}</p>
          </router-link>
          <div class="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
            <router-link :to="{ name: 'prompt-editor-edit', params: { id: prompt.id } }" class="flex-1 px-3 py-2 bg-gray-50 text-[#6B7280] rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors text-center">编辑</router-link>
            <button class="flex-1 px-3 py-2 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-[#374151] transition-colors">使用</button>
          </div>
        </div>
        <router-link :to="{ name: 'prompt-editor-new' }" class="bg-white rounded-xl p-6 border-2 border-dashed border-gray-200 hover:border-[#4B5563] cursor-pointer flex flex-col items-center justify-center min-h-[280px] group transition-all">
          <div class="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#4B5563]/10 transition-colors">
            <svg class="w-8 h-8 text-[#6B7280] group-hover:text-[#4B5563] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
          </div>
          <p class="text-sm font-medium text-[#6B7280] group-hover:text-[#4B5563] transition-colors">创建新提示词</p>
          <p class="text-xs text-[#9CA3AF] mt-1">开始构建你的AI提示词</p>
        </router-link>
      </div>
    </div>
    <ConfirmationModal
        :is-open="isModalOpen"
        title="删除提示词"
        :message="`您确定要删除“${promptToDelete?.title}”吗？此操作无法撤销。`"
        @confirm="handleDeleteConfirm"
        @cancel="closeDeleteModal"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { usePromptStore } from '@/prompt/stores/promptStore';
import type { Prompt } from '@/prompt/types/prompt';
import ConfirmationModal from '@/prompt/components/common/ConfirmationModal.vue';

const promptStore = usePromptStore();

const isModalOpen = ref(false);
const promptToDelete = ref<Prompt | null>(null);

onMounted(() => {
  promptStore.fetchAllPrompts();
});

const stats = computed(() => {
  const myPrompts = promptStore.myPrompts;
  const totalUsage = myPrompts.reduce((sum, p) => sum + (p.usage || 0), 0);
  return [
    { label: '提示词总数', value: myPrompts.length, trend: '', trendClass: '', iconBgClass: 'bg-blue-50', icon: `<svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`},
    { label: '公开分享', value: myPrompts.filter(p => p.status === '公开').length, trend: '公开', trendClass: 'text-[#10B981] font-medium', iconBgClass: 'bg-green-50', icon: `<svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`},
    { label: '总使用次数', value: totalUsage > 1000 ? `${(totalUsage / 1000).toFixed(1)}k` : totalUsage, trend: '', trendClass: '', iconBgClass: 'bg-purple-50', icon: `<svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`},
  ];
});

const openDeleteModal = (prompt: Prompt) => {
  promptToDelete.value = prompt;
  isModalOpen.value = true;
};

const closeDeleteModal = () => {
  isModalOpen.value = false;
  promptToDelete.value = null;
};

const handleDeleteConfirm = () => {
  if (promptToDelete.value) {
    promptStore.deletePrompt(promptToDelete.value.id);
  }
  closeDeleteModal();
};
</script>