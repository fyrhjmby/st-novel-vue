<template>
  <div class="ai-task-panel-container">
    <div class="task-queue-section">
      <AITaskQueue @select-task="handleSelectTask" @apply-changes="handleApplyChanges" />
    </div>
    <div class="diff-preview-section">
      <AIDiffPreview :preview-task="selectedTask" @apply-changes="handleApplyChanges" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AITaskQueue from './AITaskQueue.vue';
import AIDiffPreview from './AIDiffPreview.vue';
import { useAITaskStore } from '@/novel/editor/stores/aiTaskStore';
import type { AITask } from '@/novel/editor/types';

const selectedTaskId = ref<string | null>(null);
const aiTaskStore = useAITaskStore();

const selectedTask = computed((): AITask | null => {
  if (!selectedTaskId.value) return null;
  return aiTaskStore.tasks.find(t => t.id === selectedTaskId.value) ?? null;
});

const handleSelectTask = (task: AITask) => {
  selectedTaskId.value = task.id;
};

const handleApplyChanges = (taskId: string) => {
  aiTaskStore.applyChanges(taskId);

  // If the applied task was the one being previewed, clear the preview.
  if (selectedTaskId.value === taskId) {
    selectedTaskId.value = null;
  }
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