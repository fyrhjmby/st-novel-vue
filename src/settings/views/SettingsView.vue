<template>
  <div class="flex-1 flex flex-col bg-white">
    <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100">
      <h1 class="text-lg font-medium text-[#374151]">用户设置</h1>
    </header>
    <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] space-y-6">
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="flex items-center gap-6">
          <div class="relative">
            <div class="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-2xl font-medium text-gray-700">
              {{ user.name.charAt(0) }}
            </div>
            <button class="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 shadow-sm">
              <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </button>
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-medium text-[#374151]">{{ user.name }}</h2>
            <p class="text-sm text-[#6B7280] mt-1">{{ user.email }}</p>
            <p class="text-xs text-[#9CA3AF] mt-2">加入于 {{ user.joinedAt }}</p>
          </div>
        </div>
      </div>

      <!-- 会员信息 -->
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-base font-medium text-[#374151]">会员计划</h3>
          <a href="#" class="text-sm text-[#4B5563] hover:underline">查看所有计划</a>
        </div>
        <div class="plan-card">
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="text-xl font-semibold">{{ subscription.planName }}</h4>
                  <span class="px-2 py-0.5 bg-white/20 rounded-full text-xs">当前计划</span>
                </div>
                <p class="text-sm text-gray-300 mt-1">{{ subscription.planDesc }}</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-semibold">¥{{ subscription.price }}<span class="text-sm font-normal">/月</span></p>
              </div>
            </div>
            <div class="mt-6 pt-6 border-t border-white/20">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-300">下次续费日期</p>
                  <p class="text-base font-medium">{{ subscription.nextBillingDate }}</p>
                </div>
                <button class="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg text-sm font-medium transition-colors">
                  管理订阅
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 偏好设置 -->
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-6">偏好设置</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h4 class="text-sm font-medium text-[#374151]">界面语言</h4>
              <p class="text-xs text-[#9CA3AF] mt-1">选择您偏好的显示语言</p>
            </div>
            <select v-model="preferences.language" class="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4B5563]">
              <option>简体中文</option>
              <option>English</option>
            </select>
          </div>
          <div class="flex items-center justify-between py-3">
            <div>
              <h4 class="text-sm font-medium text-[#374151]">数据分析</h4>
              <p class="text-xs text-[#9CA3AF] mt-1">允许我们收集使用数据以改进服务</p>
            </div>
            <button
                @click="preferences.analytics = !preferences.analytics"
                class="toggle-switch"
                :class="{ 'active': preferences.analytics }"
                role="switch"
                :aria-checked="preferences.analytics"
            ></button>
          </div>
        </div>
      </div>

      <!-- 账户操作 -->
      <div class="bg-white rounded-xl p-6 border border-red-200 bg-red-50">
        <h3 class="text-base font-medium text-red-600 mb-6">账户操作</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-[#374151]">停用账户</h4>
              <p class="text-sm text-[#6B7280] mt-1">暂时停用您的账户</p>
            </div>
            <button class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50">停用</button>
          </div>
          <div class="flex items-center justify-between pt-4 border-t border-red-200">
            <div>
              <h4 class="text-sm font-medium text-[#374151]">删除账户</h4>
              <p class="text-sm text-red-600 mt-1">永久删除账户和所有数据</p>
            </div>
            <button class="px-4 py-2 bg-red-500 border border-red-600 rounded-lg text-sm font-medium text-white hover:bg-red-600">删除账户</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 模拟用户数据
const user = ref({
  name: '张小明',
  email: 'xiaoming@example.com',
  joinedAt: '2023年5月',
});

// 模拟订阅数据
const subscription = ref({
  planName: 'Pro',
  planDesc: '专业版会员',
  price: 99,
  nextBillingDate: '2025年7月15日',
});

// 模拟偏好设置数据
const preferences = ref({
  language: '简体中文',
  analytics: true,
});
</script>

<style scoped>
.plan-card {
  background: linear-gradient(135deg, #4B5563 0%, #374151 100%);
  color: white;
}
.toggle-switch {
  width: 44px;
  height: 24px;
  background: #D1D5DB;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}
.toggle-switch.active {
  background: #10B981;
}
.toggle-switch::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 10px;
  top: 2px;
  left: 2px;
  transition: all 0.3s;
}
.toggle-switch.active::after {
  transform: translateX(20px);
}
</style>