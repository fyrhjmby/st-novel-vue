<template>
  <main class="flex-1 bg-white flex flex-col">
    <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
      <h1 class="text-lg font-medium text-[#374151]">用户设置</h1>
    </header>
    <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] space-y-6">
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
            <h2 class="text-xl font-medium text-[#374151]">张小明</h2>
            <p class="text-sm text-[#6B7280] mt-1">xiaoming@example.com</p>
            <p class="text-xs text-[#9CA3AF] mt-2">加入于 2023年5月</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-base font-medium text-[#374151]">基本信息</h3>
          <button class="px-4 py-2 bg-[#4B5563] text-white rounded-lg text-sm font-medium hover:bg-[#374151] transition-colors">保存更改</button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="info in basicInfo" :key="info.label" :class="[info.fullWidth ? 'col-span-2' : '', info.editable ? 'editable-field' : '']" class="info-card">
            <div class="flex items-center justify-between mb-3">
              <label class="text-xs font-medium text-[#6B7280] uppercase tracking-wide">{{ info.label }}</label>
              <svg v-if="info.editable" class="w-4 h-4 text-gray-400 edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              <svg v-else class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <p class="text-sm font-medium text-[#374151]" :class="{ 'leading-relaxed': info.fullWidth }">{{ info.value }}</p>
          </div>
        </div>
      </div>

      <!-- Membership Plan -->
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-base font-medium text-[#374151]">会员计划</h3>
          <router-link to="/vip" class="text-sm text-[#4B5563] hover:underline">查看所有计划</router-link>
        </div>
        <div class="plan-card-settings">
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-4">
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="text-xl font-semibold">Pro</h4>
                  <span class="px-2 py-0.5 bg-white/20 rounded-full text-xs">当前计划</span>
                </div>
                <p class="text-sm text-gray-300 mt-1">专业版会员</p>
              </div>
              <div class="text-right">
                <p class="text-2xl font-semibold">¥99<span class="text-sm font-normal">/月</span></p>
              </div>
            </div>
            <div class="space-y-3">
              <div v-for="feature in proPlanFeatures" :key="feature" class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                <span class="text-sm">{{ feature }}</span>
              </div>
            </div>
            <div class="mt-6 pt-6 border-t border-white/20">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-300">下次续费日期</p>
                  <p class="text-base font-medium">2025年7月15日</p>
                </div>
                <button class="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg text-sm font-medium transition-colors">
                  管理订阅
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div class="flex items-start gap-3">
            <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <div>
              <p class="text-sm font-medium text-blue-900">升级到 Max 计划</p>
              <p class="text-xs text-blue-700 mt-1">获得无限 tokens、更快的响应速度和专属功能</p>
              <button class="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700">了解更多 →</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Preference Settings -->
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-6">偏好设置</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h4 class="text-sm font-medium text-[#374151]">界面语言</h4>
              <p class="text-xs text-[#9CA3AF] mt-1">选择您偏好的显示语言</p>
            </div>
            <select class="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4B5563]">
              <option>简体中文</option>
              <option>English</option>
              <option>繁體中文</option>
            </select>
          </div>
          <div class="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h4 class="text-sm font-medium text-[#374151]">主题模式</h4>
              <p class="text-xs text-[#9CA3AF] mt-1">选择界面主题色调</p>
            </div>
            <div class="flex gap-2">
              <button class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-[#374151] bg-white">浅色</button>
              <button class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-400">深色</button>
              <button class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-400">跟随系统</button>
            </div>
          </div>
          <div class="flex items-center justify-between py-3">
            <div>
              <h4 class="text-sm font-medium text-[#374151]">数据分析</h4>
              <p class="text-xs text-[#9CA3AF] mt-1">允许我们收集使用数据以改进服务</p>
            </div>
            <button class="toggle-switch active" role="switch" :aria-checked="preferences.dataAnalysis" @click="preferences.dataAnalysis = !preferences.dataAnalysis" :class="{active: preferences.dataAnalysis}"></button>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-6">通知设置</h3>
        <div class="space-y-4">
          <div v-for="notification in notifications" :key="notification.id" class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div>
              <h4 class="text-sm font-medium text-[#374151]">{{ notification.title }}</h4>
              <p class="text-xs text-[#9CA3AF] mt-1">{{ notification.description }}</p>
            </div>
            <button class="toggle-switch" role="switch" :aria-checked="notification.enabled" @click="notification.enabled = !notification.enabled" :class="{active: notification.enabled}"></button>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-6">安全设置</h3>
        <div class="space-y-4">
          <div v-for="sec in securitySettings" :key="sec.title" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 class="text-sm font-medium text-[#374151]">{{ sec.title }}</h4>
              <p class="text-xs mt-1" :class="sec.statusClass">{{ sec.status }}</p>
            </div>
            <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50">{{ sec.action }}</button>
          </div>
        </div>
      </div>

      <!-- Account Actions -->
      <div class="bg-white rounded-xl p-6 border border-red-200 bg-red-50">
        <h3 class="text-base font-medium text-red-600 mb-6">账户操作</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="text-sm font-medium text-[#374151]">导出数据</h4>
              <p class="text-sm text-[#6B7280] mt-1">下载您的所有数据副本</p>
            </div>
            <button class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50">申请导出</button>
          </div>
          <div class="flex items-center justify-between pt-4 border-t border-red-200">
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
  </main>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const basicInfo = ref([
  { label: '用户名', value: 'zhangxiaoming', editable: false },
  { label: '昵称', value: '张小明', editable: true },
  { label: '电子邮箱', value: 'xiaoming@example.com', editable: true },
  { label: '手机号码', value: '+86 138****8888', editable: true },
  { label: '所在地区', value: '中国大陆', editable: true },
  { label: '时区', value: 'UTC+8 北京时间', editable: true },
  { label: '个人简介', value: '热爱技术，专注于AI和机器学习领域。对新技术充满好奇，享受解决复杂问题的过程。', editable: true, fullWidth: true },
]);

const proPlanFeatures = ref([
  '每月 50万 tokens',
  'GPT-4 & Claude 3 访问权限',
  '优先响应 & 技术支持'
]);

const preferences = reactive({
  dataAnalysis: true,
});

const notifications = reactive([
  { id: 1, title: '邮件通知', description: '接收产品更新和重要通知', enabled: true },
  { id: 2, title: '短信通知', description: '账户安全相关的短信提醒', enabled: false },
  { id: 3, title: '营销推送', description: '优惠活动和新功能推荐', enabled: false },
  { id: 4, title: '浏览器通知', description: '在浏览器中接收实时通知', enabled: true },
]);

const securitySettings = ref([
  { title: '修改密码', status: '上次修改：2024年3月15日', statusClass: 'text-[#9CA3AF]', action: '修改' },
  { title: '双重验证 (2FA)', status: '未启用', statusClass: 'text-red-500', action: '启用' },
  { title: '登录设备', status: '当前有 3 个活跃设备', statusClass: 'text-[#9CA3AF]', action: '管理' },
  { title: '登录历史', status: '查看最近的登录活动', statusClass: 'text-[#9CA3AF]', action: '查看' },
]);

</script>

<style scoped>
@import '../style.css';
</style>