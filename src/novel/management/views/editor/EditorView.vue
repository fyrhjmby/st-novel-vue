<template>
  <div class="h-screen w-screen flex bg-white design-frame-container">
    <div class="design-frame">
      <!-- Top Navbar from original file -->
      <div class="h-[56px] bg-white border-b border-gray-100 flex items-center px-6 flex-shrink-0">
        <div class="flex items-center gap-2 flex-1">
          <router-link to="/novel/dashboard" class="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors p-2 -ml-2 rounded-lg">
            <span v-html="icons.arrowLeft" class="w-4 h-4"></span>
            <span>返回</span>
          </router-link>
          <span class="text-gray-300">/</span>
          <span class="font-medium text-gray-800 text-sm">星际漫游者</span>
        </div>
        <div class="flex items-center gap-4">
          <button class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <span v-html="icons.search" class="w-5 h-5"></span>
          </button>
          <button class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative">
            <span v-html="icons.bell" class="w-5 h-5"></span>
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
      </div>

      <!-- 3-column Workspace -->
      <div class="h-[calc(100%-56px)] flex">
        <!-- 1st Column: Internal Sidebar -->
        <EditorInternalSidebar
            v-model:activeItem="activeItem"
        />

        <!-- 2nd Column: Core Content Area -->
        <EditorContentArea :active-item="activeItem" />

        <!-- 3rd Column: AI Assistant Panel -->
        <EditorAIPanel />
      </div>
    </div>
    <GlobalAIAssistant />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EditorInternalSidebar from '@/novel/management/components/editor/EditorInternalSidebar.vue';
import EditorContentArea from '@/novel/management/components/editor/EditorContentArea.vue';
import EditorAIPanel from '@/novel/management/components/editor/EditorAIPanel.vue';
import GlobalAIAssistant from '@/novel/shared/components/GlobalAIAssistant/index.vue';
import '@/novel/assets/styles/main.css';

// --- Static Data (Mock) ---
const icons = {
  arrowLeft: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"></path></svg>`,
  search: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/></svg>`,
  bell: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"/><path d="M13.73 21C13.5 21.6 12.8 22 12 22C11.2 22 10.5 21.6 10.27 21"/></svg>`,
};

// Default active chapter data
const defaultChapter = {
  id: 'ch-12',
  type: 'chapter',
  icon: 'fa-solid fa-file-lines',
  title: '第四章: 跃迁点',
  wordCount: 2415,
  content: '<h1>第四章: 跃迁点</h1><p>控制台的警报声将卡尔文从浅眠中惊醒。他猛地坐直，眼前的屏幕上一片红色闪烁。"发现引力异常，"艾拉的声音冷静得不带一丝情感，"正在接近理论中的跃迁点。这是我们唯一的回家机会。"</p><p>卡尔文的心跳漏了一拍。回家。这个词既熟悉又陌生，像一颗深埋的种子，在这一刻突然破土而出，疯狂生长。他深吸一口气，双手稳稳地放在控制杆上。"艾拉，计算跃迁参数，准备进入。"</p>',
  status: 'editing'
};

const activeItem = ref(defaultChapter);

</script>

<style scoped>
/* Styles from the original file are preserved */
.design-frame-container { padding: 2rem; background-color: #f5f5f7; }
.design-frame { width: 100%; height: 100%; max-width: 1800px; margin: auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.08); }

/* Additional styles to ensure prose looks good inside the content area */
:deep(.prose h1) {
  font-size: 1.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}
:deep(.prose p) {
  line-height: 1.75;
}
:deep(.prose h2) {
  font-size: 1.5rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  margin-top: 2rem;
  margin-bottom: 1rem;
}
:deep(.prose h3) {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}
</style>