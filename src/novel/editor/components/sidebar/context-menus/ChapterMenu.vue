// 文件: src/novel/editor/components/sidebar/context-menus/ChapterMenu.vue
<template>
  <div>
    <p class="menu-title">文件操作</p>
    <div @click="emit('action', 'rename', { nodeId: node.id })" class="context-menu-item">
      <i class="fa-solid fa-pencil w-4 text-center"></i>
      <span>重命名</span>
    </div>
    <div class="context-menu-divider"></div>
    <p class="menu-title">AI 助手</p>
    <div @click="emit('ai-action', '分析', node)" class="context-menu-item">
      <i class="fa-solid fa-magnifying-glass-chart w-4 text-center text-[#F59E0B]"></i>
      <span>分析内容</span>
    </div>
    <div @click="emit('ai-action', '剧情生成', node)" class="context-menu-item">
      <i class="fa-solid fa-feather w-4 text-center text-[#EC4899]"></i>
      <span>生成剧情</span>
    </div>
    <div @click="emit('ai-action', '续写', node)" class="context-menu-item">
      <i class="fa-solid fa-wand-magic-sparkles w-4 text-center text-[#4B5563]"></i>
      <span>续写内容</span>
    </div>
    <div @click="emit('ai-action', '润色', node)" class="context-menu-item">
      <i class="fa-solid fa-palette w-4 text-center text-[#3B82F6]"></i>
      <span>润色内容</span>
    </div>
    <div class="context-menu-divider"></div>
    <div @click="emit('action', 'delete', { nodeId: node.id })" class="context-menu-item danger">
      <i class="fa-solid fa-trash-can w-4 text-center"></i>
      <span>删除章节</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { AITask, TreeNode } from '@/novel/editor/types';

defineProps({
  node: {
    type: Object as PropType<TreeNode>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'action', actionName: string, payload?: any): void;
  (e: 'ai-action', taskType: AITask['type'], sourceNode: TreeNode, isBatch?: boolean): void;
}>();
</script>

<style scoped>
.context-menu-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; color: #374151; cursor: pointer; user-select: none; transition: background-color 0.15s, color 0.15s; }
.context-menu-item:hover { background-color: #f3f4f6; }
.context-menu-item.danger:hover { background-color: #fee2e2; color: #b91c1c; }
.context-menu-divider { height: 1px; background-color: #f3f4f6; margin: 0.5rem 0; }
.menu-title { padding: 0.25rem 0.75rem; font-size: 0.75rem; color: #9CA3AF; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }
</style>