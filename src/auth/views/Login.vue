<template>
  <div class="auth-card p-8 sm:p-10">
    <div class="text-center mb-10">
      <div class="w-16 h-16 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
        <svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      </div>
      <h1 class="text-2xl font-light text-[#374151] mb-2">欢迎回来</h1>
      <p class="text-sm text-[#9CA3AF]">登录到您的 AI Creator 账户</p>
    </div>

    <form class="space-y-5" @submit.prevent="onLoginSubmit">
      <div>
        <label class="block text-sm font-medium text-[#374151] mb-2">邮箱地址</label>
        <input type="email" class="input-field-auth" placeholder="admin@example.com" v-model="credentials.email" />
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="block text-sm font-medium text-[#374151]">密码</label>
          <router-link to="/auth/forgot-password" class="text-sm text-[#4B5563] hover:underline">忘记密码？</router-link>
        </div>
        <input type="password" class="input-field-auth" placeholder="123456" v-model="credentials.password" />
      </div>

      <div class="flex items-center justify-between">
        <div class="checkbox-container">
          <input type="checkbox" id="remember" class="checkbox" v-model="rememberMe" />
          <label for="remember" class="text-sm text-[#6B7280]">记住我</label>
        </div>
      </div>

      <div v-if="authStore.error" class="text-red-500 text-sm text-center !mt-4">
        {{ authStore.error }}
      </div>

      <button type="submit" class="btn-primary-auth !mt-6" :disabled="authStore.isLoading">
        {{ authStore.isLoading ? '登录中...' : '登录' }}
      </button>
    </form>

    <div class="divider">
      <span>或者</span>
    </div>

    <div class="space-y-3">
      <button class="btn-secondary-auth flex items-center justify-center gap-3">
        <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        <span>使用 Google 登录</span>
      </button>
      <button class="btn-secondary-auth flex items-center justify-center gap-3">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        <span>使用 GitHub 登录</span>
      </button>
    </div>

    <p class="text-center mt-8 text-sm text-[#9CA3AF]">
      还没有账户？
      <router-link to="/auth/register" class="text-[#4B5563] font-medium hover:underline">立即注册</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthService } from '@/auth/services/auth.service';
import { useAuthStore } from '@/auth/store/auth.store';
import type { UserCredentials } from '@/auth/types';

const authStore = useAuthStore();
const { handleLogin } = useAuthService();

const credentials = reactive<UserCredentials>({
  email: 'admin@example.com',
  password: '123456',
});
const rememberMe = ref(false);

const onLoginSubmit = async () => {
  try {
    await handleLogin(credentials);
  } catch (error) {
    console.error("Login failed:", error);
  }
};
</script>