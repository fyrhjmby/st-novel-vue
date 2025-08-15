<template>
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
            <div>
              <span class="text-sm font-medium text-gray-700">{{ node.name }}</span>
              <p class="text-xs text-gray-400">{{ node.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { iconRegistry, colorMap } from '@/workflow/utils/style-mappers';

const onDragStart = (event: DragEvent, node: any) => {
  if (event.dataTransfer) {
    const nodeInfo = { ...node, type: 'custom' };
    event.dataTransfer.setData('application/vueflow', JSON.stringify(nodeInfo));
    event.dataTransfer.effectAllowed = 'move';
  }
};

const getNodeIconBgClass = (color: string) => colorMap[color]?.bg || 'bg-gray-100';
const getNodeIconSvg = (name: string, color: string) => {
  const iconHtml = iconRegistry[name] || '';
  const iconColorClass = colorMap[color]?.text || 'text-gray-600';
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
]);
</script>