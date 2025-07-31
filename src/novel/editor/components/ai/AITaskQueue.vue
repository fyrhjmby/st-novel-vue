// 文件: src/novel/editor/components/ai/AITaskQueue.vue

<template>
  <div class="task-queue-container">
    <div class="header">
      <h3 class="title">AI任务队列</h3>
      <span v-if="activeTasksCount > 0" class="badge">{{ activeTasksCount }}个活跃</span>
    </div>
    <div v-if="tasks.length > 0" class="task-list">
      <AITaskItem
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @select-task="handleTaskClick"
          @apply-changes="handleApplyChanges"
          @retry-task="handleRetry"
      />
    </div>
    <div v-else class="empty-state">
      <i class="fa-regular fa-folder-open text-3xl text-gray-300"></i>
      <p class="mt-2">当前没有AI任务</p>
      <p class="text-xs text-gray-400 mt-1">在编辑器中右键开始</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAITaskStore } from '@/novel/editor/stores/aiTaskStore';
import type { AITask } from '@/novel/editor/types';
import AITaskItem from './AITaskItem.vue';

const emit = defineEmits<{
  (e: 'select-task', task: AITask): void;
  (e: 'apply-changes', taskId: string): void;
}>();

const aiTaskStore = useAITaskStore();
const tasks = computed(() => aiTaskStore.tasks);
const activeTasksCount = computed(() => aiTaskStore.activeTasksCount);

const handleTaskClick = (task: AITask) => {
  emit('select-task', task);
};

const handleRetry = (taskId: string) => {
  aiTaskStore.retryTask(taskId);
};

const handleApplyChanges = (taskId: string) => {
  emit('apply-changes', taskId);
}
</script>

<style scoped>
.task-queue-container { padding: 1rem; display: flex; flex-direction: column; height: 100%; border-bottom: 1px solid #E5E7EB; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding: 0 0.5rem; }
.title { font-size: 0.875rem; font-weight: 500; color: #4B5563; }
.badge { font-size: 0.75rem; font-weight: 500; padding: 0.125rem 0.5rem; border-radius: 9999px; color: #1D4ED8; background-color: #DBEAFE; }
.task-list { flex-grow: 1; overflow-y: auto; space-y: 0.5rem; padding-right: 4px; }
.empty-state { flex-grow: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #9CA3AF; font-size: 0.875rem; }
.task-list { scrollbar-width: thin; scrollbar-color: #D1D5DB #f9fafb; }
.task-list::-webkit-scrollbar { width: 6px; }
.task-list::-webkit-scrollbar-track { background: transparent; }
.task-list::-webkit-scrollbar-thumb { background-color: #D1D5DB; border-radius: 3px; }
</style>