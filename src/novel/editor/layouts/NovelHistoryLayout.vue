<template>
  <div class="h-screen w-screen flex bg-white design-frame-container">
    <div class="design-frame">
      <!-- 顶部导航栏 -->
      <header class="h-[56px] bg-white border-b border-gray-100 flex items-center px-6 flex-shrink-0">
        <div class="flex items-center gap-2 flex-1">
          <!-- 返回链接，可以指向小说管理首页 -->
          <router-link to="/novel/editor" class="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors p-2 -ml-2 rounded-lg">
            <i class="fa-solid fa-chevron-left w-4 h-4"></i>
            <span>返回</span>
          </router-link>
          <span class="text-gray-300">/</span>
          <!-- 静态标题 -->
          <span class="font-medium text-gray-800 text-sm">版本历史</span>
        </div>
        <div class="flex items-center gap-4">
          <button class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <i class="fa-solid fa-search w-5 h-5"></i>
          </button>
          <button class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative">
            <i class="fa-solid fa-bell w-5 h-5"></i>
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <div class="ml-2 flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?u=creator" alt="Creator Avatar" class="w-9 h-9 rounded-full">
            <div>
              <p class="text-sm font-medium text-[#374151]">创作者</p>
              <p class="text-xs text-[#9CA3AF]">在线</p>
            </div>
          </div>
        </div>
      </header>

      <!-- 内容区域 -->
      <div class="h-[calc(100%-56px)]">
        <router-view />
      </div>
    </div>
    <GlobalAIAssistant />
    <AITaskConfigModal />
  </div>
</template>

<script setup lang="ts">
import GlobalAIAssistant from '@novel/shared/components/GlobalAIAssistant/index.vue';
import AITaskConfigModal from '@novel/shared/components/GlobalAIAssistant/AITaskConfigModal.vue';
import '@novel/assets/styles/main.css';
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
  display: flex;
  flex-direction: column;
}
</style>