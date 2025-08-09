<template>
  <main class="flex-1 bg-white flex flex-col">
    <!-- Header -->
    <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
      <h1 class="text-lg font-medium text-[#374151]">帮助中心</h1>
    </header>

    <!-- Content -->
    <div v-if="store.isLoading" class="flex-1 flex items-center justify-center bg-[#FCFCFC]">
      <p>加载中...</p>
    </div>
    <div v-else class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC]">
      <!-- Search & Welcome -->
      <div class="text-center py-10 px-6 bg-white rounded-xl border border-gray-100 mb-8">
        <h2 class="text-2xl font-semibold text-[#374151] mb-2">您好，我们能为您提供什么帮助？</h2>
        <p class="text-[#6B7280] mb-6">从下方选择一个类别，或搜索您需要的内容</p>
        <div class="max-w-xl mx-auto relative">
          <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input type="text" placeholder="搜索问题，例如：如何升级会员？" class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4B5563] focus:ring-2 focus:ring-[#4B5563]/20 transition">
        </div>
      </div>

      <!-- Categories -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div v-for="category in helpCategories" :key="category.title" class="bg-white p-6 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-105" :class="category.bgColor">
            <span v-html="category.icon"></span>
          </div>
          <h3 class="font-medium text-[#374151] mb-1">{{ category.title }}</h3>
          <p class="text-sm text-[#9CA3AF]">{{ category.description }}</p>
        </div>
      </div>

      <!-- Popular Questions -->
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-4">热门问题</h3>
        <div class="space-y-3">
          <a v-for="question in popularQuestions" :key="question" href="#" class="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <span class="text-sm text-[#374151]">{{ question }}</span>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </a>
        </div>
      </div>

      <!-- Contact Support -->
      <div class="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
        <div>
          <h3 class="font-medium text-[#374151]">没有找到您想要的答案？</h3>
          <p class="text-sm text-[#6B7280] mt-1">我们的支持团队会很乐意为您提供帮助。</p>
        </div>
        <button class="px-4 py-2 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-[#374151] transition-colors">
          联系我们
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useHelpCenterStore } from '@/settings/stores/helpCenterStore';

const store = useHelpCenterStore();
const { helpCategories, popularQuestions } = storeToRefs(store);

onMounted(() => {
  store.initializeData();
});
</script>

<style scoped>

</style>