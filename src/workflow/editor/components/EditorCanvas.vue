<template>
  <VueFlow
      :model-value="elements"
      :default-viewport="{ zoom: 1 }"
      :min-zoom="0.2"
      :max-zoom="4"
      @update:model-value="$emit('update:elements', $event)"
      @nodes-change="$emit('nodesChange', $event)"
      @edges-change="$emit('edgesChange', $event)"
      @connect="$emit('connect', $event)"
      @pane-ready="onPaneReady"
      @node-click="onNodeClick"
      @pane-click="onPaneClick"
      class="workflow-canvas-bg"
  >
    <template #node-custom="props">
      <CustomNode v-bind="props" />
    </template>
  </VueFlow>
</template>

<script setup lang="ts">
import { VueFlow } from '@vue-flow/core';
import type { Elements, FlowEvents, VueFlowStore, NodeChange, EdgeChange, Connection } from '@vue-flow/core';
import CustomNode from './CustomNode.vue';

defineProps<{
  elements: Elements;
}>();

const emit = defineEmits<{
  (e: 'update:elements', value: Elements): void;
  (e: 'nodesChange', change: NodeChange[]): void;
  (e: 'edgesChange', change: EdgeChange[]): void;
  (e: 'connect', connection: Connection): void;
  (e: 'paneReady', instance: VueFlowStore): void;
  (e: 'nodeClick', event: FlowEvents['nodeClick']): void;
  (e: 'paneClick', event: MouseEvent): void;
}>();

const onPaneReady = (instance: VueFlowStore) => emit('paneReady', instance);
const onNodeClick = (event: FlowEvents['nodeClick']) => emit('nodeClick', event);
const onPaneClick = (event: MouseEvent) => emit('paneClick', event);
</script>