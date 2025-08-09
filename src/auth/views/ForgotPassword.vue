<template>
  <div class="auth-card p-8 sm:p-10">
    <div class="text-center mb-8">
      <div class="w-16 h-16 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
        <svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
        </svg>
      </div>
      <h1 class="text-2xl font-light text-[#374151] mb-2">忘记密码？</h1>
      <p class="text-sm text-[#9CA3AF]">输入您的邮箱地址，我们将发送重置链接</p>
    </div>

    <form class="space-y-4" @submit.prevent="onResetSubmit">
      <div>
        <label class="block text-sm font-medium text-[#374151] mb-2">邮箱地址</label>
        <input type="email" class="input-field-auth" placeholder="your@email.com" v-model="email" />
      </div>

      <div v-if="message" class="text-green-600 text-sm text-center p-3 bg-green-50 rounded-lg !mt-6">
        {{ message }}
      </div>

      <button type="submit" class="btn-primary-auth !mt-6" :disabled="isLoading">
        {{ isLoading ? '发送中...' : '发送重置链接' }}
      </button>
    </form>

    <div class="mt-8 text-center">
      <router-link to="/auth/login" class="text-sm text-[#4B5563] font-medium hover:underline">
        ← 返回登录
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const message = ref('');
const isLoading = ref(false);

const onResetSubmit = () => {
  if (!email.value) return;
  isLoading.value = true;
  message.value = '';

  setTimeout(() => {
    message.value = `如果 ${email.value} 是一个已注册的邮箱，您将会收到一封重置密码邮件。`;
    isLoading.value = false;
  }, 1000);
};
</script>