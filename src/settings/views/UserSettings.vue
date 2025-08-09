<!-- src/settings/views/UserSettings.vue -->
<template>
  <main class="flex-1 bg-white flex flex-col">
    <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
      <h1 class="text-lg font-medium text-[#374151]">用户设置</h1>
      <div v-if="userStore.hasChanges" class="flex items-center gap-3">
        <button @click="userStore.resetChanges" :disabled="userStore.isSaving" class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 disabled:opacity-50">
          取消
        </button>
        <button @click="userStore.saveSettings" :disabled="userStore.isSaving" class="px-4 py-2 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-[#374151] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {{ userStore.isSaving ? '保存中...' : '保存更改' }}
        </button>
      </div>
    </header>
    <div v-if="userStore.isLoading" class="flex-1 flex items-center justify-center bg-[#FCFCFC]">
      <p>加载中...</p>
    </div>
    <div v-else class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] space-y-6">
      <!-- Profile Card -->
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="flex items-center gap-6">
          <div class="relative">
            <div class="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-2xl font-medium text-gray-700">张</div>
            <button class="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 shadow-sm">
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-medium text-[#374151]">{{ basicInfo.find(i => i.label === '昵称')?.value }}</h2>
            <p class="text-sm text-[#6B7280] mt-1">{{ basicInfo.find(i => i.label === '电子邮箱')?.value }}</p>
            <p class="text-xs text-[#9CA3AF] mt-2">加入于 2023年5月</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-6">基本信息</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="info in basicInfo" :key="info.label" :class="[info.fullWidth ? 'col-span-2' : '']" class="info-card p-0">
            <label class="text-xs font-medium text-[#6B7280] uppercase tracking-wide px-5 pt-4 block">{{ info.label }}</label>
            <div class="px-5 pb-4 pt-2">
              <p v-if="!info.editable" class="text-sm font-medium text-[#374151]">{{ info.value }}</p>
              <input v-if="info.editable && info.type === 'text'" type="text" v-model="info.value" class="settings-input">
              <textarea v-if="info.editable && info.type === 'textarea'" v-model="info.value" rows="3" class="settings-input leading-relaxed"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-6">通知设置</h3>
        <div class="space-y-4 divide-y divide-gray-100">
          <div v-for="notification in notifications" :key="notification.id" class="flex items-center justify-between pt-4 first:pt-0">
            <div>
              <h4 class="text-sm font-medium text-[#374151]">{{ notification.title }}</h4>
              <p class="text-xs text-[#9CA3AF] mt-1">{{ notification.description }}</p>
            </div>
            <button @click="userStore.updateNotification(notification.id, !notification.enabled)" class="toggle-switch" role="switch" :aria-checked="notification.enabled" :class="{active: notification.enabled}"></button>
          </div>
        </div>
      </div>

      <!-- Membership Plan and other sections remain unchanged -->
      <!-- ... -->
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/settings/stores/userStore';

const userStore = useUserStore();

const {
  basicInfo,
  notifications,
  securitySettings,
  proPlanFeatures
} = storeToRefs(userStore);

onMounted(() => {
  userStore.initializeSettings();
});

onUnmounted(() => {
  if (userStore.hasChanges) {
    userStore.resetChanges();
  }
});

</script>

<style scoped>
@import '../style.css';
</style>