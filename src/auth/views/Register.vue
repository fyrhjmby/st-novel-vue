<template>
  <div class="auth-card p-8 sm:p-10">
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
        <svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
        </svg>
      </div>
      <h1 class="text-2xl font-light text-[#374151] mb-2">创建账户</h1>
      <p class="text-sm text-[#9CA3AF]">开始您的 AI 创作之旅</p>
    </div>

    <form class="space-y-4" @submit.prevent="onRegisterSubmit">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-[#374151] mb-2">名字</label>
          <input type="text" class="input-field-auth" placeholder="小明" v-model="formData.firstName" />
        </div>
        <div>
          <label class="block text-sm font-medium text-[#374151] mb-2">姓氏</label>
          <input type="text" class="input-field-auth" placeholder="张" v-model="formData.lastName" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-[#374151] mb-2">邮箱地址</label>
        <input type="email" class="input-field-auth" placeholder="your@email.com" v-model="formData.email" />
      </div>

      <div>
        <label class="block text-sm font-medium text-[#374151] mb-2">密码</label>
        <input type="password" class="input-field-auth" placeholder="至少8个字符" v-model="formData.password" />
      </div>

      <div class="checkbox-container">
        <input type="checkbox" id="terms" class="checkbox" v-model="formData.termsAccepted" />
        <label for="terms" class="text-sm text-[#6B7280]">
          我同意 <a href="#" class="text-[#4B5563] hover:underline">服务条款</a> 和
          <a href="#" class="text-[#4B5563] hover:underline">隐私政策</a>
        </label>
      </div>

      <div v-if="authStore.error" class="text-red-500 text-sm text-center !mt-4">
        {{ authStore.error }}
      </div>

      <button type="submit" class="btn-primary-auth !mt-6" :disabled="authStore.isLoading">
        {{ authStore.isLoading ? '创建中...' : '创建账户' }}
      </button>
    </form>

    <div class="divider">
      <span>或者</span>
    </div>

    <div class="space-y-3">
      <button class="btn-secondary-auth flex items-center justify-center gap-3">
        <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        <span>使用 Google 注册</span>
      </button>
    </div>

    <p class="text-center mt-8 text-sm text-[#9CA3AF]">
      已有账户？
      <router-link to="/auth/login" class="text-[#4B5563] font-medium hover:underline">立即登录</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useAuthStore } from '@/auth/store/auth.store';
import { useAuthService } from '@/auth/services/auth.service';
import type { RegistrationData } from '@/auth/types';

const authStore = useAuthStore();
const { handleRegister } = useAuthService();

const formData = reactive<RegistrationData>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  termsAccepted: false,
});

const onRegisterSubmit = async () => {
  authStore.setError(null);
  if (!formData.termsAccepted) {
    authStore.setError('请先同意服务条款和隐私政策');
    return;
  }
  try {
    await handleRegister(formData);
  } catch(error) {
    console.error("Registration failed:", error);
  }
};
</script>