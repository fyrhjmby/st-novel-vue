<template>
  <div class="h-screen w-screen flex bg-white design-frame-container">
    <div class="design-frame">
      <div class="h-10 px-5 flex items-center border-b border-gray-100 bg-gray-50 flex-shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
          <div class="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div class="w-3 h-3 rounded-full bg-[#28CA42]"></div>
        </div>
        <div class="ml-auto flex items-center gap-4 text-xs text-gray-400">
          <span>AI Creator Platform</span>
        </div>
      </div>
      <div class="h-[calc(100%-40px)] flex">
        <NovelManagementSidebar />
        <main class="flex-1 bg-white flex flex-col overflow-hidden">
          <!-- 使用与全局一致的 AppHeader -->
          <AppHeader />
          <router-view />
        </main>
      </div>
    </div>
    <!-- [修复] 将全局组件放在布局的顶层 -->
    <GlobalAIAssistant />
    <AITaskConfigModal />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/layouts/components/AppHeader.vue'
import NovelManagementSidebar from '@/novel/management/components/NovelManagementSidebar.vue'
import GlobalAIAssistant from "@/novel/shared/components/GlobalAIAssistant/index.vue";
import AITaskConfigModal from '@/novel/shared/components/GlobalAIAssistant/AITaskConfigModal.vue'
import '@/novel/assets/styles/main.css'
</script>

<style scoped>
.design-frame-container {
  padding: 2rem;
  background-color: #f5f5f7;
}
.design-frame {
  width: 100%;
  height: 100%;
  max-width: 1800px;
  margin: auto;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}
</style>