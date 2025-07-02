// =
// 文件: ..\src\novel\editor\components\ai\EditorAIPanel.vue
//

<template>
  <aside class="editor-ai-panel-container">
    <!-- Top Part: AI Task Queue -->
    <div class="task-queue-section">
      <!-- [修复] 监听 select-task 事件 -->
      <AITaskQueue @select-task="handleSelectTask" />
    </div>

    <!-- Divider -->
    <div class="divider"></div>

    <!-- Bottom Part: AI Diff Preview -->
    <div class="diff-preview-section">
      <!-- [修复] 将 selectedTask 作为 prop 传递，并监听 apply-changes 事件 -->
      <AIDiffPreview :preview-task="selectedTask" @apply-changes="handleApplyChanges" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AITaskQueue from './AITaskQueue.vue';
import AIDiffPreview from './AIDiffPreview.vue';
import type { AITask } from '@/novel/editor/stores/aiTaskStore';
import { useEditorStore } from '@/novel/editor/stores/editorStore';

// --- State ---
const selectedTask = ref<AITask | null>(null);

// --- Store ---
const editorStore = useEditorStore();

// --- Methods ---

/**
 * 当用户从队列中选择一个任务时，更新当前要预览的任务
 * @param task - 被选中的任务
 */
const handleSelectTask = (task: AITask) => {
  selectedTask.value = task;
};

/**
 * 处理“应用修改”事件
 * @param newContent - AI生成的新内容
 */
const handleApplyChanges = (newContent: string) => {
  if (selectedTask.value && editorStore.activeItemId) {
    // 调用 editorStore 的 action 来更新激活文档的内容
    editorStore.updateItemContentById(editorStore.activeItemId, newContent);
    // 清空预览，避免误操作
    selectedTask.value = null;
  } else {
    console.error("无法应用修改：没有选中任务或没有激活的文档。");
  }
};
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
</style>