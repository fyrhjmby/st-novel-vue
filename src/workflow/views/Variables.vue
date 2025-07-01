// =
// 文件: ..\src\workflow\views\Variables.vue
//

<template>
  <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC]">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-xl font-medium text-[#374151]">变量库</h1>
        <p class="text-sm text-[#9CA3AF] mt-1">管理可在所有工作流中使用的全局变量</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="relative">
          <input type="text" placeholder="搜索变量名..."
                 class="w-64 pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all">
          <svg class="w-5 h-5 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21L16.65 16.65"/>
          </svg>
        </div>
        <button class="px-4 py-2 bg-[#374151] text-white rounded-lg text-sm font-medium hover:bg-[#1F2937] transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
          添加变量
        </button>
      </div>
    </div>

    <!-- 变量列表表格 -->
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <table class="min-w-full divide-y divide-gray-100">
        <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">变量名</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">类型</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">值</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">描述</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">最后更新</th>
          <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">操作</th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-100">
        <tr v-for="variable in variables" :key="variable.id" class="hover:bg-gray-50/50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#374151] font-mono">{{ variable.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="variable.type === 'Secret' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'">
                {{ variable.type }}
              </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center gap-2">
                <span class="text-sm text-gray-500 font-mono" :class="{'tracking-widest': variable.type === 'Secret'}">
                  {{ variable.type === 'Secret' ? '••••••••••••' : variable.value }}
                </span>
              <button class="text-gray-400 hover:text-gray-600" title="复制值">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
              </button>
            </div>
          </td>
          <td class="px-6 py-4 text-sm text-[#6B7280] max-w-xs truncate">{{ variable.description }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">{{ variable.lastUpdated }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-[#3B82F6] hover:text-blue-700 mr-4">编辑</button>
            <button class="text-red-600 hover:text-red-800">删除</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const variables = ref([
  {
    id: 'var-01',
    name: 'OPENAI_API_KEY',
    type: 'Secret',
    value: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: '用于访问 OpenAI 服务的 API 密钥。',
    lastUpdated: '2024-05-10',
  },
  {
    id: 'var-02',
    name: 'SYSTEM_PROMPT',
    type: 'String',
    value: '你是一个乐于助人的AI助手。',
    description: '所有工作流中使用的默认系统提示词。',
    lastUpdated: '2024-05-20',
  },
  {
    id: 'var-03',
    name: 'SLACK_WEBHOOK_URL',
    type: 'Secret',
    value: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
    description: '用于发送通知到 #general 频道的 Slack Webhook。',
    lastUpdated: '2024-04-18',
  },
  {
    id: 'var-04',
    name: 'ADMIN_EMAIL',
    type: 'String',
    value: 'admin@creator-platform.com',
    description: '接收重要错误报告的管理员邮箱地址。',
    lastUpdated: '2024-03-01',
  },
]);
</script>