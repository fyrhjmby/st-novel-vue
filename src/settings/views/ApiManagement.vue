<template>
  <main class="flex-1 bg-white flex flex-col">
    <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100 bg-white flex-shrink-0">
      <h1 class="text-lg font-medium text-[#374151]">API管理</h1>
    </header>

    <div class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] space-y-6">
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <h3 class="text-base font-medium text-[#374151] mb-6">支持的API服务商</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div v-for="provider in apiProviders" :key="provider.name" class="api-card">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-[#6B7280] font-medium text-sm">
                  {{ provider.shortName }}
                </div>
                <div>
                  <h4 class="font-medium text-[#374151] text-sm">{{ provider.name }}</h4>
                  <p class="text-xs text-[#9CA3AF]">{{ provider.description }}</p>
                </div>
              </div>
              <span class="status-badge" :class="provider.statusClass">{{ provider.statusText }}</span>
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-[#9CA3AF]">活跃密钥</span>
                <span class="font-medium text-[#374151]">{{ provider.activeKeys }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-[#9CA3AF]">总调用次数</span>
                <span class="font-medium text-[#374151]">{{ provider.totalCalls }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- API Key Details -->
      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-base font-medium text-[#374151]">密钥详情</h3>
          <button @click="isModalOpen = true" class="cursor-pointer text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-gray-50">
            <tr class="border-b border-gray-100 text-xs text-[#9CA3AF]">
              <th class="py-3 px-4 font-medium">服务商</th>
              <th class="py-3 px-4 font-medium">名称</th>
              <th class="py-3 px-4 font-medium">密钥</th>
              <th class="py-3 px-4 font-medium">模型</th>
              <th class="py-3 px-4 font-medium">调用次数</th>
              <th class="py-3 px-4 font-medium">状态</th>
              <th class="py-3 px-4 font-medium">创建时间</th>
              <th class="py-3 px-4 font-medium text-right">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="key in apiKeys" :key="key.id" class="border-b border-gray-100 hover:bg-gray-50">
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-gray-200 rounded text-[#6B7280] text-xs flex items-center justify-center font-medium">{{ key.providerShort }}</div>
                  <span class="text-[#374151]">{{ key.provider }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-[#374151]">{{ key.name }}</td>
              <td class="py-3 px-4 text-[#9CA3AF] font-mono">{{ key.keyFragment }}</td>
              <td class="py-3 px-4 text-[#9CA3AF]">{{ key.model }}</td>
              <td class="py-3 px-4 text-[#9CA3AF]">{{ key.calls }}</td>
              <td class="py-3 px-4"><span class="status-badge" :class="key.status === '启用' ? 'status-active' : 'status-inactive'">{{ key.status }}</span></td>
              <td class="py-3 px-4 text-[#9CA3AF]">{{ key.created }}</td>
              <td class="py-3 px-4 flex items-center justify-end gap-3">
                <a href="#" class="text-[#6B7280] hover:text-[#374151] hover:underline">编辑</a>
                <a href="#" class="text-[#9CA3AF] hover:text-[#6B7280] hover:underline">删除</a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>

  <!-- Add API Modal -->
  <Teleport to="body">
    <div v-if="isModalOpen" @click.self="isModalOpen = false" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-[#FAFAFA] rounded-2xl w-full max-w-[600px] max-h-[80vh] flex flex-col shadow-xl">
        <div class="px-6 py-5 border-b border-gray-100 bg-white rounded-t-2xl flex-shrink-0">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-[#374151]">新增 API 配置</h3>
            <button @click="isModalOpen = false" class="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div class="p-6 overflow-y-auto">
          <div class="space-y-6">
            <div>
              <label class="text-sm font-medium text-[#374151] mb-3 block">选择服务商</label>
              <div class="grid grid-cols-3 gap-3">
                <div v-for="p in modalProviders" :key="p.name" @click="selectedProvider = p.name" :class="{'provider-option-selected': selectedProvider === p.name}" class="provider-option">
                  <div class="w-8 h-8 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center text-[#6B7280] font-medium text-xs">{{ p.shortName }}</div>
                  <div class="text-sm font-medium text-[#374151]">{{ p.name }}</div>
                  <div class="text-xs text-[#9CA3AF]">{{ p.description }}</div>
                </div>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-[#374151] mb-2 block">配置名称</label>
              <input type="text" placeholder="例如：生产环境 API" class="form-input">
            </div>

            <div>
              <label class="text-sm font-medium text-[#374151] mb-2 block">API 密钥</label>
              <input type="password" placeholder="sk-..." class="form-input">
            </div>

            <div>
              <label class="text-sm font-medium text-[#374151] mb-2 block">API 基础 URL（可选）</label>
              <input type="text" placeholder="https://api.openai.com/v1" class="form-input">
              <p class="text-xs text-[#9CA3AF] mt-1">留空将使用默认服务商端点</p>
            </div>

            <div>
              <label class="text-sm font-medium text-[#374151] mb-2 block">默认模型</label>
              <input type="text" placeholder="例如：gpt-4-turbo、claude-3-opus-20240229" class="form-input">
              <p class="text-xs text-[#9CA3AF] mt-1">输入具体的模型名称</p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 mt-auto p-6 border-t border-gray-100 flex-shrink-0">
          <button @click="isModalOpen = false" class="btn-secondary">取消</button>
          <button @click="isModalOpen = false" class="btn-primary">保存配置</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isModalOpen = ref(false);
const selectedProvider = ref('');

const apiProviders = ref([
  { name: 'OpenAI', shortName: 'OA', description: 'GPT系列模型', statusText: '2个密钥', statusClass: 'status-active', activeKeys: 2, totalCalls: '15,677' },
  { name: 'Claude', shortName: 'CL', description: 'Anthropic AI', statusText: '1个密钥', statusClass: 'status-active', activeKeys: 1, totalCalls: '8,912' },
  { name: 'Azure OpenAI', shortName: 'AZ', description: 'Microsoft Azure', statusText: '未配置', statusClass: 'status-unconfigured', activeKeys: 0, totalCalls: '0' },
  { name: 'Google AI', shortName: 'GG', description: 'Gemini系列', statusText: '未配置', statusClass: 'status-unconfigured', activeKeys: 0, totalCalls: '0' },
  { name: 'Mistral', shortName: 'MS', description: 'Mistral AI', statusText: '未配置', statusClass: 'status-unconfigured', activeKeys: 0, totalCalls: '0' },
  { name: 'Cohere', shortName: 'CO', description: 'Command系列', statusText: '未配置', statusClass: 'status-unconfigured', activeKeys: 0, totalCalls: '0' },
]);

const apiKeys = ref([
  { id: 1, provider: 'OpenAI', providerShort: 'OA', name: '生产环境密钥', keyFragment: 'sk-••••1a2b', model: 'GPT-4-Turbo', calls: '12,456', status: '启用', created: '2024-03-01' },
  { id: 2, provider: 'OpenAI', providerShort: 'OA', name: '测试环境密钥', keyFragment: 'sk-••••3c4d', model: 'GPT-3.5-Turbo', calls: '3,221', status: '暂停', created: '2024-05-15' },
  { id: 3, provider: 'Claude', providerShort: 'CL', name: '主密钥', keyFragment: 'sk-ant-••••5e6f', model: 'Claude 3 Opus', calls: '8,912', status: '启用', created: '2024-04-10' },
]);

const modalProviders = ref([
  { name: 'OpenAI', shortName: 'OA', description: 'GPT系列' },
  { name: 'Claude', shortName: 'CL', description: 'Anthropic' },
  { name: 'Azure', shortName: 'AZ', description: 'Microsoft' },
  { name: 'Google AI', shortName: 'GG', description: 'Gemini' },
  { name: 'Mistral', shortName: 'MS', description: 'Mistral AI' },
  { name: 'Cohere', shortName: 'CO', description: 'Command' },
]);
</script>

<style scoped>
.api-card { background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; transition: all 0.3s; cursor: pointer; }
.api-card:hover { border-color: #9CA3AF; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); }
.status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; }
.status-active { background: #F0FDF4; color: #15803D; }
.status-inactive { background: #FFFBEB; color: #A16207; }
.status-unconfigured { background: #F9FAFB; color: #6B7280; }

.provider-option { border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.3s; text-align: center; background: white; }
.provider-option:hover { border-color: #9CA3AF; background: #F9FAFB; }
.provider-option-selected { border-color: #4B5563; background: #F3F4F6; border-width: 2px; padding: 15px;}

.form-input { width: 100%; padding: 12px 16px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 14px; background: white; transition: all 0.2s; }
.form-input:focus { outline: none; border-color: #4B5563; box-shadow: 0 0 0 3px rgba(75, 85, 99, 0.1); }

.btn-primary { padding: 12px 20px; background: #4B5563; color: white; border-radius: 8px; font-size: 14px; font-weight: 500; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: #374151; }
.btn-secondary { padding: 12px 20px; border: 1px solid #E5E7EB; color: #374151; border-radius: 8px; font-size: 14px; font-weight: 500; background: white; cursor: pointer; transition: all 0.2s; }
.btn-secondary:hover { background: #F9FAFB; border-color: #9CA3AF; }
</style>