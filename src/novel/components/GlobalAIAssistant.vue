// =
// 文件: ..\src\novel\components\GlobalAIAssistant.vue
// 说明: 新增组件，封装全局AI浮动按钮及其任务菜单，以便在多个布局中复用。
//

<template>
  <div class="fixed bottom-8 right-8 z-50">
    <!-- AI 菜单 (点击按钮后显示) -->
    <div v-if="isAiMenuOpen" class="absolute bottom-20 right-0 transition-all duration-300 ease-in-out">
      <AIAssistantMenu @close="isAiMenuOpen = false" />
    </div>

    <!-- 浮动按钮 -->
    <button @click="toggleMenu" class="w-16 h-16 bg-gradient-to-br from-[#4B5563] to-[#374151] text-white rounded-full shadow-lg hover:scale-110 focus:scale-110 active:scale-100 transition-transform flex items-center justify-center">
      <!-- 根据菜单状态切换图标 -->
      <svg v-if="!isAiMenuOpen" class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.43 2.43c-1.105 0-2.023-.918-2.023-2.023a3.75 3.75 0 013.75-3.75c.916 0 1.749.312 2.422.845l.005.004a.75.75 0 01.017 1.056l-1.06 1.06c-.24.24-.407.553-.407.896v.113a.75.75 0 001.5 0v-.058a1.5 1.5 0 01.447-1.087l.16-.16a1.5 1.5 0 00-2.122-2.122l-.16.16a1.5 1.5 0 01-1.087.447h-.058a.75.75 0 000 1.5h.113c.343 0 .656-.167.896-.407l1.06-1.06a.75.75 0 011.056.017z" /><path stroke-linecap="round" stroke-linejoin="round" d="M16.47 8.53a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h15.94l-2.47-2.47a.75.75 0 010-1.06z" /></svg>
      <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AIAssistantMenu from '@/novel/components/AIAssistantMenu.vue';

const isAiMenuOpen = ref(false);

const toggleMenu = () => {
  isAiMenuOpen.value = !isAiMenuOpen.value;
};
</script>

<style scoped>
/* Scoped styles can be added here if needed */
</style>