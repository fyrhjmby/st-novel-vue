<template>
  <main class="flex-1 bg-white flex flex-col">
    <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
      <h1 class="text-lg font-medium text-[#374151]">数据与隐私</h1>
      <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        下载隐私报告
      </button>
    </header>
    <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] space-y-6">
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
            <button @click="setting.enabled = !setting.enabled" class="toggle-switch" :class="{active: setting.enabled}"></button>
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
import { ref, reactive } from 'vue';

const dataCollectionSettings = reactive([
  { title: '对话历史', description: '保存您与AI的对话记录以提供更好的服务', enabled: true },
  { title: '使用分析', description: '收集匿名使用数据以改进产品体验', enabled: true },
  { title: '性能监控', description: '收集性能数据以优化系统响应速度', enabled: false },
  { title: '错误报告', description: '自动发送错误报告帮助我们修复问题', enabled: true },
]);

const dataUsage = ref([
  { title: '个人信息', tag: '加密存储', tagClass: 'bg-green-100 text-green-700', includes: '包括：姓名、邮箱、电话号码', purpose: '用途：账户管理、身份验证、客户支持' },
  { title: '对话数据', tag: '端到端加密', tagClass: 'bg-green-100 text-green-700', includes: '包括：对话内容、上传文件、生成结果', purpose: '用途：提供AI服务、改进模型、个性化体验' },
  { title: '使用数据', tag: '匿名化处理', tagClass: 'bg-blue-100 text-blue-700', includes: '包括：功能使用频率、响应时间、错误日志', purpose: '用途：产品改进、性能优化、问题诊断' },
]);

const dataPermissions = ref([
  { title: '导出数据', description: '下载您的所有个人数据副本', action: '立即导出', icon: `<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/></svg>`, containerClass: 'border border-gray-200 hover:border-gray-300', iconBgClass: 'bg-blue-100', descClass: 'text-[#6B7280]', buttonClass: 'text-[#3B82F6]' },
  { title: '数据迁移', description: '将数据转移到其他服务', action: '开始迁移', icon: `<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>`, containerClass: 'border border-gray-200 hover:border-gray-300', iconBgClass: 'bg-green-100', descClass: 'text-[#6B7280]', buttonClass: 'text-[#3B82F6]' },
  { title: '暂停收集', description: '临时停止数据收集活动', action: '暂停收集', icon: `<svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`, containerClass: 'border border-gray-200 hover:border-gray-300', iconBgClass: 'bg-yellow-100', descClass: 'text-[#6B7280]', buttonClass: 'text-[#3B82F6]' },
  { title: '删除数据', description: '永久删除所有数据', action: '请求删除', icon: `<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`, containerClass: 'border border-red-200 hover:border-red-300 bg-red-50', iconBgClass: 'bg-red-100', descClass: 'text-red-600', buttonClass: 'text-red-600' },
]);

const promises = ref([
  '不会出售您的个人数据',
  '仅在必要时与服务提供商共享数据',
  '所有第三方必须遵守我们的隐私标准',
  '您可以随时撤销数据共享许可',
]);
</script>

<style scoped>
@import '../style.css';
</style>