<template>
  <div
      v-if="visible"
      class="floating-toolbar"
      :style="{ top: `${position.top}px`, left: `${position.left}px` }"
      @mousedown.prevent
  >
    <button @click="execute('novel.ai.analyze')" title="分析内容" class="toolbar-btn"><i class="fa-solid fa-magnifying-glass-chart"></i></button>
    <button @click="execute('novel.ai.continue')" title="AI续写" class="toolbar-btn"><i class="fa-solid fa-wand-magic-sparkles"></i></button>
    <button @click="execute('novel.ai.polish')" title="润色文本" class="toolbar-btn"><i class="fa-solid fa-spell-check"></i></button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { commandService } from '@core/services/CommandService';
import { usePaneStore } from '@core/panes/stores/paneStore';

const visible = ref(false);
const position = ref({ top: 0, left: 0 });

const show = (rect: DOMRect, wrapperRect: DOMRect) => {
  visible.value = true;
  position.value = {
    top: rect.top - wrapperRect.top - 48,
    left: rect.left - wrapperRect.left + rect.width / 2 - 60,
  };
};

const hide = () => {
  visible.value = false;
};

const execute = (commandId: string) => {
  const paneStore = usePaneStore();
  const activeTabId = paneStore.activePane?.activeTabId;
  if (activeTabId) {
    commandService.execute(commandId, { itemId: activeTabId });
  }
  hide();
};

defineExpose({ show, hide });
</script>

<style scoped>
.floating-toolbar { position: absolute; z-index: 10; background-color: white; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.375rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display: flex; gap: 0.25rem; }
.toolbar-btn { width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; color: #4B5563; border-radius: 0.375rem; }
.toolbar-btn:hover { background-color: #f3f4f6; }
</style>