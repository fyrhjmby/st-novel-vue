<template>
  <div class="w-64 bg-white rounded-xl shadow-md border" :class="nodeClasses">
    <div class="p-3 border-b border-gray-100 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="p-1 rounded-md" :class="iconBgClass" v-html="iconSvg"></div>
        <p class="font-medium text-sm text-[#374151]">{{ data.title }}</p>
      </div>
      <div v-if="data.status" class="flex items-center gap-2">
        <span v-if="data.status === 'completed'" class="w-5 h-5 text-green-500">
          <svg fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
        </span>
        <span v-else-if="data.status === 'running'" class="w-4 h-4 text-blue-500">
          <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </span>
      </div>
    </div>
    <div v-if="data.description" class="p-4 text-xs text-gray-500">
      {{ data.description }}
    </div>

    <Handle type="target" :position="Position.Left" class="custom-handle" />
    <Handle type="source" :position="Position.Right" class="custom-handle" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position, useVueFlow } from '@vue-flow/core';
import { computed } from 'vue';
import type { NodeProps } from '@vue-flow/core';
import { iconRegistry, colorMap } from '@/workflow/utils/style-mappers';

const props = defineProps<NodeProps>();

const { findNode } = useVueFlow();
const node = findNode(props.id);

const nodeClasses = computed(() => ({
  'border-blue-500 border-2': props.selected,
  'border-gray-200': !props.selected,
  'running-node': props.data.status === 'running',
  'opacity-60': props.data.status === 'waiting',
}));

const iconBgClass = computed(() => {
  return colorMap[props.data.iconColor]?.bg || 'bg-gray-100';
});

const iconSvg = computed(() => {
  const name = props.data.iconName;
  const color = props.data.iconColor;
  const iconHtml = iconRegistry[name] || '';
  const iconColorClass = colorMap[color]?.text || 'text-gray-600';
  // Use a regex to be more robust against different class attributes
  return iconHtml.replace(/class="([^"]*)"/, `class="$1 ${iconColorClass}"`);
});

</script>