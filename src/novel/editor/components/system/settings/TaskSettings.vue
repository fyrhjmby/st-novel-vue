<template>
  <div class="setting-page-wrapper">
    <div class="page-header">
      <h2 class="page-title">任务管理</h2>
      <p class="page-description">管理AI任务队列，清理历史记录。</p>
    </div>

    <div class="setting-group">
      <div class="setting-item">
        <label class="setting-label">清理任务</label>
        <div class="setting-control">
          <div class="flex items-center gap-4">
            <button @click="handleClearCompleted" class="action-button">清除已完成的任务</button>
            <button @click="handleClearAll" class="action-button-danger">清除所有任务</button>
          </div>
          <p class="setting-description">
            “已完成”包括已应用和已失败的任务。<br>
            清理所有任务将清空任务队列，包括正在等待和处理中的任务。此操作不可撤销。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAITaskStore } from '../../../stores/aiTaskStore';

const aiTaskStore = useAITaskStore();

const handleClearCompleted = () => {
  if (window.confirm('您确定要清除所有已应用和已失败的任务吗？')) {
    aiTaskStore.clearCompletedTasks();
  }
};

const handleClearAll = () => {
  if (window.confirm('您确定要清除所有AI任务吗？此操作不可撤销，进行中的任务也将被终止。')) {
    aiTaskStore.clearAllTasks();
  }
};
</script>

<style scoped>
.setting-page-wrapper { padding: 1rem 2rem; max-width: 56rem; margin: 0 auto; }
.page-header { padding-bottom: 1.5rem; border-bottom: 1px solid #E5E7EB; margin-bottom: 1.5rem; }
.page-title { font-size: 1.5rem; font-weight: 600; color: #1F2937; }
.page-description { color: #6B7280; margin-top: 0.25rem; }
.setting-group { display: flex; flex-direction: column; }
.setting-item { display: grid; grid-template-columns: 12rem 1fr; gap: 1rem; padding: 1.5rem 0; border-bottom: 1px solid #E5E7EB; }
.setting-label { font-size: 0.875rem; font-weight: 500; color: #374151; padding-top: 0.5rem; }
.setting-control { display: flex; flex-direction: column; gap: 0.75rem; }
.setting-description { color: #6B7280; font-size: 0.875rem; line-height: 1.6; }
.action-button { padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 500; border-radius: 0.375rem; background-color: #FFFFFF; border: 1px solid #D1D5DB; color: #374151; transition: background-color 0.2s; }
.action-button:hover { background-color: #F9FAFB; }
.action-button-danger { padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 500; border-radius: 0.375rem; background-color: #FEF2F2; border: 1px solid #FECACA; color: #DC2626; transition: background-color 0.2s; }
.action-button-danger:hover { background-color: #FEE2E2; }
</style>