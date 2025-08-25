<!-- src/settings/components/ApiConfigModal.vue -->
<template>
  <Teleport to="body">
    <div @click.self="closeModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
      <div class="bg-[var(--color-bg-secondary)] rounded-2xl w-full max-w-[600px] max-h-[90vh] flex flex-col shadow-xl border border-[var(--color-border-primary)]">
        <div class="px-6 py-5 border-b border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] rounded-t-2xl flex-shrink-0">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-[var(--color-text-primary)]">{{ modalTitle }}</h3>
            <button @click="closeModal" class="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <div class="p-6 overflow-y-auto">
          <form @submit.prevent="save" class="space-y-6">
            <div>
              <label class="text-sm font-medium text-[var(--color-text-primary)] mb-3 block">选择服务商</label>
              <div class="grid grid-cols-3 gap-3">
                <div v-for="p in modalProviders" :key="p.name" @click="!isEditMode && (form.provider = p)" :class="{'provider-option-selected': form.provider?.name === p.name, 'disabled': isEditMode}" class="provider-option">
                  <div class="w-8 h-8 bg-[var(--color-bg-muted)] rounded-lg mx-auto mb-2 flex items-center justify-center text-[var(--color-text-secondary)] font-medium text-xs">{{ p.shortName }}</div>
                  <div class="text-sm font-medium text-[var(--color-text-primary)]">{{ p.name }}</div>
                  <div class="text-xs text-[var(--color-text-muted)]">{{ p.description }}</div>
                </div>
              </div>
              <p v-if="isEditMode" class="text-xs text-[var(--color-text-muted)] mt-2">编辑模式下不可更改服务商。</p>
            </div>

            <div>
              <label class="text-sm font-medium text-[var(--color-text-primary)] mb-2 block">配置名称</label>
              <input type="text" v-model="form.name" placeholder="例如：生产环境 API" class="form-input" required>
            </div>

            <div>
              <label class="text-sm font-medium text-[var(--color-text-primary)] mb-2 block">API 密钥</label>
              <input type="password" v-model="form.key" :placeholder="keyInputPlaceholder" class="form-input" :required="!isEditMode">
            </div>

            <div>
              <label class="text-sm font-medium text-[var(--color-text-primary)] mb-2 block">API 基础 URL (可选)</label>
              <input type="text" v-model="form.baseUrl" placeholder="https://api.openai.com/v1" class="form-input">
              <p class="text-xs text-[var(--color-text-muted)] mt-1">留空将使用默认服务商端点</p>
            </div>

            <div>
              <label class="text-sm font-medium text-[var(--color-text-primary)] mb-2 block">默认模型</label>
              <input type="text" v-model="form.model" placeholder="例如：gpt-4-turbo, claude-3-opus-20240229" class="form-input" required>
              <p class="text-xs text-[var(--color-text-muted)] mt-1">输入具体的模型名称</p>
            </div>
          </form>
        </div>

        <div class="flex items-center justify-end gap-3 mt-auto p-6 border-t border-[var(--color-border-primary)] flex-shrink-0">
          <button @click="closeModal" class="btn-secondary">取消</button>
          <button @click="save" :disabled="isSaving" class="btn-primary">
            <span v-if="isSaving">保存中...</span>
            <span v-else>{{ saveButtonText }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, computed, watchEffect, PropType } from 'vue';
import { storeToRefs } from 'pinia';
import { useApiManagementStore } from '@/settings/stores/apiManagementStore';
import type { ModalProvider, ApiKey } from '@/types/apiManagement';

const props = defineProps({
  keyToEdit: {
    type: Object as PropType<ApiKey | null>,
    default: null
  }
});

const emit = defineEmits<{ (e: 'close'): void }>();

const store = useApiManagementStore();
const { modalProviders, isSaving } = storeToRefs(store);

const isEditMode = computed(() => !!props.keyToEdit);

const form = reactive({
  provider: null as ModalProvider | null,
  name: '',
  key: '',
  baseUrl: '',
  model: ''
});

watchEffect(() => {
  if (isEditMode.value && props.keyToEdit) {
    form.provider = modalProviders.value.find(p => p.name === props.keyToEdit!.provider) || null;
    form.name = props.keyToEdit.name;
    form.baseUrl = props.keyToEdit.baseUrl || '';
    form.model = props.keyToEdit.model;
    form.key = ''; // Clear key field for editing
  } else {
    // Reset form for add mode
    form.provider = null;
    form.name = '';
    form.key = '';
    form.baseUrl = '';
    form.model = '';
  }
});

const modalTitle = computed(() => isEditMode.value ? '编辑 API 配置' : '新增 API 配置');
const saveButtonText = computed(() => isEditMode.value ? '保存更改' : '保存配置');
const keyInputPlaceholder = computed(() => isEditMode.value ? '若要更改, 请输入新密钥' : 'sk-...');

const closeModal = () => {
  if (isSaving.value) return;
  emit('close');
};

const save = async () => {
  if (!form.provider || !form.name || !form.model) {
    alert('请填写除密钥外的所有必填项');
    return;
  }
  if (!isEditMode.value && !form.key) {
    alert('新增配置时必须填写API密钥');
    return;
  }

  if (isEditMode.value) {
    const payload: Partial<ApiKey> & { id: number, key?: string } = {
      id: props.keyToEdit!.id,
      name: form.name,
      model: form.model,
      baseUrl: form.baseUrl,
    };
    if (form.key) {
      payload.key = form.key;
    }
    await store.updateKey(payload);
  } else {
    const newKeyData = {
      provider: form.provider!.name,
      name: form.name,
      apiKey: form.key, // Corrected field name from 'key' to 'apiKey'
      baseUrl: form.baseUrl,
      model: form.model,
      status: '启用' as const
    };
    await store.addKey(newKeyData);
  }

  if (!store.isSaving) {
    closeModal();
  }
};
</script>

<style scoped>
.provider-option { border: 1px solid var(--color-border-primary); border-radius: 8px; padding: 16px; cursor: pointer; transition: all 0.3s; text-align: center; background: var(--color-bg-primary); }
.provider-option:not(.disabled):hover { border-color: var(--color-border-focus); background: var(--color-bg-tertiary); }
.provider-option.disabled { cursor: not-allowed; background: var(--color-bg-secondary); opacity: 0.7; }
.provider-option-selected { border-color: var(--color-text-accent); background: var(--color-bg-tertiary); border-width: 2px; padding: 15px;}

.form-input { width: 100%; padding: 12px 16px; border: 1px solid var(--color-border-primary); border-radius: 8px; font-size: 14px; background: var(--color-bg-primary); color: var(--color-text-primary); transition: all 0.2s; }
.form-input::placeholder { color: var(--color-text-muted); }
.form-input:focus { outline: none; border-color: var(--color-border-focus); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-border-focus) 20%, transparent); }

.btn-primary { padding: 12px 20px; background: var(--color-bg-accent); color: var(--color-text-on-accent); border-radius: 8px; font-size: 14px; font-weight: 500; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover:not(:disabled) { background: var(--color-bg-accent-hover); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-secondary { padding: 12px 20px; border: 1px solid var(--color-border-primary); color: var(--color-text-secondary); border-radius: 8px; font-size: 14px; font-weight: 500; background: var(--color-bg-primary); cursor: pointer; transition: all 0.2s; }
.btn-secondary:hover { background: var(--color-bg-tertiary); border-color: var(--color-border-primary); }
</style>