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
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import type { TabInfo, EditorItem } from '@/novel/editor/types';

const props = defineProps({
  activeTab: {
    type: Object as PropType<TabInfo | null>,
    required: true,
  },
});

const editorStore = useEditorStore();

const targetDocumentId = computed(() => {
  if (!props.activeTab) return null;
  const parts = props.activeTab.id.split(':');
  return parts.length === 3 ? parts[2] : null;
});

const targetDocument = computed((): EditorItem | null => {
  if (!targetDocumentId.value) return null;
  return editorStore.findItemById(targetDocumentId.value).node;
});

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600&display=swap');

.reader-content h1 {
  font-family: 'Noto Serif SC', serif;
  font-size: 2.25rem;
  font-weight: 600;
  margin-bottom: 2.5rem;
  color: #1f2937;
  letter-spacing: 0.05em;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  text-align: center;
}
.reader-content p {
  font-family: 'Noto Serif SC', serif;
  font-size: 1.125rem;
  line-height: 2.2;
  color: #374151;
  margin-bottom: 1.75rem;
  text-align: justify;
}
.font-sans {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
</style>