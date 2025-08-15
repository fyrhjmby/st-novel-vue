<template>
  <aside class="w-96 bg-white border-l border-gray-100 flex flex-col">
    <template v-if="selectedNode">
      <div class="p-4 border-b border-gray-100 flex-shrink-0">
        <h3 class="font-medium text-[#374151]">配置 "{{ selectedNode.data.title }}"</h3>
        <p class="text-sm text-[#9CA3AF] mt-1">自定义节点的行为和参数</p>
      </div>
      <div class="flex-1 p-4 space-y-4 overflow-y-auto">
        <div class="border-b border-gray-200 pb-4">
          <label for="node-description" class="text-sm font-medium text-gray-700">节点描述</label>
          <textarea id="node-description" rows="3" v-model="nodeDescription" class="mt-2 block w-full text-sm border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 p-2"></textarea>
        </div>
        <div v-if="isLLMNode" class="space-y-4">
          <p>大语言模型配置项...</p>
        </div>
        <div v-else class="text-center text-sm text-gray-400 py-6">
          <p>此节点类型没有更多可配置项。</p>
        </div>
      </div>
      <div class="p-4 border-t border-gray-100 flex-shrink-0">
        <button class="w-full text-center text-sm text-blue-600 hover:text-blue-700">管理变量</button>
      </div>
    </template>
    <div v-else class="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M19.5 8.25h1.5M19.5 12h1.5m-3.75 3.75h1.5M15.75 21v-1.5M12 5.25v-1.5m0 15v1.5"></path></svg>
      </div>
      <h3 class="font-medium text-gray-700">未选择节点</h3>
      <p class="text-sm text-gray-500 mt-1">请在画布中选择一个节点以查看其配置。</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEditorStore } from '@/workflow/editor/store/editorStore';

const store = useEditorStore();
const selectedNode = computed(() => store.selectedNode);
const isLLMNode = computed(() => selectedNode.value?.data.title === '大语言模型');

const nodeDescription = computed({
  get: () => selectedNode.value?.data.description || '',
  set: (value) => {
    if (selectedNode.value) {
      store.updateNodeData(selectedNode.value.id, { description: value });
    }
  },
});
</script>