// ..\src\novel\editor\components\ai\EditorAIPanel.vue

<template>
  <aside class="editor-ai-panel-container">
    <!-- Top Part: AI Task Queue -->
    <div class="task-queue-section">
      <AITaskQueue @select-task="handleSelectTask" />
    </div>

    <!-- Divider -->
    <div class="divider"></div>

    <!-- Bottom Part: AI Diff Preview -->
    <div class="diff-preview-section">
      <AIDiffPreview :preview-task="selectedTask" @apply-changes="handleApplyChanges" />
    </div>

    <!-- Footer for settings -->
    <div class="panel-footer">
      <label class="setting-item">
        <input type="checkbox" v-model="needsPreview" class="setting-checkbox" />
        <span class="setting-label">执行前预览上下文</span>
      </label>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import AITaskQueue from './AITaskQueue.vue';
import AIDiffPreview from './AIDiffPreview.vue';
import { useAITaskStore } from '@/novel/editor/stores/aiTaskStore';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import type { AITask } from '@/novel/editor/types';

// --- State ---
const selectedTaskId = ref<string | null>(null);

// --- Store ---
const aiTaskStore = useAITaskStore();
const editorStore = useEditorStore();

// --- Computed ---
const selectedTask = computed((): AITask | null => {
  if (!selectedTaskId.value) {
    return null;
  }
  return aiTaskStore.tasks.find(t => t.id === selectedTaskId.value) ?? null;
});

// 计算属性用于双向绑定预览设置
const needsPreview = computed({
  get: () => editorStore.uiState.needsPreview,
  set: (value: boolean) => {
    editorStore.uiState.needsPreview = value;
  }
});

// --- Methods ---

const handleSelectTask = (task: AITask) => {
  selectedTaskId.value = task.id;
  aiTaskStore.setPreviewTaskId(task.id);
};

const handleApplyChanges = (taskId: string) => {
  aiTaskStore.applyChanges(taskId);
  selectedTaskId.value = null;
  aiTaskStore.setPreviewTaskId(null);
};

onUnmounted(() => {
  aiTaskStore.setPreviewTaskId(null);
  selectedTaskId.value = null;
});
</script>

<style scoped>
.editor-ai-panel-container {
  width: 24rem; /* 384px */
  background-color: #F9FAFB; /* gray-50 */
  border-left: 1px solid #F3F4F6; /* gray-100 */
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.task-queue-section {
  height: 40%;
  min-height: 200px; /* 保证即使在小屏幕下也有足够空间 */
  flex-shrink: 0;
}

.divider {
  height: 1px;
  background-color: #E5E7EB; /* gray-200, a bit darker */
  margin: 0 1rem; /* 在两侧留出边距 */
}

.diff-preview-section {
  flex-grow: 1;
  height: 60%;
}

.panel-footer {
  flex-shrink: 0;
  padding: 0.75rem 1.5rem;
  border-top: 1px solid #E5E7EB;
  background-color: #FFFFFF;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.setting-checkbox {
  width: 1rem;
  height: 1rem;
  border-radius: 0.25rem;
  border-color: #D1D5DB;
  color: #10B981;
  transition: all 0.2s;
}
.setting-checkbox:focus {
  ring-offset-color: white;
  --tw-ring-color: #10B981;
}

.setting-label {
  font-size: 0.875rem;
  color: #4B5563;
}
</style>