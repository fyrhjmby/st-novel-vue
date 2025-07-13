<template>
  <div class="task-queue-container">
    <div class="header">
      <h3 class="title">AI任务队列</h3>
      <span v-if="activeTasksCount > 0" class="badge">{{ activeTasksCount }}个活跃</span>
    </div>
    <div v-if="tasks.length > 0" class="task-list">
      <div
          v-for="task in tasks"
          :key="task.id"
          :class="['task-item', `status-${task.status}`, { 'clickable': isClickable(task.status) }]"
          @click="handleTaskClick(task)"
      >
        <div class="task-item-header">
          <p class="task-title" :title="task.title">{{ task.title }}</p>
          <span class="task-status-text">
            <i :class="getStatusIcon(task.status)" class="status-icon"></i>
            {{ getStatusText(task.status) }}
          </span>
        </div>
        <div class="task-item-body">
          <div v-if="task.status === 'processing'" class="progress-bar-container">
            <div class="progress-bar"></div>
          </div>
          <p v-if="task.status === 'failed'" class="error-message">
            {{ task.error }} <a href="#" @click.prevent.stop="handleRetry(task)" class="retry-link">重试</a>
          </p>
          <p v-else class="message">{{ getStatusMessage(task.status) }}</p>
        </div>
      </div>
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
import { useAITaskStore } from '../../stores/aiTaskStore';
import type { AITask, AITaskStatus } from '../../types';

const emit = defineEmits<{ (e: 'select-task', task: AITask): void; }>();

const aiTaskStore = useAITaskStore();
const tasks = computed(() => aiTaskStore.tasks);
const activeTasksCount = computed(() => aiTaskStore.activeTasksCount);

const getStatusText = (status: AITaskStatus) => ({ pending: '等待中', processing: '进行中...', completed: '待应用', failed: '失败', applied: '已应用' }[status]);
const getStatusIcon = (status: AITaskStatus) => ({ pending: 'fa-solid fa-hourglass-half', processing: 'fa-solid fa-spinner fa-spin', completed: 'fa-solid fa-check-circle', failed: 'fa-solid fa-times-circle', applied: 'fa-solid fa-check-double' }[status]);
const getStatusMessage = (status: AITaskStatus) => ({ processing: '点击查看实时生成', completed: '点击预览与应用', applied: '已自动应用，点击查看详情' }[status] || '');
const isClickable = (status: AITaskStatus) => ['completed', 'processing', 'applied'].includes(status);

const handleTaskClick = (task: AITask) => isClickable(task.status) && emit('select-task', task);
const handleRetry = (task: AITask) => aiTaskStore.retryTask(task.id);
</script>

<style scoped>
.task-queue-container { padding: 1rem; display: flex; flex-direction: column; height: 100%; border-bottom: 1px solid #E5E7EB; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding: 0 0.5rem; }
.title { font-size: 0.875rem; font-weight: 500; color: #4B5563; }
.badge { font-size: 0.75rem; font-weight: 500; padding: 0.125rem 0.5rem; border-radius: 9999px; color: #1D4ED8; background-color: #DBEAFE; }
.task-list { flex-grow: 1; overflow-y: auto; space-y: 0.5rem; padding-right: 4px; scrollbar-width: thin; scrollbar-color: #D1D5DB #f9fafb; }
.task-list::-webkit-scrollbar { width: 6px; }
.task-list::-webkit-scrollbar-thumb { background-color: #D1D5DB; border-radius: 3px; }
.task-item { padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #E5E7EB; transition: all 0.2s ease; background-color: #FFFFFF;}
.task-item.clickable { cursor: pointer; }
.task-item.clickable:hover { border-color: #D1D5DB; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.task-item-header { display: flex; justify-content: space-between; align-items: center; }
.task-title { font-size: 0.875rem; font-weight: 500; color: #1F2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.task-status-text { font-size: 0.75rem; font-weight: 500; display: flex; align-items: center; gap: 0.25rem; flex-shrink: 0; }
.status-icon { width: 1rem; text-align: center; }
.status-processing .task-status-text { color: #2563EB; }
.status-completed .task-status-text { color: #16A34A; }
.status-failed .task-status-text { color: #DC2626; }
.task-item-body { margin-top: 0.5rem; }
.progress-bar-container { width: 100%; background-color: #E5E7EB; border-radius: 9999px; height: 0.25rem; overflow: hidden; }
.progress-bar { background-color: #3B82F6; height: 100%; width: 100%; border-radius: 9999px; animation: indeterminate-progress 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
@keyframes indeterminate-progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
.error-message, .message { font-size: 0.75rem; margin-top: 0.25rem; }
.error-message { color: #B91C1C; }
.message { color: #6B7280; }
.retry-link { text-decoration: underline; font-weight: 500; }
.empty-state { flex-grow: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #9CA3AF; font-size: 0.875rem; }
</style>