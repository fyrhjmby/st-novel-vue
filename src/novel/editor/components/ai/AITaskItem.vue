// 文件: src/novel/editor/components/ai/AITaskItem.vue

<template>
  <div
      :class="['task-item', `status-${task.status}`, { 'clickable': isClickable(task.status) }]"
      @click="handleTaskClick"
  >
    <div class="task-item-header">
      <p class="task-title" :title="task.title">{{ task.title }}</p>
      <div class="flex items-center gap-2">
            <span class="task-status-text">
              <i :class="getStatusIcon(task.status)" class="status-icon"></i>
              {{ getStatusText(task.status) }}
            </span>
        <button
            v-if="task.status === 'completed'"
            @click.stop="emit('apply-changes', task.id)"
            class="apply-now-btn"
        >
          <i class="fa-solid fa-check fa-xs"></i>
          应用
        </button>
      </div>
    </div>

    <div class="task-item-body">
      <div v-if="task.status === 'processing'" class="progress-bar-container">
        <div class="progress-bar"></div>
      </div>
      <p v-if="task.status === 'failed'" class="error-message">
        {{ task.error }} <a href="#" @click.prevent.stop="emit('retry-task', task.id)" class="retry-link">重试</a>
      </p>
      <p v-if="isClickable(task.status)" class="message">
        点击查看详情
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { AITask, AITaskStatus } from '@/novel/editor/types';

const props = defineProps({
  task: {
    type: Object as PropType<AITask>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: 'select-task', task: AITask): void;
  (e: 'apply-changes', taskId: string): void;
  (e: 'retry-task', taskId: string): void;
}>();

const getStatusText = (status: AITaskStatus): string => {
  const map: Record<AITaskStatus, string> = {
    pending: '等待中',
    processing: '进行中...',
    completed: '待应用',
    failed: '失败',
    applied: '已应用',
    completed_with_conflict: '存在冲突'
  };
  return map[status];
};

const getStatusIcon = (status: AITaskStatus): string => {
  const map: Record<AITaskStatus, string> = {
    pending: 'fa-solid fa-hourglass-half',
    processing: 'fa-solid fa-spinner fa-spin',
    completed: 'fa-solid fa-check-circle',
    failed: 'fa-solid fa-times-circle',
    applied: 'fa-solid fa-check-double',
    completed_with_conflict: 'fa-solid fa-exclamation-triangle'
  };
  return map[status];
}

const isClickable = (status: AITaskStatus): boolean => {
  return ['completed', 'processing', 'applied', 'failed', 'completed_with_conflict'].includes(status);
};

const handleTaskClick = () => {
  if (isClickable(props.task.status)) {
    emit('select-task', props.task);
  }
};
</script>

<style scoped>
.task-item { padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #E5E7EB; transition: all 0.2s ease; background-color: #FFFFFF;}
.task-item.clickable { cursor: pointer; }
.task-item.clickable:hover { border-color: #D1D5DB; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.task-item.status-processing.clickable { border: 1px solid #93C5FD; background-color: #EFF6FF; }
.task-item.status-processing.clickable:hover { background-color: #DBEAFE; border-color: #60A5FA; }
.task-item.status-completed.clickable { border: 1px solid #BBF7D0; background-color: #F0FDF4; }
.task-item.status-completed.clickable:hover { background-color: #DCFCE7; border-color: #A7F3D0; }
.task-item.status-failed { border: 1px solid #FECACA; background-color: #FEF2F2; }
.task-item.status-applied.clickable { border: 1px solid #E5E7EB; background-color: #F9FAFB; }
.task-item.status-applied.clickable:hover { background-color: #F3F4F6; border-color: #E5E7EB; }
.task-item-header { display: flex; justify-content: space-between; align-items: center; }
.task-title { font-size: 0.875rem; font-weight: 500; color: #1F2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.task-status-text { font-size: 0.75rem; font-weight: 500; display: flex; align-items: center; gap: 0.25rem; flex-shrink: 0; }
.status-icon { width: 1rem; text-align: center; }
.status-pending .task-status-text { color: #6B7280; }
.status-processing .task-status-text { color: #2563EB; }
.status-completed .task-status-text { color: #16A34A; }
.status-failed .task-status-text { color: #DC2626; }
.status-applied .task-status-text { color: #6B7280; }
.task-item-body { margin-top: 0.5rem; }
.progress-bar-container { width: 100%; background-color: #E5E7EB; border-radius: 9999px; height: 0.25rem; overflow: hidden; }
.progress-bar { background-color: #3B82F6; height: 100%; width: 100%; border-radius: 9999px; animation: indeterminate-progress 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
@keyframes indeterminate-progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
.error-message, .message { font-size: 0.75rem; margin-top: 0.25rem; }
.error-message { color: #B91C1C; }
.message { color: #6B7280; }
.retry-link { text-decoration: underline; font-weight: 500; }
.apply-now-btn { display: flex; align-items: center; gap: 0.25rem; background: #22C55E; color: white; padding: 2px 8px; border-radius: 99px; font-size: 0.7rem; font-weight: 500; transition: background-color 0.2s; }
.apply-now-btn:hover { background: #16A34A; }
</style>