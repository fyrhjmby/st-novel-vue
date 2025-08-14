// 文件: src/novel/editor/components/ai/AITaskPanel.vue

<template>
  <div class="ai-task-panel-container">
    <div class="task-queue-section">
      <AITaskQueue @select-task="handleSelectTask" @apply-changes="handleApplyChanges" />
    </div>
    <div class="diff-preview-section">
      <AIDiffPreview :preview-task="previewTask" @apply-changes="handleApplyChanges" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AITaskQueue from './AITaskQueue.vue';
import AIDiffPreview from './AIDiffPreview.vue';
import { useAITaskStore } from '@novel/editor/stores/ai/aiTaskStore.ts';
import type { AITask } from '@/novel/editor/types';

const aiTaskStore = useAITaskStore();

const previewTask = computed(() => aiTaskStore.previewTask);

const handleSelectTask = (task: AITask) => {
  aiTaskStore.setPreviewTask(task.id);
};

const handleApplyChanges = (taskId: string) => {
  aiTaskStore.applyChanges(taskId);
};
</script>

<style scoped>
.ai-task-panel-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #F9FAFB;
}
.task-queue-section {
  height: 50%;
  min-height: 200px;
  flex-shrink: 0;
}
.diff-preview-section {
  flex-grow: 1;
  height: 50%;
}
</style>