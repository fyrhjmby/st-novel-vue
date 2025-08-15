<template>
  <div class="w-56 bg-white rounded-lg shadow-md border" :class="nodeClasses">
    <div class="p-3 flex items-start gap-3">
      <div class="p-1 rounded-md mt-0.5 flex-shrink-0" :class="iconBgClass" v-html="iconSvg"></div>
      <div>
        <p class="font-medium text-sm text-[#374151]">{{ data.title }}</p>
        <p v-if="data.description" class="mt-1 text-xs text-gray-500">
          {{ data.description }}
        </p>
      </div>
    </div>

    <Handle type="target" position="left" class="custom-handle" />
    <Handle type="source" position="right" class="custom-handle" />
  </div>
</template>

<script setup lang="ts">
import { Handle } from '@vue-flow/core';
import { computed } from 'vue';
import { iconRegistry, colorMap } from '@/workflow/utils/style-mappers';

interface NodeProps {
  id: string;
  selected?: boolean;
  data: {
    title: string;
    description?: string;
    status?: 'completed' | 'running' | 'waiting';
    iconName: string;
    iconColor: string;
    config?: any;
  };
}

const props = defineProps<NodeProps>();

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
  return iconHtml.replace(/class="([^"]*)"/, `class="w-4 h-4 $1 ${iconColorClass}"`);
});
</script>