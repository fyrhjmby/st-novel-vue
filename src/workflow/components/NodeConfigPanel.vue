<template>
  <aside class="w-96 bg-white border-l border-gray-100 flex flex-col">
    <template v-if="selectedNode">
      <div class="p-6 border-b border-gray-100">
        <h3 class="font-medium text-[#374151]">配置 "{{ selectedNode.data.title }}"</h3>
        <p class="text-sm text-[#9CA3AF] mt-1">自定义节点的行为和参数</p>
      </div>
      <div class="flex-1 p-6 space-y-6 overflow-y-auto">
        <div>
          <label for="node-description" class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">节点描述</label>
          <textarea id="node-description" rows="3" v-model="nodeDescription" class="mt-1 block w-full text-sm border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 p-2"></textarea>
        </div>

        <!-- LLM Node Specific Config -->
        <div v-if="isLLMNode" class="space-y-6">
          <div class="border-t border-gray-200 pt-5">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">模型</p>
            <select v-model="nodeModel" class="block w-full pl-3 pr-10 py-2.5 text-sm border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 rounded-lg">
              <option>GPT-4-Turbo (推荐)</option>
              <option>Claude 3 Sonnet</option>
              <option>Gemini Pro</option>
            </select>
          </div>

          <div class="border-t border-gray-200 pt-5">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">参数设置</p>
            <div class="space-y-4">
              <div>
                <label class="text-sm text-gray-600">Temperature</label>
                <div class="flex items-center gap-3 mt-1">
                  <input type="range" min="0" max="2" step="0.1" v-model.number="nodeTemperature" class="flex-1">
                  <span class="text-sm font-medium text-gray-700 w-8">{{ nodeTemperature }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-5">
            <div class="flex items-center justify-between mb-3"><p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">提示词 (Prompt)</p><button class="text-xs text-blue-600 hover:text-blue-700">从模板库选择</button></div>
            <textarea rows="8" v-model="nodePrompt" class="block w-full text-sm border-gray-200 bg-white rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 font-mono p-3 leading-relaxed" placeholder="使用 {{变量}} 来引用输入"></textarea>
          </div>
        </div>

        <div v-else class="border-t border-gray-200 pt-5 text-center text-sm text-gray-400">
          <p>此节点类型没有更多可配置项。</p>
        </div>

      </div>
    </template>
    <div v-else class="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5M19.5 8.25h1.5M19.5 12h1.5m-3.75 3.75h1.5M15.75 21v-1.5M12 5.25v-1.5m0 15v1.5"></path></svg>
      </div>
      <h3 class="font-medium text-gray-700">未选择节点</h3>
      <p class="text-sm text-gray-500 mt-1">请在左侧画布中选择一个节点以查看其配置。</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWorkflowEditorStore } from '@/workflow/stores/workflowEditorStore';

const store = useWorkflowEditorStore();
const selectedNode = computed(() => store.selectedNode);
const isLLMNode = computed(() => selectedNode.value?.data.title === '大语言模型');

const updateNodeConfig = (config: object) => {
  if (selectedNode.value) {
    const newConfig = { ...selectedNode.value.data.config, ...config };
    store.updateNodeData(selectedNode.value.id, { config: newConfig });
  }
};

const nodeDescription = computed({
  get: () => selectedNode.value?.data.description || '',
  set: (value) => {
    if (selectedNode.value) {
      store.updateNodeData(selectedNode.value.id, { description: value });
    }
  },
});

const nodeModel = computed({
  get: () => selectedNode.value?.data.config?.model || 'GPT-4-Turbo (推荐)',
  set: (value) => updateNodeConfig({ model: value }),
});

const nodeTemperature = computed({
  get: () => selectedNode.value?.data.config?.temperature || 0.7,
  set: (value) => updateNodeConfig({ temperature: value }),
});

const nodePrompt = computed({
  get: () => selectedNode.value?.data.config?.prompt || '',
  set: (value) => updateNodeConfig({ prompt: value }),
});
</script>