<template>
  <div class="setting-page-wrapper custom-scrollbar">
    <div class="page-header">
      <h2 class="page-title">主题设置</h2>
      <p class="page-description">选择一个您喜欢的工作区界面主题。</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
          v-for="theme in themes"
          :key="theme.id"
          @click="setActiveTheme(theme.id)"
          class="theme-card"
          :class="{ 'active': activeTheme === theme.id }"
      >
        <div class="preview-box" :style="{ backgroundColor: theme.preview.bg }">
          <div class="preview-sidebar" :style="{ backgroundColor: theme.preview.panel }"></div>
          <div class="preview-main">
            <div class="preview-header" :style="{ backgroundColor: theme.preview.panel }"></div>
            <div class="preview-content">
              <div class="preview-line" :style="{ backgroundColor: theme.preview.text }"></div>
              <div class="preview-line w-1/2" :style="{ backgroundColor: theme.preview.text }"></div>
              <div class="preview-line w-3/4" :style="{ backgroundColor: theme.preview.accent }"></div>
            </div>
          </div>
        </div>
        <div class="theme-info">
          <h3 class="theme-name">{{ theme.name }}</h3>
          <p class="theme-desc">{{ theme.description }}</p>
        </div>
        <div v-if="activeTheme === theme.id" class="active-check">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUIStore } from '@/novel/editor/stores/uiStore';

type ThemeId = 'default' | 'eye-care' | 'dark';

const uiStore = useUIStore();

const themes = ref([
  {
    id: 'default',
    name: '默认亮色',
    description: '清晰、简洁的默认主题。',
    preview: { bg: '#FFFFFF', panel: '#F3F4F6', text: '#D1D5DB', accent: '#60A5FA' }
  },
  {
    id: 'eye-care',
    name: '护眼模式',
    description: '柔和的米色背景，适合长时间阅读。',
    preview: { bg: '#FDFCF9', panel: '#F8F6F2', text: '#DCD9D3', accent: '#F59E0B' }
  },
  {
    id: 'dark',
    name: '暗黑模式',
    description: '专为夜间工作设计，减少眩光。',
    preview: { bg: '#1F2937', panel: '#374151', text: '#4B5563', accent: '#F472B6' }
  }
]);

const activeTheme = computed(() => uiStore.uiState.activeTheme);

const setActiveTheme = (themeId: ThemeId) => {
  uiStore.setTheme(themeId);
};
</script>

<style scoped>
.setting-page-wrapper { padding: 1rem 2rem 4rem; max-width: 64rem; margin: 0 auto; overflow-y: auto; height: 100%; }
.custom-scrollbar::-webkit-scrollbar { display: block; width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
.page-header { padding-bottom: 1.5rem; border-bottom: 1px solid #E5E7EB; margin-bottom: 2rem; }
.page-title { font-size: 1.5rem; font-weight: 600; color: #1F2937; }
.page-description { color: #6B7280; margin-top: 0.25rem; }

.theme-card {
  border: 2px solid #E5E7EB;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
}
.theme-card:hover {
  border-color: #9CA3AF;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
.theme-card.active {
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.preview-box {
  height: 120px;
  padding: 12px;
  display: flex;
  gap: 8px;
}
.preview-sidebar {
  width: 30%;
  border-radius: 4px;
}
.preview-main {
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.preview-header {
  height: 20%;
  border-radius: 4px;
}
.preview-content {
  height: 80%;
  border-radius: 4px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.preview-line {
  height: 8px;
  border-radius: 2px;
  width: 100%;
}

.theme-info {
  padding: 1rem;
  background-color: #F9FAFB;
}
.theme-name {
  font-weight: 500;
  color: #1F2937;
}
.theme-desc {
  font-size: 0.875rem;
  color: #6B7280;
  margin-top: 0.25rem;
}

.active-check {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  background-color: #3B82F6;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 5px rgba(0,0,0,0.2);
}
</style>