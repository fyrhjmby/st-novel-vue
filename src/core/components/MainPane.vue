<!-- 文件: src/core/components/MainPane.vue -->
<template>
  <div class="main-pane-container">
    <PaneNodeRenderer v-if="root" :node="root" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePaneStore } from '@/core/stores/paneStore';
import PaneNodeRenderer from './PaneNodeRenderer.vue';

const paneStore = usePaneStore();
const root = computed(() => paneStore.root);
</script>

<style scoped>
.main-pane-container {
  flex-grow: 1;
  display: flex;
  overflow: hidden;
  background-color: #F3F4F6;
}
</style>