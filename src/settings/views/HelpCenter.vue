<template>
  <main class="flex-1 bg-[var(--color-bg-primary)] flex flex-col transition-colors">
    <!-- Header -->
    <header class="h-20 px-8 flex items-center justify-between border-b border-[var(--color-border-primary)] flex-shrink-0">
      <h1 class="text-lg font-medium text-[var(--color-text-primary)]">帮助中心</h1>
    </header>

    <!-- Content -->
    <div v-if="store.isLoading" class="flex-1 flex items-center justify-center bg-[var(--color-bg-app)]">
      <p class="text-[var(--color-text-muted)]">加载中...</p>
    </div>
    <div v-else class="flex-1 px-8 py-6 overflow-auto bg-[var(--color-bg-app)]">
      <!-- Search & Welcome -->
      <div class="text-center py-10 px-6 bg-[var(--color-bg-primary)] rounded-xl border border-[var(--color-border-primary)] mb-8">
        <h2 class="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">您好，我们能为您提供什么帮助？</h2>
        <p class="text-[var(--color-text-secondary)] mb-6">从下方选择一个类别，或搜索您需要的内容</p>
        <div class="max-w-xl mx-auto relative">
          <svg class="w-5 h-5 text-[var(--color-text-muted)] absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input type="text" placeholder="搜索问题，例如：如何升级会员？" class="w-full pl-12 pr-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[color:var(--color-border-focus)]/20 transition bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]">
        </div>
      </div>

      <!-- Categories -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div v-for="category in helpCategories" :key="category.title" class="bg-[var(--color-bg-primary)] p-6 rounded-xl border border-[var(--color-border-primary)] hover:border-[var(--color-border-focus)] hover:shadow-md transition-all cursor-pointer group">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-105" :class="category.bgColor">
            <span v-html="category.icon"></span>
          </div>
          <h3 class="font-medium text-[var(--color-text-primary)] mb-1">{{ category.title }}</h3>
          <p class="text-sm text-[var(--color-text-muted)]">{{ category.description }}</p>
        </div>
      </div>

      <!-- Popular Questions -->
      <div class="bg-[var(--color-bg-primary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
        <h3 class="text-base font-medium text-[var(--color-text-primary)] mb-4">热门问题</h3>
        <div class="space-y-3">
          <a v-for="question in popularQuestions" :key="question" href="#" class="flex items-center justify-between p-4 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors">
            <span class="text-sm text-[var(--color-text-primary)]">{{ question }}</span>
            <svg class="w-4 h-4 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </a>
        </div>
      </div>

      <!-- Contact Support -->
      <div class="mt-8 p-6 bg-[var(--color-bg-secondary)] rounded-xl border border-[var(--color-border-primary)] flex items-center justify-between">
        <div>
          <h3 class="font-medium text-[var(--color-text-primary)]">没有找到您想要的答案？</h3>
          <p class="text-sm text-[var(--color-text-secondary)] mt-1">我们的支持团队会很乐意为您提供帮助。</p>
        </div>
        <button class="px-4 py-2 bg-[var(--color-bg-accent)] text-[var(--color-text-on-accent)] rounded-lg text-sm font-medium hover:bg-[var(--color-bg-accent-hover)] transition-colors">
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