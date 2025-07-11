
<template>
  <div class="pane-instance-container" @click="paneStore.setActivePane(pane.id)">
    <TabBar :tabs="pane.tabs" :active-tab-id="pane.activeTabId" :pane-id="pane.id" :is-active-pane="isActive" />
    <div class="content-area">
      <template v-if="activeItem">
        <component :is="resolvedView" :key="activeItem.id" :item="activeItem" />
      </template>
      <div v-else class="welcome-screen">
        <p>No file is open</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import { usePaneStore } from '@/core/stores/paneStore';
import { viewRegistry } from '@/core/services/ViewRegistry';
import type { Pane } from '@/core/types';
import TabBar from './TabBar.vue';

const props = defineProps({
  pane: {
    type: Object as PropType<Pane>,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

const paneStore = usePaneStore();

const activeItem = computed(() => props.pane.activeItem);

const resolvedView = computed(() => {
  if (activeItem.value?.viewType) {
    return viewRegistry.resolve(activeItem.value.viewType);
  }
  return null;
});

</script>

<style scoped>
.pane-instance-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #FFFFFF;
  border-left: 1px solid #E5E7EB;
}
.pane-instance-container:first-child {
  border-left: none;
}
.content-area {
  flex-grow: 1;
  overflow: auto;
}
.welcome-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9CA3AF;
  user-select: none;
}
</style>