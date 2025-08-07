<template>
  <div>
    <p class="menu-title">管理</p>
    <div @click="emit('custom-others-action', 'newItem')" class="context-menu-item">
      <i class="fa-solid fa-plus w-4 text-center"></i>
      <span>新建其他条目</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { TreeNode } from '@/novel/editor/types';

defineProps({
  node: {
    type: Object as PropType<TreeNode>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'custom-others-action', actionName: string, payload?: any): void;
}>();
</script>

<style scoped>
.context-menu-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; color: #374151; cursor: pointer; user-select: none; transition: background-color 0.15s, color 0.15s; }
.context-menu-item:hover { background-color: #f3f4f6; }
.menu-title { padding: 0.25rem 0.75rem; font-size: 0.75rem; color: #9CA3AF; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
</style>