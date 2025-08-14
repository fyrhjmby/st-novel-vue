<template>
  <div class="flex flex-col h-full w-full bg-white">
    <!-- 监控页面专属工具栏 -->
    <div class="px-8 py-3 flex items-center justify-between border-b border-gray-100 bg-white flex-shrink-0">
      <div v-if="!store.isLoading">
        <h1 class="text-base font-medium text-[#374151]">实时监控: <span class="font-mono">{{ store.runInfo.id }}</span></h1>
        <p class="text-sm text-[#9CA3AF] mt-1">工作流: {{ store.runInfo.workflowName }}</p>
      </div>
      <div v-else>
        <div class="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2"></div>
      </div>
      <div class="flex items-center gap-4">
        <span class="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full font-medium">
          <svg class="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          {{ store.runInfo.status }}
        </span>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">进度</span>
          <div class="w-32 bg-gray-200 rounded-full h-2">
            <div class="bg-blue-600 h-2 rounded-full" :style="{width: store.runInfo.progress + '%'}"></div>
          </div>
          <span class="text-sm font-medium text-gray-700">{{ store.runInfo.progress }}%</span>
        </div>
        <button class="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          停止
        </button>
      </div>
    </div>

    <div class="flex-1 flex overflow-hidden">
      <div class="flex-1 workflow-canvas-bg relative p-8">
        <div class="absolute top-4 right-4 bg-white rounded-lg shadow-md border border-gray-200 p-4 w-64">
          <h4 class="text-sm font-medium text-gray-700 mb-3">实时性能</h4>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between"><span class="text-gray-500">CPU使用率</span><span class="font-medium text-gray-700">{{ store.performance.cpu }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">内存占用</span><span class="font-medium text-gray-700">{{ store.performance.memory }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">已用Token</span><span class="font-medium text-gray-700">{{ store.performance.tokens }}</span></div>
            <div class="flex justify-between"><span class="text-gray-500">已用时间</span><span class="font-medium text-gray-700">{{ store.performance.time }}</span></div>
          </div>
        </div>

        <div v-for="node in store.nodes" :key="node.id" class="absolute" :style="{top: node.top + 'px', left: node.left + 'px'}">
          <div class="w-64 bg-white rounded-xl shadow-md border-2" :class="getNodeRenderInfo(node).borderClass">
            <div class="p-3 border-b border-gray-100 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="p-1 rounded-md" :class="getNodeRenderInfo(node).iconBgClass" v-html="getNodeRenderInfo(node).icon"></div>
                <p class="font-medium text-sm text-[#374151]">{{ node.title }}</p>
              </div>
              <span v-if="getNodeRenderInfo(node).statusIcon" v-html="getNodeRenderInfo(node).statusIcon"></span>
            </div>
            <div class="p-3 text-xs text-gray-500">
              <span v-if="typeof node.details === 'string'" class="font-semibold" :class="getNodeRenderInfo(node).detailsTextColorClass">{{ node.details }}</span>
              <div v-else class="mt-2 space-y-1">
                <div class="flex justify-between"><span>{{ node.details.label }}</span><span>{{ node.details.value }}</span></div>
                <div class="w-full bg-gray-200 rounded-full h-1"><div class="bg-blue-600 h-1 rounded-full" :style="{width: node.details.progress + '%'}"></div></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <aside class="w-96 bg-[#F9FAFB] border-l border-gray-200 flex flex-col">
        <div class="p-5 border-b border-gray-200 flex items-center justify-between">
          <h3 class="font-medium text-[#374151]">运行日志</h3>
          <div class="flex items-center gap-2">
            <button class="p-1 hover:bg-gray-200 rounded text-gray-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg></button>
            <button class="p-1 hover:bg-gray-200 rounded text-gray-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></button>
          </div>
        </div>
        <div class="flex-1 p-5 space-y-4 overflow-y-auto font-mono text-xs leading-relaxed">
          <div v-for="(log, index) in store.logs" :key="index" class="flex gap-3" :class="{'bg-blue-50 -mx-5 px-5 py-2': log.type === 'debug'}">
            <span class="text-gray-400 flex-shrink-0">{{ log.time }}</span>
            <span :class="{'text-green-500': log.type === 'success', 'text-blue-500': log.type === 'info' || log.type === 'debug', 'text-red-500': log.type === 'error'}">[{{ log.type.toUpperCase() }}]</span>
            <div class="text-gray-600">
              <p>{{ log.message }}</p>
              <pre v-if="log.isBlock" class="mt-1 text-xs bg-white rounded p-2 border border-blue-200">{{ log.blockContent }}</pre>
            </div>
          </div>
        </div>
        <div class="p-5 border-t border-gray-200">
          <h4 class="text-sm font-medium text-gray-700 mb-3">实时输出预览</h4>
          <div class="bg-white rounded-lg border border-gray-200 p-3 text-sm">
            <p class="text-gray-600 leading-relaxed">{{ store.outputPreview.content }}</p>
            <div class="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>字数: {{ store.outputPreview.words }} / {{ store.outputPreview.limit }}</span>
              <span class="animate-pulse">{{ store.outputPreview.status }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useMonitorStore } from '@/workflow/stores/monitorStore';
import type { MonitorNode } from '@/workflow/types';
import { NodeStatusEnum } from '@/workflow/types';

const store = useMonitorStore();

onMounted(async () => {
  store.reset();
  await store.loadInitialData();
  store.startLogUpdates();
});

onUnmounted(() => {
  store.stopLogUpdates();
});

const iconRegistry = {
  'play-circle': `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"/></svg>`,
  'cpu': `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`,
  'flag': `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>`,
};

const colorMap = {
  green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-500', detailsText: 'text-green-700' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500', detailsText: 'text-blue-700' },
  red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-500', detailsText: 'text-red-700' },
};

const statusIcons = {
  [NodeStatusEnum.Completed]: '<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
  [NodeStatusEnum.Running]: '<svg class="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>',
}

const getNodeRenderInfo = (node: MonitorNode) => {
  const { status, iconName, iconColor } = node;
  const colorScheme = colorMap[iconColor] || { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', detailsText: 'text-gray-400' };

  let borderClass = colorScheme.border;
  if (status === NodeStatusEnum.Running) borderClass += ' running-node';
  if (status === NodeStatusEnum.Waiting) borderClass += ' opacity-60';

  const iconHtml = iconRegistry[iconName] || '';
  const icon = iconHtml.replace(/class="[^"]*"/, `class="w-5 h-5 ${colorScheme.text}"`);

  return {
    borderClass,
    iconBgClass: colorScheme.bg,
    icon,
    statusIcon: statusIcons[status] || null,
    detailsTextColorClass: colorScheme.detailsText
  };
};

</script>