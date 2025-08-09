<template>
  <main class="flex-1 bg-white flex flex-col">
    <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
      <h1 class="text-lg font-medium text-[#374151]">数据与隐私</h1>
      <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        下载隐私报告
      </button>
    </header>
    <div v-if="store.isLoading" class="flex-1 flex items-center justify-center bg-[#FCFCFC]">
      <p>加载中...</p>
    </div>
    <div v-else class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] space-y-6">
      <!-- Privacy Overview -->
      <div class="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-medium text-blue-900 mb-2">您的数据是安全的</h3>
            <p class="text-sm text-blue-700">我们采用行业标准的加密技术保护您的数据，并严格遵守数据保护法规。您拥有对自己数据的完全控制权。</p>
          </div>
        </div>
      </div>

      <!-- Data Collection Settings -->
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-6">数据收集设置</h3>
        <div class="space-y-4 divide-y divide-gray-100">
          <div v-for="(setting, index) in dataCollectionSettings" :key="setting.title" class="flex items-center justify-between" :class="index > 0 ? 'pt-4' : ''">
            <div>
              <h4 class="text-sm font-medium text-[#374151]">{{ setting.title }}</h4>
              <p class="text-xs text-[#9CA3AF] mt-1">{{ setting.description }}</p>
            </div>
            <button @click="store.updateCollectionSetting(setting.title, !setting.enabled)" class="toggle-switch" :class="{active: setting.enabled}"></button>
          </div>
        </div>
      </div>

      <!-- Data Usage Transparency -->
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-6">数据使用透明度</h3>
        <div class="space-y-4">
          <div v-for="item in dataUsage" :key="item.title" class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-medium text-[#374151]">{{ item.title }}</h4>
              <span class="text-xs px-2 py-1 rounded" :class="item.tagClass">{{ item.tag }}</span>
            </div>
            <p class="text-xs text-[#6B7280] mb-2">{{ item.includes }}</p>
            <p class="text-xs text-[#9CA3AF]">{{ item.purpose }}</p>
          </div>
        </div>
      </div>

      <!-- Data Permission Management -->
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-6">数据权限管理</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="permission in dataPermissions" :key="permission.title" class="p-4 rounded-lg transition-colors" :class="permission.containerClass">
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="permission.iconBgClass">
                <span v-html="permission.icon"></span>
              </div>
              <h4 class="font-medium text-[#374151]">{{ permission.title }}</h4>
            </div>
            <p class="text-sm mb-3" :class="permission.descClass">{{ permission.description }}</p>
            <button class="text-sm hover:underline" :class="permission.buttonClass">{{ permission.action }}</button>
          </div>
        </div>
      </div>

      <!-- Third-party Sharing -->
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-6">第三方数据共享</h3>
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <p class="text-sm text-[#374151] mb-2">我们承诺：</p>
          <ul class="space-y-1 text-sm text-[#6B7280]">
            <li v-for="promise in promises" :key="promise" class="flex items-start gap-2">
              <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              <span>{{ promise }}</span>
            </li>
          </ul>
        </div>
        <button class="text-sm text-[#3B82F6] hover:underline">查看完整隐私政策</button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useDataPrivacyStore } from '@/settings/stores/dataPrivacyStore';

const store = useDataPrivacyStore();
const {
  dataCollectionSettings,
  dataUsage,
  dataPermissions,
  promises,
} = storeToRefs(store);

onMounted(() => {
  store.initializeData();
});
</script>

<style scoped>
@import '../style.css';
</style>