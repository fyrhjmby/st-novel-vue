<!-- src/settings/views/ApiManagement.vue -->
<template>
  <main class="flex-1 bg-[var(--color-bg-primary)] flex flex-col transition-colors">
    <header class="h-20 px-8 flex items-center justify-between border-b border-[var(--color-border-primary)] flex-shrink-0">
      <h1 class="text-lg font-medium text-[var(--color-text-primary)]">API管理</h1>
    </header>

    <div v-if="store.isLoading" class="flex-1 flex items-center justify-center bg-[var(--color-bg-app)]">
      <p class="text-[var(--color-text-muted)]">加载中...</p>
    </div>

    <div v-else class="flex-1 px-8 py-6 overflow-auto bg-[var(--color-bg-app)] space-y-6">
      <div class="bg-[var(--color-bg-primary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
        <h3 class="text-base font-medium text-[var(--color-text-primary)] mb-6">支持的API服务商</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div v-for="provider in apiProviders" :key="provider.name" class="api-card">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-[var(--color-bg-muted)] rounded-lg flex items-center justify-center text-[var(--color-text-secondary)] font-medium text-sm">
                  {{ provider.shortName }}
                </div>
                <div>
                  <h4 class="font-medium text-[var(--color-text-primary)] text-sm">{{ provider.name }}</h4>
                  <p class="text-xs text-[var(--color-text-muted)]">{{ provider.description }}</p>
                </div>
              </div>
              <span class="status-badge" :class="getProviderStatusClass(provider)">{{ provider.statusText }}</span>
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-[var(--color-text-muted)]">活跃密钥</span>
                <span class="font-medium text-[var(--color-text-primary)]">{{ provider.activeKeys }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-[var(--color-text-muted)]">总调用次数</span>
                <span class="font-medium text-[var(--color-text-primary)]">{{ provider.totalCalls }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-[var(--color-bg-primary)] rounded-xl p-6 border border-[var(--color-border-primary)]">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-base font-medium text-[var(--color-text-primary)]">密钥详情</h3>
          <button @click="openAddModal" class="cursor-pointer text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1 rounded-full hover:bg-[var(--color-bg-tertiary)]">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-[var(--color-bg-secondary)]">
            <tr class="border-b border-[var(--color-border-primary)] text-xs text-[var(--color-text-muted)]">
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
            <tr v-for="key in apiKeys" :key="key.id" class="border-b border-[var(--color-border-primary)] hover:bg-[var(--color-bg-secondary)]">
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-[var(--color-bg-muted)] rounded text-[var(--color-text-secondary)] text-xs flex items-center justify-center font-medium">{{ key.providerShort }}</div>
                  <span class="text-[var(--color-text-primary)]">{{ key.provider }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-[var(--color-text-primary)]">{{ key.name }}</td>
              <td class="py-3 px-4 text-[var(--color-text-muted)] font-mono">{{ key.keyFragment }}</td>
              <td class="py-3 px-4 text-[var(--color-text-muted)]">{{ key.model }}</td>
              <td class="py-3 px-4 text-[var(--color-text-muted)]">{{ key.calls }}</td>
              <td class="py-3 px-4"><span class="status-badge" :class="key.status === '启用' ? 'status-active' : 'status-inactive'">{{ key.status }}</span></td>
              <td class="py-3 px-4 text-[var(--color-text-muted)]">{{ key.created }}</td>
              <td class="py-3 px-4 flex items-center justify-end gap-3">
                <button @click="openEditModal(key)" :disabled="store.isSaving" class="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:underline disabled:opacity-50">编辑</button>
                <button @click="handleDelete(key)" :disabled="store.isSaving" class="text-sm text-[var(--color-text-muted)] hover:text-red-500 hover:underline disabled:opacity-50">删除</button>
              </td>
            </tr>
            <tr v-if="apiKeys.length === 0">
              <td colspan="8" class="text-center py-8 text-[var(--color-text-muted)]">暂无 API 密钥，请点击右上角添加。</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>

  <ApiConfigModal v-if="isModalOpen" :key-to-edit="keyToEdit" @close="closeModal" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useApiManagementStore } from '@/settings/stores/apiManagementStore';
import ApiConfigModal from '@/settings/components/ApiConfigModal.vue';
import type { ApiKey, ApiProvider } from '@/types/apiManagement';

const store = useApiManagementStore();
const { apiProviders, apiKeys } = storeToRefs(store);

const isModalOpen = ref(false);
const keyToEdit = ref<ApiKey | null>(null);

onMounted(() => {
  store.initializeData();
});

const getProviderStatusClass = (provider: ApiProvider) => {
  if (provider.activeKeys > 0) {
    return 'status-active';
  }
  return 'status-unconfigured';
};

const openAddModal = () => {
  keyToEdit.value = null;
  isModalOpen.value = true;
};

const openEditModal = (key: ApiKey) => {
  keyToEdit.value = key;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  keyToEdit.value = null;
};

const handleDelete = async (key: ApiKey) => {
  if (confirm(`确定要删除密钥 "${key.name}" 吗？此操作不可撤销。`)) {
    await store.deleteKey(key.id);
  }
};
</script>

<style scoped>
.api-card { background: var(--color-bg-primary); border: 1px solid var(--color-border-primary); border-radius: 12px; padding: 20px; transition: all 0.3s; cursor: default; }
.api-card:hover { border-color: var(--color-border-focus); box-shadow: var(--shadow-md); }
.status-badge { padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 500; }
.status-active { background: #10b9811a; color: #10b981; }
.status-inactive { background: #f59e0b1a; color: #f59e0b; }
.status-unconfigured { background: var(--color-bg-muted); color: var(--color-text-muted); }

html.dark .status-active { background: #34d39926; color: #a7f3d0; }
html.dark .status-inactive { background: #facc1526; color: #fde047; }
html.eyecare-green .status-active { background: #15803d26; color: #14532d; }
html.eyecare-green .status-inactive { background: #c0562126; color: #8d5b30; }

</style>