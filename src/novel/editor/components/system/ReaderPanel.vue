<template>
  <div class="h-full w-full bg-[#FDFCF9] text-[#3a2f2f] flex flex-col relative font-serif overflow-hidden">
    <main class="flex-1 overflow-y-auto px-4 py-8 pt-16">
      <div v-if="targetDocument && 'content' in targetDocument" class="max-w-3xl mx-auto reader-content" v-html="targetDocument.content">
      </div>
      <div v-else class="max-w-3xl mx-auto text-center py-20 text-gray-500">
        <h1 class="text-2xl font-bold mb-4">无法加载阅读内容</h1>
        <p>此内容不支持阅读模式，或文档不存在。</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import { useDirectoryStore } from '../../stores/directoryStore';
import type { CoreItem } from '@core/types';

const props = defineProps({
  item: {
    type: Object as PropType<CoreItem>,
    required: true,
  },
});

const directoryStore = useDirectoryStore();
const targetDocument = computed(() => directoryStore.findNodeById(props.item.metadata.targetId)?.node);
</script>

<style>
.reader-content h1 { font-family: 'Noto Serif SC', serif; font-size: 2.25rem; font-weight: 600; margin-bottom: 2.5rem; color: #1f2937; letter-spacing: 0.05em; padding-bottom: 1rem; border-bottom: 1px solid rgba(0,0,0,0.05); text-align: center; }
.reader-content p { font-family: 'Noto Serif SC', serif; font-size: 1.125rem; line-height: 2.2; color: #374151; margin-bottom: 1.75rem; text-align: justify; }
.font-sans { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
</style>