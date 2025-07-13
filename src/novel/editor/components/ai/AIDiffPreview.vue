<template>
  <div class="diff-preview-container">
    <div class="header">
      <h3 class="title">AI生成预览</h3>
      <div class="actions">
        <button v-if="previewTask && previewTask.status === 'completed'" @click="$emit('apply-changes', previewTask.id)" class="apply-btn">
          <i class="fa-solid fa-check"></i>
          应用修改
        </button>
      </div>
    </div>
    <div class="content-area">
      <div v-if="previewTask">
        <div class="prose-preview">
          <div v-html="previewTask.generatedContent.replace(/\n/g, '<br>')"></div>
          <span v-if="previewTask.status === 'processing'" class="blinking-cursor">▍</span>
        </div>
      </div>
      <div v-else class="empty-state">
        <i class="fa-regular fa-eye text-3xl text-gray-300"></i>
        <p class="mt-2">请从上方任务队列中</p>
        <p>选择一个任务来查看预览。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { AITask } from '../../types';

defineProps({
  previewTask: { type: Object as PropType<AITask | null>, default: null }
});
defineEmits<{ (e: 'apply-changes', taskId: string): void; }>();
</script>

<style scoped>
.diff-preview-container { padding: 1rem; display: flex; flex-direction: column; height: 100%; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding: 0 0.5rem; flex-shrink: 0; height: 32px; }
.title { font-size: 0.875rem; font-weight: 500; color: #4B5563; }
.apply-btn { display: flex; align-items: center; gap: 0.375rem; padding: 0.375rem 0.75rem; background-color: #16A34A; color: white; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 500; }
.apply-btn:hover { background-color: #15803D; }
.content-area { flex-grow: 1; background-color: #FFFFFF; border-radius: 0.5rem; border: 1px solid #E5E7EB; padding: 1rem; overflow-y: auto; font-size: 0.875rem; line-height: 1.7; color: #374151; scrollbar-width: thin; scrollbar-color: #D1D5DB #ffffff; }
.content-area::-webkit-scrollbar { width: 6px; }
.content-area::-webkit-scrollbar-thumb { background-color: #D1D5DB; border-radius: 3px; }
.empty-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #9CA3AF; font-size: 0.875rem; }
.prose-preview { white-space: pre-wrap; }
.blinking-cursor { font-weight: 500; font-size: 1em; color: #3B82F6; animation: blink 1s step-end infinite; }
@keyframes blink { from, to { color: transparent; } 50% { color: #3B82F6; } }
</style>