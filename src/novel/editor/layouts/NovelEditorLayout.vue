<template>
  <div class="h-screen w-screen flex bg-white design-frame-container">
    <div class="design-frame" :class="themeClass">
      <!-- 顶部导航栏: 严格遵循UI设计稿 -->
      <header class="h-[56px] bg-white border-b border-gray-100 flex items-center px-6 flex-shrink-0">
        <div class="flex items-center gap-2 flex-1">
          <!-- 返回链接指向小说管理台 -->
          <router-link to="/novel/dashboard" class="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors p-2 -ml-2 rounded-lg">
            <i class="fa-solid fa-chevron-left w-4 h-4"></i>
            <span>返回</span>
          </router-link>
          <span class="text-gray-300">/</span>
          <!-- 静态小说标题 -->
          <span class="font-medium text-gray-800 text-sm">星际漫游者</span>
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

      <!-- 使用 <router-view /> 来渲染子路由对应的组件 (EditorWorkspaceView) -->
      <div class="h-[calc(100%-56px)]">
        <router-view />
      </div>
    </div>
    <!-- 全局覆盖层与模态框 -->
    <ContextPreviewModal />
    <ReaderModeOverlay />
  </div>
</template>

<script setup lang="ts">
import '@/novel/assets/styles/main.css';
import { computed } from 'vue';
import { useUIStore } from '@/novel/editor/stores/uiStore';
import ContextPreviewModal from '@/novel/editor/components/modals/ContextPreviewModal.vue';
import ReaderModeOverlay from '@novel/editor/views/ReaderModeOverlay.vue';

const uiStore = useUIStore();
const themeClass = computed(() => {
  if (uiStore.uiState.activeTheme === 'default') return '';
  return `theme-${uiStore.uiState.activeTheme}`;
});
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

/* --- Theme Variables --- */
.theme-eye-care {
  --theme-bg: #FDFCF9;
  --theme-bg-soft: #FBF9F6;
  --theme-bg-panel: #F8F6F2;
  --theme-border: #EFEBE4;
  --theme-text-primary: #3a2f2f;
  --theme-text-secondary: #5f5757;
  --theme-text-muted: #8e8585;
  --theme-hover-bg: #EFEBE4;
}

.theme-dark {
  --theme-bg: #18181b; /* zinc-900 */
  --theme-bg-soft: #27272a; /* zinc-800 */
  --theme-bg-panel: #3f3f46; /* zinc-700 */
  --theme-border: #3f3f46; /* zinc-700 */
  --theme-text-primary: #e4e4e7; /* zinc-200 */
  --theme-text-secondary: #a1a1aa; /* zinc-400 */
  --theme-text-muted: #71717a; /* zinc-500 */
  --theme-hover-bg: #3f3f46;
}

