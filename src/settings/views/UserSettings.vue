<!-- src/settings/views/UserSettings.vue -->
<template>
  <main class="flex-1 bg-[var(--color-bg-primary)] flex flex-col transition-colors">
    <!-- Header -->
    <header class="h-20 px-8 flex items-center justify-between border-b border-[var(--color-border-primary)] flex-shrink-0">
      <h1 class="text-lg font-medium text-[var(--color-text-primary)]">用户设置</h1>
      <div v-if="userStore.hasChanges" class="flex items-center gap-3">
        <button @click="userStore.resetChanges" :disabled="userStore.isSaving" class="px-4 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] disabled:opacity-50">
          取消
        </button>
        <button @click="userStore.saveSettings" :disabled="userStore.isSaving" class="px-4 py-2 bg-[var(--color-bg-accent)] text-[var(--color-text-on-accent)] rounded-lg text-sm font-medium hover:bg-[var(--color-bg-accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {{ userStore.isSaving ? '保存中...' : '保存更改' }}
        </button>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="userStore.isLoading" class="flex-1 flex items-center justify-center bg-[var(--color-bg-app)]">
      <p class="text-[var(--color-text-muted)]">加载中...</p>
    </div>

    <!-- Main Content -->
    <div v-else-if="user" class="flex-1 px-8 py-6 overflow-auto bg-[var(--color-bg-app)] space-y-8">

      <!-- Profile Section -->
      <div class="bg-[var(--color-bg-primary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
        <h3 class="text-base font-medium text-[var(--color-text-primary)] mb-6">个人资料</h3>
        <div class="flex items-start gap-8">
          <!-- Avatar Uploader -->
          <div class="flex-shrink-0">
            <input type="file" ref="fileInput" class="hidden" @change="onFileChange" accept="image/*">
            <div class="relative w-24 h-24">
              <img v-if="user.avatar" :src="user.avatar" class="w-full h-full rounded-full object-cover bg-gray-200" alt="User Avatar">
              <div v-else class="w-full h-full bg-gradient-to-br from-[var(--color-bg-muted)] to-[var(--color-border-primary)] rounded-full flex items-center justify-center text-3xl font-medium text-[var(--color-text-secondary)]">{{ user.name.charAt(0) }}</div>
              <button @click="triggerFileSelect" class="absolute bottom-0 right-0 w-8 h-8 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-full flex items-center justify-center hover:bg-[var(--color-bg-tertiary)] shadow-sm transition-transform hover:scale-110">
                <svg class="w-4 h-4 text-[var(--color-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path></svg>
              </button>
            </div>
            <p class="text-xs text-center mt-2 text-[var(--color-text-muted)]">点击编辑头像</p>
          </div>

          <!-- User Info Form -->
          <div class="flex-1 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label for="nickname" class="form-label">昵称</label>
                <input type="text" id="nickname" v-model="user.name" class="form-input">
              </div>
              <div class="form-group">
                <label for="email" class="form-label">电子邮箱</label>
                <p id="email" class="text-sm font-medium text-[var(--color-text-primary)] pt-3">{{ user.email }}</p>
              </div>
            </div>
            <div class="form-group">
              <label for="bio" class="form-label">个人简介</label>
              <textarea id="bio" v-model="user.bio" rows="3" class="form-input leading-relaxed resize-none" placeholder="介绍一下自己..."></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Info Section -->
      <div class="bg-[var(--color-bg-primary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
        <h3 class="text-base font-medium text-[var(--color-text-primary)] mb-6">账户信息</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div class="form-group">
            <label for="phone" class="form-label">电话号码</label>
            <input type="text" id="phone" v-model="user.phone" class="form-input" placeholder="未设置">
          </div>
          <div class="form-group">
            <label for="region" class="form-label">地区</label>
            <p id="region" class="text-sm font-medium text-[var(--color-text-primary)] pt-3">{{ user.region }}</p>
          </div>
          <div class="form-group">
            <label for="timezone" class="form-label">时区</label>
            <p id="timezone" class="text-sm font-medium text-[var(--color-text-primary)] pt-3">{{ user.timezone }}</p>
          </div>
          <div class="form-group">
            <label for="joinDate" class="form-label">加入时间</label>
            <p id="joinDate" class="text-sm font-medium text-[var(--color-text-primary)] pt-3">2023年5月</p>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-[var(--color-bg-primary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
        <h3 class="text-base font-medium text-[var(--color-text-primary)] mb-2">通知设置</h3>
        <p class="text-sm text-[var(--color-text-muted)] mb-6">选择您希望收到的通知类型</p>
        <div class="space-y-2 divide-y divide-[var(--color-border-secondary)]">
          <div v-for="notification in notifications" :key="notification.id" class="setting-row">
            <div class="setting-row-content">
              <h4 class="font-medium text-[var(--color-text-primary)]">{{ notification.title }}</h4>
              <p class="text-[var(--color-text-muted)] mt-1">{{ notification.description }}</p>
            </div>
            <button @click="userStore.updateNotification(notification.id, !notification.enabled)" class="toggle-switch" role="switch" :aria-checked="notification.enabled" :class="{active: notification.enabled}"></button>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="bg-[var(--color-bg-primary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
        <h3 class="text-base font-medium text-[var(--color-text-primary)] mb-2">安全设置</h3>
        <p class="text-sm text-[var(--color-text-muted)] mb-6">管理您账户的安全选项</p>
        <div class="space-y-2 divide-y divide-[var(--color-border-secondary)]">
          <div v-for="setting in securitySettings" :key="setting.title" class="setting-row">
            <div class="setting-row-content">
              <h4 class="font-medium text-[var(--color-text-primary)]">{{ setting.title }}</h4>
              <p class="mt-1" :class="setting.statusClass">{{ setting.status }}</p>
            </div>
            <button @click="handleSecurityAction(setting.action)" class="px-4 py-2 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors">
              {{ setting.action }}
            </button>
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

    <!-- Error State -->
    <div v-else class="flex-1 flex items-center justify-center bg-[var(--color-bg-app)]">
      <p class="text-[var(--color-text-muted)]">无法加载用户信息。</p>
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
  // The beforeEnter guard in the router should handle this,
  // but it's good practice to have a fallback.
  if (!userStore.user) {
    userStore.initializeSettings();
  }
});

onUnmounted(() => {
  // Reset any unsaved changes when leaving the component
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

.form-group {
  @apply flex flex-col gap-1;
}

.form-label {
  @apply text-sm font-medium text-[var(--color-text-secondary)];
}

.form-input {
  @apply w-full rounded-lg text-sm transition-all;
  @apply bg-transparent text-[var(--color-text-primary)];
  padding: 0.625rem 0.75rem; /* ~py-2.5 px-3 */
  border: 1px solid transparent;
}

.form-input:hover {
  @apply bg-[var(--color-bg-secondary)];
  border-color: var(--color-border-secondary);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-border-focus);
  background-color: var(--color-bg-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-border-focus) 20%, transparent);
}

.form-input::placeholder {
  @apply text-[var(--color-text-muted)];
}

.setting-row {
  @apply flex items-center justify-between py-4 text-sm;
}
.setting-row:first-of-type {
  @apply pt-0;
}
.setting-row:last-of-type {
  @apply pb-0;
}

.setting-row-content {
  @apply flex-1 pr-8;
}

</style>