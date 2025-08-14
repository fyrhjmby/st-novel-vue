// 文件: ..\src/settings/views/SystemSettings.vue

<template>
  <main class="flex-1 bg-[var(--color-bg-primary)] flex flex-col transition-colors">
    <header class="h-20 px-8 flex items-center justify-between border-b border-[var(--color-border-primary)] flex-shrink-0">
      <h1 class="text-lg font-medium text-[var(--color-text-primary)]">系统设置</h1>
    </header>
    <div v-if="store.isLoading" class="flex-1 flex items-center justify-center bg-[var(--color-bg-app)]">
      <p class="text-[var(--color-text-muted)]">加载中...</p>
    </div>
    <div v-else class="flex-1 px-8 py-6 overflow-auto bg-[var(--color-bg-app)] space-y-8">
      <div class="bg-[var(--color-bg-primary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
        <h3 class="text-base font-medium text-[var(--color-text-primary)] mb-1">外观</h3>
        <p class="text-sm text-[var(--color-text-muted)] mb-6">自定义平台的外观和显示</p>
        <div class="space-y-6">
          <div>
            <label class="text-sm font-medium text-[var(--color-text-primary)] mb-4 block">主题模式</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <label
                  v-for="theme in themes"
                  :key="theme.name"
                  @click="store.updateTheme(theme.name)"
                  class="theme-option-card"
                  :class="{ 'selected': activeTheme === theme.name }"
                  :data-theme-name="theme.name"
              >
                <div class="relative w-full h-24 rounded-md mb-3 transition-all">
                  <!-- Mini UI Preview -->
                  <div class="mini-ui-preview">
                    <div class="mini-sidebar"></div>
                    <div class="mini-main">
                      <div class="mini-header"></div>
                      <div class="mini-line"></div>
                      <div class="mini-line short"></div>
                    </div>
                  </div>
                </div>
                <span class="text-sm font-medium text-center text-[var(--color-text-secondary)]">{{ theme.name }}</span>
                <div v-if="activeTheme === theme.name" class="check-icon">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
              </label>
            </div>
          </div>
          <div>
            <label class="text-sm font-medium text-[var(--color-text-primary)] mb-2 block">界面缩放</label>
            <div class="flex items-center gap-4">
              <span class="text-sm text-[var(--color-text-secondary)]">80%</span>
              <div class="flex-1 relative">
                <div class="slider-track">
                  <div class="slider-fill" :style="{ width: `${((zoomLevel - 80) / 40) * 100}%` }"></div>
                  <input
                      type="range"
                      min="80"
                      max="120"
                      :value="zoomLevel"
                      @input="store.updateZoomLevel(parseInt(($event.target as HTMLInputElement).value))"
                      @change="store.saveZoomLevel()"
                      class="absolute w-full h-full opacity-0 cursor-pointer"
                  >
                  <div class="slider-thumb" :style="{ left: `${((zoomLevel - 80) / 40) * 100}%` }"></div>
                </div>
              </div>
              <span class="text-sm text-[var(--color-text-secondary)]">120%</span>
              <span class="text-sm font-medium text-[var(--color-text-primary)] ml-2 w-10 text-center">{{ zoomLevel }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-[var(--color-bg-primary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
        <h3 class="text-base font-medium text-[var(--color-text-primary)] mb-1">语言与地区</h3>
        <p class="text-sm text-[var(--color-text-muted)] mb-6">设置您的语言偏好和地区信息</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-[var(--color-text-primary)] mb-2 block">界面语言</label>
            <select v-model="language" @change="store.saveSetting('language', language)" class="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
              <option>简体中文</option>
              <option>English</option>
              <option>繁體中文</option>
              <option>日本語</option>
            </select>
          </div>
          <div>
            <label class="text-sm font-medium text-[var(--color-text-primary)] mb-2 block">日期格式</label>
            <select v-model="dateFormat" @change="store.saveSetting('dateFormat', dateFormat)" class="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
              <option>YYYY-MM-DD</option>
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-[var(--color-bg-primary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
        <h3 class="text-base font-medium text-[var(--color-text-primary)] mb-6">通知设置</h3>
        <div class="space-y-4 divide-y divide-[var(--color-border-secondary)]">
          <div v-for="(item, index) in notificationSettings" :key="item.title" class="flex items-center justify-between" :class="index > 0 ? 'pt-4' : ''">
            <div>
              <h4 class="text-sm font-medium text-[var(--color-text-primary)]">{{ item.title }}</h4>
              <p class="text-xs text-[var(--color-text-muted)] mt-1">{{ item.description }}</p>
            </div>
            <button @click="store.updateToggleSetting('notification', item.title, !item.enabled)" class="toggle-switch" :class="{active: item.enabled}"></button>
          </div>
        </div>
      </div>

      <div class="bg-[var(--color-bg-primary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
        <h3 class="text-base font-medium text-[var(--color-text-primary)] mb-6">应用设置</h3>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-[var(--color-text-primary)] mb-2 block">默认对话模式</label>
            <select class="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg text-sm focus:outline-none focus:border-[var(--color-border-focus)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
              <option>标准对话</option>
              <option>创意写作</option>
              <option>代码助手</option>
              <option>学术研究</option>
            </select>
          </div>
          <div v-for="(item, index) in appSettings" :key="item.title" class="flex items-center justify-between border-t border-[var(--color-border-secondary)] pt-4" :class="index === 0 ? 'border-t-0 pt-0' : ''">
            <div>
              <h4 class="text-sm font-medium text-[var(--color-text-primary)]">{{ item.title }}</h4>
              <p class="text-xs text-[var(--color-text-muted)] mt-1">{{ item.description }}</p>
            </div>
            <button @click="store.updateToggleSetting('app', item.title, !item.enabled)" class="toggle-switch" :class="{active: item.enabled}"></button>
          </div>
        </div>
      </div>

      <div class="bg-[var(--color-bg-primary)] rounded-xl p-6 border border-red-400/50">
        <h3 class="text-base font-medium text-red-500 mb-6">危险区域</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-[var(--color-text-primary)]">清除缓存</h4>
              <p class="text-sm text-[var(--color-text-secondary)] mt-1">清除本地缓存和临时文件</p>
            </div>
            <button @click="handleClearCache" class="px-4 py-2 bg-transparent border border-red-500 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500 hover:text-white transition-colors">清除缓存</button>
          </div>
          <div class="flex items-center justify-between pt-4 border-t border-red-400/50">
            <div>
              <h4 class="text-sm font-medium text-[var(--color-text-primary)]">重置所有设置</h4>
              <p class="text-sm text-red-500 mt-1">将所有设置恢复为默认值</p>
            </div>
            <button @click="handleResetSettings" class="px-4 py-2 bg-red-500 border border-red-500 rounded-lg text-sm font-medium text-white hover:bg-red-600 transition-colors">重置设置</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useSystemSettingsStore } from '@/settings/stores/systemSettingsStore';

const store = useSystemSettingsStore();
const {
  themes,
  activeTheme,
  zoomLevel,
  language,
  dateFormat,
  notificationSettings,
  appSettings,
} = storeToRefs(store);

const themePreviews: Record<string, string> = {
  '默认主题': 'bg-[#FFFFFF] border border-[#E5E7EB]',
  '护眼模式': 'bg-[#f0fdf4] border border-[#bbf7d0]',
  '深色模式': 'bg-[#334155] border border-[#475569]',
};

onMounted(() => {
  store.initializeSettings();
});

const handleClearCache = () => {
  if (confirm('确定要清除所有本地缓存吗？这不会影响您存储在云端的数据。')) {
    alert('缓存已清除！');
  }
};

const handleResetSettings = () => {
  if (confirm('确定要重置所有系统设置吗？此操作不可撤销。')) {
    alert('所有设置已恢复为默认值！');
    // In a real app, you would call a store action here.
    // store.resetAllSettings();
  }
};

</script>

<style scoped>
@import '../style.css';
input[type=range] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  width: 100%;
}

.theme-option-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 2px solid var(--color-border-primary);
  background-color: var(--color-bg-secondary);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.theme-option-card:hover {
  border-color: var(--color-border-focus);
  box-shadow: var(--shadow-md);
}

.theme-option-card.selected {
  border-color: var(--color-text-accent);
  background-color: color-mix(in srgb, var(--color-text-accent) 5%, var(--color-bg-secondary));
}

.check-icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  background-color: var(--color-text-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2px var(--color-bg-primary);
}

.mini-ui-preview {
  width: 100%;
  height: 6rem;
  padding: 0.5rem;
  background-color: var(--color-bg-app);
  border: 1px solid var(--color-border-secondary);
  border-radius: 0.5rem;
  display: flex;
  gap: 0.5rem;
  overflow: hidden;
}

.mini-sidebar {
  width: 25%;
  height: 100%;
  background-color: var(--color-bg-secondary);
  border-radius: 0.25rem;
}

.mini-main {
  width: 75%;
  height: 100%;
  background-color: var(--color-bg-primary);
  border-radius: 0.25rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mini-header {
  width: 40%;
  height: 0.5rem;
  background-color: var(--color-bg-accent);
  border-radius: 9999px;
  opacity: 0.5;
}

.mini-line {
  width: 100%;
  height: 0.5rem;
  background-color: var(--color-bg-muted);
  border-radius: 9999px;
}
.mini-line.short {
  width: 60%;
}

[data-theme-name="默认主题"] .mini-ui-preview { background-color: #f5f5f7; }
[data-theme-name="默认主题"] .mini-sidebar { background-color: #fafafa; }
[data-theme-name="默认主题"] .mini-main { background-color: #ffffff; }
[data-theme-name="默认主题"] .mini-header { background-color: #3b82f6; }
[data-theme-name="默认主题"] .mini-line { background-color: #f3f4f6; }

[data-theme-name="深色模式"] .mini-ui-preview { background-color: #1e293b; }
[data-theme-name="深色模式"] .mini-sidebar { background-color: #334155; }
[data-theme-name="深色模式"] .mini-main { background-color: #334155; }
[data-theme-name="深色模式"] .mini-header { background-color: #60a5fa; }
[data-theme-name="深色模式"] .mini-line { background-color: #475569; }

[data-theme-name="护眼模式"] .mini-ui-preview { background-color: #f0fdf4; }
[data-theme-name="护眼模式"] .mini-sidebar { background-color: #fafffa; }
[data-theme-name="护眼模式"] .mini-main { background-color: #ffffff; }
[data-theme-name="护眼模式"] .mini-header { background-color: #16a34a; }
[data-theme-name="护眼模式"] .mini-line { background-color: #dcfce7; }
</style>