/* --- Global Theme Application --- */
.theme-eye-care, .theme-dark {
  background-color: var(--theme-bg-soft);
}
:deep(.theme-eye-care .text-gray-800),
:deep(.theme-dark .text-gray-800),
:deep(.theme-eye-care .text-\[\#374151\]),
:deep(.theme-dark .text-\[\#374151\]),
:deep(.theme-eye-care .text-\[\#1F2937\]),
:deep(.theme-dark .text-\[\#1F2937\])
{
  color: var(--theme-text-primary);
}
:deep(.theme-eye-care .text-gray-500),
:deep(.theme-dark .text-gray-500),
:deep(.theme-eye-care .text-\[\#6B7280\]),
:deep(.theme-dark .text-\[\#6B7280\])
{
  color: var(--theme-text-secondary);
}
:deep(.theme-eye-care .text-gray-400),
:deep(.theme-dark .text-gray-400),
:deep(.theme-eye-care .text-\[\#9CA3AF\]),
:deep(.theme-dark .text-\[\#9CA3AF\])
{
  color: var(--theme-text-muted);
}
:deep(.theme-eye-care .border-gray-100),
:deep(.theme-dark .border-gray-100),
:deep(.theme-eye-care .border-gray-200),
:deep(.theme-dark .border-gray-200),
:deep(.theme-eye-care .border-gray-200\/80),
:deep(.theme-dark .border-gray-200\/80),
:deep(.theme-eye-care .border-b)
{
  border-color: var(--theme-border) !important;
}
:deep(.theme-eye-care .bg-white),
:deep(.theme-dark .bg-white)
{
  background-color: var(--theme-bg) !important;
}
:deep(.theme-eye-care .hover\:bg-gray-100:hover),
:deep(.theme-dark .hover\:bg-gray-100:hover)
{
  background-color: var(--theme-hover-bg) !important;
}
:deep(.theme-eye-care .bg-gray-50\/50),
:deep(.theme-dark .bg-gray-50\/50) {
  background-color: var(--theme-bg-soft);
}

/* --- Component Specific Theming --- */
.theme-eye-care header, .theme-dark header {
  background-color: var(--theme-bg-soft);
}
:deep(.theme-eye-care .editor-workspace-view),
:deep(.theme-dark .editor-workspace-view),
:deep(.theme-eye-care .activity-bar-container),
:deep(.theme-dark .activity-bar-container)
{
  background-color: var(--theme-bg-panel);
}
:deep(.theme-eye-care .sidebar-panel-container),
:deep(.theme-dark .sidebar-panel-container) {
  background-color: var(--theme-bg-soft);
}
:deep(.theme-eye-care .main-pane-container),
:deep(.theme-dark .main-pane-container),
:deep(.theme-eye-care .pane-content-dispatcher),
:deep(.theme-dark .pane-content-dispatcher),
:deep(.theme-eye-care .aiconfig-content),
:deep(.theme-dark .aiconfig-content),
:deep(.theme-eye-care .search-view-container),
:deep(.theme-dark .search-view-container),
:deep(.theme-eye-care .task-queue-container),
:deep(.theme-dark .task-queue-container),
:deep(.theme-eye-care .diff-preview-container),
:deep(.theme-dark .diff-preview-container),
:deep(.theme-eye-care .ai-task-panel-container),
:deep(.theme-dark .ai-task-panel-container),
:deep(.theme-eye-care .page-header),
:deep(.theme-dark .page-header)
{
  background-color: var(--theme-bg);
  border-color: var(--theme-border);
}
:deep(.theme-eye-care .top-header-bar),
:deep(.theme-dark .top-header-bar),
:deep(.theme-eye-care .tabs-bar),
:deep(.theme-dark .tabs-bar)
{
  background-color: var(--theme-bg-panel);
}
:deep(.theme-eye-care .tab-item),
:deep(.theme-dark .tab-item) {
  background-color: var(--theme-border);
}
:deep(.theme-eye-care .tab-item.active),
:deep(.theme-dark .tab-item.active) {
  background-color: var(--theme-bg);
}
:deep(.theme-eye-care .breadcrumbs-bar-container),
:deep(.theme-dark .breadcrumbs-bar-container) {
  background-color: var(--theme-bg);
  border-color: var(--theme-border);
}
:deep(.theme-eye-care .ProseMirror),
:deep(.theme-dark .ProseMirror) {
  color: var(--theme-text-primary);
}
:deep(.theme-eye-care .status-bar-container),
:deep(.theme-dark .status-bar-container) {
  background-color: var(--theme-bg-panel);
  border-color: var(--theme-border);
}
:deep(.theme-eye-care .setting-page-wrapper),
:deep(.theme-dark .setting-page-wrapper) {
  color: var(--theme-text-primary);
}
:deep(.theme-dark .page-title),
:deep(.theme-dark .page-description),
:deep(.theme-dark .setting-label),
:deep(.theme-dark .setting-description),
:deep(.theme-dark .font-medium)
{
  color: var(--theme-text-primary);
}
:deep(.theme-dark .setting-input) {
  background-color: var(--theme-bg-soft);
  border-color: var(--theme-bg-panel);
  color: var(--theme-text-primary);
}
:deep(.theme-dark .theme-info) {
  background-color: var(--theme-bg-soft);
}
:deep(.theme-dark .theme-card) {
  border-color: var(--theme-bg-panel);
}
</style>