<template>
  <div class="flex flex-col h-full w-full bg-white" @keydown.backspace="handleDelete" @keydown.delete="handleDelete" tabindex="0">
    <div class="px-8 py-3 flex items-center justify-between border-b border-gray-100 bg-white flex-shrink-0">
      <div>
        <p class="text-sm text-[#9CA3AF]">我的工作流 / 编辑中</p>
        <h1 class="text-base font-medium text-[#374151] mt-1">社交媒体帖子生成器</h1>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-400 mr-2" v-if="editorStore.isSaving">保存中...</span>
        <span class="text-xs text-green-500 mr-2" v-else-if="!editorStore.isSaving && !editorStore.isLoading">所有更改已保存</span>

        <button class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="撤销"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg></button>
        <button class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="重做"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"/></svg></button>

        <div class="w-px h-5 bg-gray-200 mx-2"></div>

        <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>
          测试
        </button>
        <button @click="editorStore.saveWorkflow" :disabled="editorStore.isSaving" class="px-4 py-2 bg-[#374151] text-white rounded-lg text-sm font-medium hover:bg-[#1F2937] transition-colors flex items-center gap-2 min-w-[90px] justify-center">
          <svg v-if="editorStore.isSaving" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
          <span>{{ editorStore.isSaving ? '保存中' : '保 存' }}</span>
        </button>
      </div>
    </div>

    <div class="flex-1 flex overflow-hidden">
      <aside class="w-72 bg-white border-r border-gray-100 flex flex-col p-4">
        <div class="relative mb-4">
          <input type="text" placeholder="搜索组件..." class="w-full pl-9 pr-4 py-2 text-sm bg-[#F3F4F6] border-transparent rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none">
          <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21L16.65 16.65"/></svg>
        </div>
        <div class="flex bg-gray-100 rounded-lg p-1 mb-4 text-sm">
          <button class="flex-1 py-1 px-2 bg-white rounded-md text-gray-700 font-medium">全部</button>
          <button class="flex-1 py-1 px-2 text-gray-500">常用</button>
          <button class="flex-1 py-1 px-2 text-gray-500">最近</button>
        </div>
        <div class="flex-1 overflow-y-auto space-y-6 -mr-2 pr-2">
          <div v-for="category in nodeCategories" :key="category.title">
            <div class="flex items-center justify-between px-2 mb-2">
              <p class="text-xs font-semibold text-gray-400 uppercase">{{ category.title }}</p>
              <span v-if="category.isNew" class="tag-new">HOT</span>
            </div>
            <div class="space-y-1">
              <div v-for="node in category.nodes" :key="node.name" class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-grab draggable-node" :draggable="true" @dragstart="onDragStart($event, node)">
                <div class="w-8 h-8 flex-shrink-0 rounded-md flex items-center justify-center" :class="getNodeIconBgClass(node.iconColor)">
                  <span v-html="getNodeIconSvg(node.iconName, node.iconColor)"></span>
                </div>
                <div class="flex-1">
                  <span class="text-sm font-medium text-gray-700">{{ node.name }}</span>
                  <p class="text-xs text-gray-400">{{ node.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Canvas -->
      <main class="flex-1 relative" @drop="editorStore.onDrop" @dragover="editorStore.onDragOver">
        <VueFlow
            v-model="editorStore.elements"
            :default-viewport="{ zoom: 1 }"
            :min-zoom="0.2"
            :max-zoom="4"
            @nodes-change="editorStore.onNodesChange"
            @edges-change="editorStore.onEdgesChange"
            @connect="editorStore.onConnect"
            @pane-ready="editorStore.setInstance"
            @node-click="editorStore.onNodeClick"
            @pane-click="editorStore.clearSelection"
        >
          <template #node-custom="props">
            <CustomNode v-bind="props" />
          </template>
          <Background pattern-color="#E5E7EB" gap="24" class="workflow-canvas-bg" />
          <MiniMap />
          <Controls />
        </VueFlow>
      </main>

      <NodeConfigPanel />

    </div>

    <div class="h-12 border-t border-gray-100 px-8 flex items-center gap-6 bg-gray-50 flex-shrink-0">
      <span class="text-xs font-medium text-gray-500">全局变量：</span>
      <div class="flex items-center gap-4"><span class="text-xs px-2 py-1 bg-white border border-gray-200 rounded">{<!-- -->{user_id}}</span><span class="text-xs px-2 py-1 bg-white border border-gray-200 rounded">{<!-- -->{timestamp}}</span><span class="text-xs px-2 py-1 bg-white border border-gray-200 rounded">{<!-- -->{api_key}}</span></div>
      <button class="ml-auto text-xs text-blue-600 hover:text-blue-700">管理变量</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VueFlow, MiniMap, Controls, Background } from '@vue-flow/core';
import { useWorkflowEditorStore } from '@/workflow/stores/workflowEditorStore';
import CustomNode from '@/workflow/components/CustomNode.vue';
import NodeConfigPanel from '@/workflow/components/NodeConfigPanel.vue';
import { iconRegistry, colorMap } from '@/workflow/utils/style-mappers';

const editorStore = useWorkflowEditorStore();

const onDragStart = (event: DragEvent, node: any) => {
  if (event.dataTransfer) {
    const nodeInfo = { ...node, type: 'custom' };
    event.dataTransfer.setData('application/vueflow', JSON.stringify(nodeInfo));
    event.dataTransfer.effectAllowed = 'move';
  }
};

const handleDelete = (event: KeyboardEvent) => {
  if ((event.target as HTMLElement).nodeName === 'INPUT' || (event.target as HTMLElement).nodeName === 'TEXTAREA') {
    return;
  }
  editorStore.removeSelectedNodes();
};

const getNodeIconBgClass = (color: string) => {
  return colorMap[color]?.bg || 'bg-gray-100';
}

const getNodeIconSvg = (name: string, color: string) => {
  const iconHtml = iconRegistry[name] || '';
  const iconColorClass = colorMap[color]?.text || 'text-gray-600';
  // Use a regex to be more robust against different class attributes
  return iconHtml.replace(/class="([^"]*)"/, `class="$1 ${iconColorClass}"`);
};


const nodeCategories = ref([
  { title: '核心', nodes: [
      { name: '开始', description: '工作流入口', iconName: 'play-circle', iconColor: 'green' },
      { name: '结束', description: '输出结果', iconName: 'flag', iconColor: 'red' },
    ],
  },
  { title: '大语言模型', isNew: true, nodes: [
      { name: '大语言模型', description: '调用LLM生成文本', iconName: 'cpu', iconColor: 'blue' },
      { name: '知识库检索', description: 'RAG增强', iconName: 'book-open', iconColor: 'indigo' },
    ],
  },
  // other categories...
]);
</script>