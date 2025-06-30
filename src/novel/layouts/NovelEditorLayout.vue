// =
// 文件: ..\src\novel\layouts\NovelEditorLayout.vue
//
// 说明: 这是小说编辑器的专属布局，用于构建左、中、右三栏结构。
//

<template>
  <div class="h-screen w-screen flex bg-white design-frame-container">
    <div class="design-frame">
      <!-- 模拟顶部窗口栏 -->
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
      <!-- 编辑器主容器 -->
      <div class="h-[calc(100%-40px)] flex">
        <NovelManagementSidebar />
        <EditorContent />
        <EditorAIPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 引用 NovelManagementSidebar 以保持单本小说内导航一致
import NovelManagementSidebar from '@/novel/components/NovelManagementSidebar.vue';
import EditorContent from '@/novel/components/editor/EditorContent.vue';
import EditorAIPanel from '@/novel/components/editor/EditorAIPanel.vue';
import '@/novel/style.css';
</script>

<style scoped>
/* 样式与您项目中的其他布局文件保持一致 */
.design-frame-container {
  padding: 2rem;
  background-color: #f5f5f7;
}
.design-frame {
  width: 100%;
  height: 100%;
  max-width: 1800px; /* 您可以根据需要调整最大宽度 */
  margin: auto;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}
</style>