<template>
  <div class="pane-actions-container" :class="{'is-active-pane': isActive}">
    <button @click="commandService.execute('novel.system-view.open', { viewId: 'system:ai_tasks' })" class="toolbar-btn" title="AI 任务面板">
      <i class="fa-solid fa-list-check"></i>
    </button>
    <button @click="commandService.execute('novel.history-view.open')" class="toolbar-btn" title="版本历史">
      <i class="fa-solid fa-code-compare"></i>
    </button>
    <div class="divider"></div>
    <button @click="commandService.execute(CoreCommand.PANE_SPLIT_HORIZONTAL, { paneId })" class="toolbar-btn" title="分屏">
      <i class="fa-solid fa-columns"></i>
    </button>
    <button v-if="isPaneClosable" @click="commandService.execute(CoreCommand.PANE_CLOSE, { paneId })" class="toolbar-btn" title="关闭窗格">
      <i class="fa-solid fa-xmark"></i>
    </button>
    <button @click="commandService.execute('novel.reader-view.open')" class="toolbar-btn" title="阅读模式">
      <i class="fa-solid fa-book-open"></i>
    </button>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { usePaneStore } from '@core/panes/stores/paneStore';
import { commandService } from '@core/services/CommandService';
import { CoreCommand, CoreContext } from '@core/constants';
import { contextService } from '@core/common/services/ContextService';

defineProps<{
  paneId: string;
  isActive: boolean;
}>();

const paneStore = usePaneStore();
const isPaneClosable = computed(() => paneStore.root?.type === 'split' && contextService.check(CoreContext.PANE_IS_SPLIT));

</script>
<style scoped>
.pane-actions-container { display: flex; align-items: center; gap: 0.5rem; padding: 0 1rem; flex-shrink: 0; transition: color 0.2s; }
.toolbar-btn { width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; color: #6B7280; border-radius: 0.375rem; transition: all 0.2s; }
.pane-actions-container.is-active-pane .toolbar-btn:hover { background-color: #E5E7EB; color: #1F2937; }
.pane-actions-container:not(.is-active-pane) .toolbar-btn { color: #B0B3B8; }
.divider { width: 1px; height: 16px; background-color: #E5E7EB; margin: 0 0.25rem; }
</style>