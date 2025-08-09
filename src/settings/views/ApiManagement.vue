<!-- src/settings/views/ApiManagement.vue -->
<template>
  <main class="flex-1 bg-white flex flex-col">
    <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100 bg-white flex-shrink-0">
      <h1 class="text-lg font-medium text-[#374151]">API管理</h1>
    </header>

    <div v-if="store.isLoading" class="flex-1 flex items-center justify-center bg-[#FCFCFC]">
      <p>加载中...</p>
    </div>

    <div v-else class="flex-1 px-8 py-6 overflow-auto bg-[#FCFCFC] space-y-6">
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

      <div class="bg-white rounded-xl p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-base font-medium text-[#374151]">密钥详情</h3>
          <button @click="openAddModal" class="cursor-pointer text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100">
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
                <button @click="openEditModal(key)" :disabled="store.isSaving" class="text-sm text-[#6B7280] hover:text-[#374151] hover:underline disabled:opacity-50">编辑</button>
                <button @click="handleDelete(key)" :disabled="store.isSaving" class="text-sm text-[#9CA3AF] hover:text-red-600 hover:underline disabled:opacity-50">删除</button>
              </td>
            </tr>
            <tr v-if="apiKeys.length === 0">
              <td colspan="8" class="text-center py-8 text-gray-400">暂无 API 密钥，请点击右上角添加。</td>
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
import type { ApiKey } from '@/settings/api/apiManagementApi';

const store = useApiManagementStore();
const { apiProviders, apiKeys } = storeToRefs(store);

const isModalOpen = ref(false);
const keyToEdit = ref<ApiKey | null>(null);

onMounted(() => {
  store.initializeData();
});

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
.api-card { background: white; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px; transition: all 0.3s; cursor: default; }
.api-card:hover { border-color: #D1D5DB; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); }
.status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; }
.status-active { background: #F0FDF4; color: #15803D; }
.status-inactive { background: #FFFBEB; color: #A16207; }
.status-unconfigured { background: #F9FAFB; color: #6B7280; }
</style>