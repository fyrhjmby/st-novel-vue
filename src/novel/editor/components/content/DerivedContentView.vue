// 文件: ..\src\novel\editor\components\content\DerivedContentView.vue

<template>
  <div class="flex-1 flex flex-col bg-white h-full">
    <header class="h-16 px-6 flex items-center justify-between border-b border-gray-200 flex-shrink-0 bg-gray-50">
      <h1 class="text-base font-medium text-gray-800 truncate" :title="store.viewTitle">
        {{ store.viewTitle }}
      </h1>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500">
          {{ store.items.length > 0 ? store.currentIndex + 1 : 0 }} / {{ store.items.length }}
        </span>
        <button
            @click="store.prevItem()"
            :disabled="store.currentIndex === 0"
            class="toolbar-btn"
            title="上一条"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button
            @click="store.nextItem()"
            :disabled="store.currentIndex >= store.items.length - 1"
            class="toolbar-btn"
            title="下一条"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
        <div class="divider"></div>
        <button @click="store.createNewItem()" class="toolbar-btn" title="新建">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto" v-if="store.currentItem">
      <TiptapEditor
          :model-value="store.currentItem.content"
          @update:modelValue="handleContentUpdate"
          :is-editable="true"
          class="p-8"
      />
    </div>
    <div v-else class="flex-1 flex items-center justify-center text-gray-400">
      <p>没有可显示的{{ store.derivedType === 'plot' ? '剧情' : '分析' }}内容。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDerivedViewStore } from '@novel/editor/stores/derivedViewStore';
import { useDerivedContentStore } from '@novel/editor/stores/derivedContentStore';
import TiptapEditor from './TiptapEditor.vue';

const store = useDerivedViewStore();
const derivedContentStore = useDerivedContentStore();

const handleContentUpdate = (newContent: string) => {
  if (store.currentItem) {
    derivedContentStore.updateNodeContent(store.currentItem.id, newContent);
  }
};
</script>

<style scoped>
.toolbar-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4B5563;
  border-radius: 0.375rem;
  transition: all 0.2s;
}
.toolbar-btn:hover:not(:disabled) {
  background-color: #E5E7EB;
  color: #1F2937;
}
.toolbar-btn:disabled {
  color: #D1D5DB;
  cursor: not-allowed;
}
.divider {
  width: 1px;
  height: 16px;
  background-color: #E5E7EB;
  margin: 0 0.25rem;
}
</style>