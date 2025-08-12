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
    <div v-else-if="user" class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] space-y-6">
      <!-- Profile Card -->
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="flex items-center gap-6">
          <div class="relative">
            <input type="file" ref="fileInput" class="hidden" @change="onFileChange" accept="image/*">
            <template v-if="user.avatar">
              <img :src="user.avatar" class="w-20 h-20 rounded-full object-cover bg-gray-200" alt="User Avatar">
            </template>
            <template v-else>
              <div class="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-2xl font-medium text-gray-700">{{ user.name.charAt(0) }}</div>
            </template>
            <button @click="triggerFileSelect" class="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 shadow-sm">
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-medium text-[#374151]">{{ user.name }}</h2>
            <p class="text-sm text-[#6B7280] mt-1">{{ user.email }}</p>
            <p class="text-xs text-[#9CA3AF] mt-2">加入于 2023年5月</p>
          </div>
        </div>
      </div>
      <!-- Basic Info -->
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-6">基本信息</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Nickname -->
          <div class="info-card p-0">
            <label class="text-xs font-medium text-[#6B7280] uppercase tracking-wide px-5 pt-4 block">昵称</label>
            <div class="px-5 pb-4 pt-2">
              <input type="text" v-model="user.name" class="settings-input">
            </div>
          </div>
          <!-- Email -->
          <div class="info-card p-0">
            <label class="text-xs font-medium text-[#6B7280] uppercase tracking-wide px-5 pt-4 block">电子邮箱</label>
            <div class="px-5 pb-4 pt-2">
              <p class="text-sm font-medium text-[#374151]">{{ user.email }}</p>
            </div>
          </div>
          <!-- Phone -->
          <div class="info-card p-0">
            <label class="text-xs font-medium text-[#6B7280] uppercase tracking-wide px-5 pt-4 block">电话号码</label>
            <div class="px-5 pb-4 pt-2">
              <input type="text" v-model="user.phone" class="settings-input" placeholder="未设置">
            </div>
          </div>
          <!-- Region -->
          <div class="info-card p-0">
            <label class="text-xs font-medium text-[#6B7280] uppercase tracking-wide px-5 pt-4 block">地区</label>
            <div class="px-5 pb-4 pt-2">
              <p class="text-sm font-medium text-[#374151]">{{ user.region }}</p>
            </div>
          </div>
          <!-- Timezone -->
          <div class="info-card p-0">
            <label class="text-xs font-medium text-[#6B7280] uppercase tracking-wide px-5 pt-4 block">时区</label>
            <div class="px-5 pb-4 pt-2">
              <p class="text-sm font-medium text-[#374151]">{{ user.timezone }}</p>
            </div>
          </div>
          <!-- Bio -->
          <div class="col-span-2 info-card p-0">
            <label class="text-xs font-medium text-[#6B7280] uppercase tracking-wide px-5 pt-4 block">个人简介</label>
            <div class="px-5 pb-4 pt-2">
              <textarea v-model="user.bio" rows="3" class="settings-input leading-relaxed" placeholder="介绍一下自己..."></textarea>
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

      <!-- Security Settings -->
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-6">安全设置</h3>
        <div class="space-y-4 divide-y divide-gray-100">
          <div v-for="setting in securitySettings" :key="setting.title" class="flex items-center justify-between pt-4 first:pt-0">
            <div>
              <h4 class="text-sm font-medium text-[#374151]">{{ setting.title }}</h4>
              <p class="text-xs mt-1" :class="setting.statusClass">{{ setting.status }}</p>
            </div>
            <button @click="handleSecurityAction(setting.action)" class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50">{{ setting.action }}</button>
          </div>
        </div>
      </div>

      <!-- Membership Plan -->
      <div class="plan-card-settings">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-medium">会员计划: {{ user.plan }}</h3>
          <router-link to="/vip" class="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg text-sm font-medium transition-colors">升级计划</router-link>
        </div>
        <p class="text-sm text-gray-300 mb-4">当前计划权益:</p>
        <ul class="space-y-2 text-sm">
          <li v-for="feature in proPlanFeatures" :key="feature" class="flex items-center gap-2">
            <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            <span>{{ feature }}</span>
          </li>
        </ul>
      </div>

    </div>
    <div v-else class="flex-1 flex items-center justify-center bg-[#FCFCFC]">
      <p class="text-gray-500">无法加载用户信息。</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/settings/stores/userStore';

const userStore = useUserStore();
const {
  user,
  notifications,
  securitySettings,
  proPlanFeatures
} = storeToRefs(userStore);

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileSelect = () => {
  fileInput.value?.click();
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file && user.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        user.value.avatar = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
};

onMounted(() => {
  userStore.initializeSettings();
});

onUnmounted(() => {
  if (userStore.hasChanges) {
    userStore.resetChanges();
  }
});

const handleSecurityAction = (action: string) => {
  switch (action) {
    case '修改':
      alert('（模拟）正在打开修改密码对话框...');
      break;
    case '启用':
      alert('（模拟）正在跳转至双重验证（2FA）设置页面...');
      break;
    case '管理':
      alert('（模拟）正在打开登录设备管理页面...');
      break;
    case '查看':
      alert('（模拟）正在显示最近的登录历史...');
      break;
    default:
      break;
  }
};
</script>

<style scoped>
@import '../style.css';
</style>