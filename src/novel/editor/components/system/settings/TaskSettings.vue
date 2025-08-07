<template>
  <div class="setting-page-wrapper">
    <div class="page-header">
      <h2 class="page-title">任务管理</h2>
      <p class="page-description">管理AI任务队列，清理历史记录。</p>
    </div>

    <div class="setting-group">
      <div class="setting-item">
        <label for="auto-open-panel" class="setting-label">任务面板</label>
        <div class="setting-control">
          <div class="flex items-center">
            <input id="auto-open-panel" type="checkbox" v-model="autoOpenAIPanel" class="setting-checkbox" />
            <label for="auto-open-panel" class="ml-3 font-medium text-gray-700">自动打开AI任务面板</label>
          </div>
          <p class="setting-description">
            启用后，当执行AI任务时，会自动在右侧分屏打开AI任务面板以供查看。
          </p>
        </div>
      </div>

      <div class="setting-item">
        <label class="setting-label">任务应用策略</label>
        <div class="setting-control">
          <div class="space-y-3">
            <div class="flex items-center">
              <input id="apply-manual" type="radio" value="manual" v-model="applicationStrategy.mode" class="setting-radio" />
              <label for="apply-manual" class="ml-3 font-medium text-gray-700">手动应用</label>
            </div>
            <div class="flex items-center">
              <input id="apply-auto" type="radio" value="auto" v-model="applicationStrategy.mode" class="setting-radio" />
              <label for="apply-auto" class="ml-3 font-medium text-gray-700">自动应用</label>
            </div>
            <div class="flex items-center">
              <input id="apply-delayed" type="radio" value="delayed" v-model="applicationStrategy.mode" class="setting-radio" />
              <label for="apply-delayed" class="ml-3 font-medium text-gray-700">延迟</label>
              <input
                  v-if="applicationStrategy.mode === 'delayed'"
                  type="number"
                  v-model.number="applicationStrategy.delaySeconds"
                  min="1"
                  class="setting-input w-20 ml-3 text-center"
              />
              <span v-if="applicationStrategy.mode === 'delayed'" class="ml-2 text-gray-700">秒后自动应用</span>
            </div>
          </div>
          <p class="setting-description">
            决定AI任务完成后，其生成的内容如何应用到文档中。<br>
            <b>手动应用：</b>任务完成后状态变为“待应用”，需在任务面板手动点击应用。<br>
            <b>自动应用：</b>任务完成后立即应用到文档中。
          </p>
        </div>
      </div>

      <div class="setting-item">
        <label for="concurrent-tasks" class="setting-label">AI任务并发数</label>
        <div class="setting-control">
          <div class="flex items-center gap-4">
            <input
                id="concurrent-tasks"
                type="range"
                min="1"
                max="10"
                step="1"
                v-model.number="concurrentTaskLimit"
                class="range-custom flex-1"
            />
            <input
                type="number"
                min="1"
                max="10"
                v-model.number="concurrentTaskLimit"
                class="setting-input w-20 text-center"
            />
          </div>
          <p class="setting-description">
            设置可以同时处理的AI任务数量。更高的并发数会占用更多资源。当前设置为 {{ concurrentTaskLimit }} 个。
          </p>
        </div>
      </div>

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
import { computed } from 'vue';
import { useAITaskStore } from '@novel/editor/stores/ai/aiTaskStore.ts';
import { useUIStore } from '@/novel/editor/stores/uiStore';

const aiTaskStore = useAITaskStore();
const uiStore = useUIStore();

const autoOpenAIPanel = computed({
  get: () => uiStore.uiState.autoOpenAIPanel,
  set: (value) => uiStore.setAutoOpenAIPanel(value)
});

const applicationStrategy = computed({
  get: () => uiStore.uiState.taskApplicationStrategy,
  set: (value) => uiStore.setTaskApplicationStrategy(value)
});

const concurrentTaskLimit = computed({
  get: () => uiStore.uiState.concurrentTaskLimit,
  set: (value) => uiStore.setConcurrentTaskLimit(value)
});

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
.setting-item:last-child { border-bottom: none; }
.setting-label { font-size: 0.875rem; font-weight: 500; color: #374151; padding-top: 0.5rem; }
.setting-control { display: flex; flex-direction: column; gap: 0.75rem; }
.setting-description { color: #6B7280; font-size: 0.875rem; line-height: 1.6; }
.action-button {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  background-color: #FFFFFF;
  border: 1px solid #D1D5DB;
  color: #374151;
  transition: background-color 0.2s;
}
.action-button:hover {
  background-color: #F9FAFB;
}
.action-button-danger {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  background-color: #FEF2F2;
  border: 1px solid #FECACA;
  color: #DC2626;
  transition: background-color 0.2s;
}
.action-button-danger:hover {
  background-color: #FEE2E2;
}
.setting-checkbox { height: 1.25rem; width: 1.25rem; border-radius: 0.25rem; border: 1px solid #D1D5DB; color: #2563EB; }
.setting-radio {
  width: 1.25rem;
  height: 1.25rem;
  color: #2563EB;
  border-color: #D1D5DB;
}
.setting-input { background-color: white; border: 1px solid #D1D5DB; border-radius: 0.375rem; padding: 0.5rem 0.75rem; outline: none; transition: all 0.2s; }
.setting-input:focus { border-color: #3B82F6; box-shadow: 0 0 0 1px #3B82F6; }
.range-custom {
  -webkit-appearance: none; appearance: none;
  width: 100%; height: 16px; background: transparent;
  outline: none; padding: 0; margin: 0;
}
.range-custom::-webkit-slider-runnable-track {
  width: 100%; height: 6px; cursor: pointer;
  background: #E5E7EB; border-radius: 9999px;
}
.range-custom::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  height: 20px; width: 20px; background: #3B82F6;
  border-radius: 50%; border: 3px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: grab; margin-top: -7px;
}
</style>