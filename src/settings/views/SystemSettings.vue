// 文件: ..\src/settings/views/SystemSettings.vue

<template>
  <main class="flex-1 bg-white flex flex-col">
    <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
      <h1 class="text-lg font-medium text-[#374151]">系统设置</h1>
    </header>
    <div v-if="store.isLoading" class="flex-1 flex items-center justify-center bg-[#FCFCFC]">
      <p>加载中...</p>
    </div>
    <div v-else class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] space-y-8">
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-1">外观</h3>
        <p class="text-sm text-[#9CA3AF] mb-6">自定义平台的外观和显示</p>
        <div class="space-y-6">
          <div>
            <label class="text-sm font-medium text-[#374151] mb-4 block">主题模式</label>
            <div class="grid grid-cols-3 gap-4">
              <label v-for="theme in themes" :key="theme.name" @click="store.updateTheme(theme.name)" class="rounded-lg p-4 text-center cursor-pointer border-2 transition-colors" :class="activeTheme === theme.name ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-200 bg-gray-50'">
                <div class="w-full h-16 rounded-md mb-2 flex items-center justify-center" :class="themePreviews[theme.name]"></div>
                <span class="text-sm font-medium text-gray-700">{{ theme.name }}</span>
              </label>
            </div>
          </div>
          <div>
            <label class="text-sm font-medium text-[#374151] mb-2 block">界面缩放</label>
            <div class="flex items-center gap-4">
              <span class="text-sm text-[#6B7280]">80%</span>
              <div class="flex-1 relative">
                <div class="slider-track">
                  <div class="slider-fill" :style="{width: zoomLevel + '%'}"></div>
                  <input type="range" min="0" max="100" :value="zoomLevel" @input="store.updateZoomLevel(parseInt($event.target.value))" @change="store.saveZoomLevel()" class="absolute w-full h-full opacity-0 cursor-pointer">
                  <div class="slider-thumb" :style="{left: zoomLevel + '%'}"></div>
                </div>
              </div>
              <span class="text-sm text-[#6B7280]">120%</span>
              <span class="text-sm font-medium text-[#374151] ml-2 w-10 text-center">{{ Math.round(80 + (zoomLevel / 100) * 40) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-1">语言与地区</h3>
        <p class="text-sm text-[#9CA3AF] mb-6">设置您的语言偏好和地区信息</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-[#374151] mb-2 block">界面语言</label>
            <select v-model="language" @change="store.saveSetting('language', language)" class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4B5563] bg-white">
              <option>简体中文</option>
              <option>English</option>
              <option>繁體中文</option>
              <option>日本語</option>
            </select>
          </div>
          <div>
            <label class="text-sm font-medium text-[#374151] mb-2 block">日期格式</label>
            <select v-model="dateFormat" @change="store.saveSetting('dateFormat', dateFormat)" class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4B5563] bg-white">
              <option>YYYY-MM-DD</option>
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
            </select>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-6">通知设置</h3>
        <div class="space-y-4 divide-y divide-gray-100">
          <div v-for="(item, index) in notificationSettings" :key="item.title" class="flex items-center justify-between" :class="index > 0 ? 'pt-4' : ''">
            <div>
              <h4 class="text-sm font-medium text-[#374151]">{{ item.title }}</h4>
              <p class="text-xs text-[#9CA3AF] mt-1">{{ item.description }}</p>
            </div>
            <button @click="store.updateToggleSetting('notification', item.title, !item.enabled)" class="toggle-switch" :class="{active: item.enabled}"></button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-6">应用设置</h3>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-[#374151] mb-2 block">默认对话模式</label>
            <select class="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4B5563] bg-white">
              <option>标准对话</option>
              <option>创意写作</option>
              <option>代码助手</option>
              <option>学术研究</option>
            </select>
          </div>
          <div v-for="(item, index) in appSettings" :key="item.title" class="flex items-center justify-between border-t border-gray-100 pt-4" :class="index === 0 ? 'border-t-0 pt-0' : ''">
            <div>
              <h4 class="text-sm font-medium text-[#374151]">{{ item.title }}</h4>
              <p class="text-xs text-[#9CA3AF] mt-1">{{ item.description }}</p>
            </div>
            <button @click="store.updateToggleSetting('app', item.title, !item.enabled)" class="toggle-switch" :class="{active: item.enabled}"></button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 border border-red-200 bg-red-50">
        <h3 class="text-base font-medium text-red-600 mb-6">危险区域</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-[#374151]">清除缓存</h4>
              <p class="text-sm text-[#6B7280] mt-1">清除本地缓存和临时文件</p>
            </div>
            <button @click="handleClearCache" class="px-4 py-2 bg-white border border-red-300 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">清除缓存</button>
          </div>
          <div class="flex items-center justify-between pt-4 border-t border-red-200">
            <div>
              <h4 class="text-sm font-medium text-[#374151]">重置所有设置</h4>
              <p class="text-sm text-red-600 mt-1">将所有设置恢复为默认值</p>
            </div>
            <button @click="handleResetSettings" class="px-4 py-2 bg-red-500 border border-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-600">重置设置</button>
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
  '默认主题': 'bg-white border border-gray-300',
  '护眼模式': 'bg-[#C7EDCC] border border-green-200',
  '深色模式': 'bg-gray-800 border border-gray-600',
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
</style>