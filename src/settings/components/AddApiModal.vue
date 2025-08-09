<template>
  <Teleport to="body">
    <div @click.self="closeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-[#FAFAFA] rounded-2xl w-full max-w-[600px] max-h-[80vh] flex flex-col shadow-xl">
        <div class="px-6 py-5 border-b border-gray-100 bg-white rounded-t-2xl flex-shrink-0">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-[#374151]">新增 API 配置</h3>
            <button @click="closeModal" class="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div class="p-6 overflow-y-auto">
          <form @submit.prevent="save" class="space-y-6">
            <div>
              <label class="text-sm font-medium text-[#374151] mb-3 block">选择服务商</label>
              <div class="grid grid-cols-3 gap-3">
                <div v-for="p in modalProviders" :key="p.name" @click="form.provider = p" :class="{'provider-option-selected': form.provider?.name === p.name}" class="provider-option">
                  <div class="w-8 h-8 bg-gray-200 rounded-lg mx-auto mb-2 flex items-center justify-center text-[#6B7280] font-medium text-xs">{{ p.shortName }}</div>
                  <div class="text-sm font-medium text-[#374151]">{{ p.name }}</div>
                  <div class="text-xs text-[#9CA3AF]">{{ p.description }}</div>
                </div>
              </div>
            </div>

            <div>
              <label class="text-sm font-medium text-[#374151] mb-2 block">配置名称</label>
              <input type="text" v-model="form.name" placeholder="例如：生产环境 API" class="form-input" required>
            </div>

            <div>
              <label class="text-sm font-medium text-[#374151] mb-2 block">API 密钥</label>
              <input type="password" v-model="form.key" placeholder="sk-..." class="form-input" required>
            </div>

            <div>
              <label class="text-sm font-medium text-[#374151] mb-2 block">API 基础 URL（可选）</label>
              <input type="text" v-model="form.baseUrl" placeholder="https://api.openai.com/v1" class="form-input">
              <p class="text-xs text-[#9CA3AF] mt-1">留空将使用默认服务商端点</p>
            </div>

            <div>
              <label class="text-sm font-medium text-[#374151] mb-2 block">默认模型</label>
              <input type="text" v-model="form.model" placeholder="例如：gpt-4-turbo、claude-3-opus-20240229" class="form-input" required>
              <p class="text-xs text-[#9CA3AF] mt-1">输入具体的模型名称</p>
            </div>
          </form>
        </div>

        <div class="flex items-center justify-end gap-3 mt-auto p-6 border-t border-gray-100 flex-shrink-0">
          <button @click="closeModal" class="btn-secondary">取消</button>
          <button @click="save" :disabled="isSaving" class="btn-primary">
            {{ isSaving ? '保存中...' : '保存配置' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { storeToRefs } from 'pinia';
import { useApiManagementStore } from '@/settings/stores/apiManagementStore';
import type { ModalProvider } from '@/settings/api/apiManagementApi';

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', newKeyData: any): void
}>();

const store = useApiManagementStore();
const { modalProviders, isSaving } = storeToRefs(store);

const form = reactive<{
  provider: ModalProvider | null;
  name: string;
  key: string;
  baseUrl: string;
  model: string;
}>({
  provider: null,
  name: '',
  key: '',
  baseUrl: '',
  model: ''
});

const closeModal = () => {
  emit('close');
};

const save = () => {
  if (!form.provider || !form.name || !form.key || !form.model) {
    alert('请填写所有必填项');
    return;
  }

  const newKeyData = {
    provider: form.provider.name,
    providerShort: form.provider.shortName,
    name: form.name,
    key: form.key,
    baseUrl: form.baseUrl,
    model: form.model,
    status: '启用' as const
  };
  emit('save', newKeyData);
};
</script>

<style scoped>
.provider-option { border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.3s; text-align: center; background: white; }
.provider-option:hover { border-color: #9CA3AF; background: #F9FAFB; }
.provider-option-selected { border-color: #4B5563; background: #F3F4F6; border-width: 2px; padding: 15px;}

.form-input { width: 100%; padding: 12px 16px; border: 1px solid #E5E7EB; border-radius: 8px; font-size: 14px; background: white; transition: all 0.2s; }
.form-input:focus { outline: none; border-color: #4B5563; box-shadow: 0 0 0 3px rgba(75, 85, 99, 0.1); }

.btn-primary { padding: 12px 20px; background: #4B5563; color: white; border-radius: 8px; font-size: 14px; font-weight: 500; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover:not(:disabled) { background: #374151; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-secondary { padding: 12px 20px; border: 1px solid #E5E7EB; color: #374151; border-radius: 8px; font-size: 14px; font-weight: 500; background: white; cursor: pointer; transition: all 0.2s; }
.btn-secondary:hover { background: #F9FAFB; border-color: #9CA3AF; }
</style>