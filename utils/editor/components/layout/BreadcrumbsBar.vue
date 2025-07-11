// 文件: src\novel\editor\components\layout\BreadcrumbsBar.vue

<template>
  <div class="breadcrumbs-bar-container" :class="{'is-active-pane': isActive}">
    <div class="breadcrumbs">
      <template v-if="activeTab">
        <span>{{ volumeTitle }}</span>
        <i class="fa-solid fa-chevron-right separator"></i>
        <span class="font-medium title-highlight">{{ activeTab.title }}</span>
      </template>
      <template v-else>
        <span></span>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import { useDirectoryStore } from '@/novel/editor/stores/directoryStore';

const props = defineProps<{
  paneId: string;
  isActive: boolean;
}>();

const editorStore = useEditorStore();
const directoryStore = useDirectoryStore();

const activeTab = computed(() => editorStore.getActiveTabForPane(props.paneId));

const volumeTitle = computed(() => {
  if (!activeTab.value || activeTab.value.item.type !== 'chapter') {
    return '根目录';
  }
  const chapterId = activeTab.value.id;
  const volume = directoryStore.directoryData.find(v =>
      v.chapters.some(c => c.id === chapterId)
  );
  return volume ? volume.title : '未知卷';
});

</script>
<style scoped>
.breadcrumbs-bar-container {
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  background-color: #FFFFFF;
  border-bottom: 1px solid #E5E7EB;
  flex-shrink: 0;
  overflow-x: auto;
  transition: color 0.2s;
}
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6B7280;
  white-space: nowrap;
}
.title-highlight {
  color: #374151;
}
.breadcrumbs-bar-container:not(.is-active-pane) .breadcrumbs {
  color: #B0B3B8;
}
.breadcrumbs-bar-container:not(.is-active-pane) .title-highlight {
  color: #9CA3AF;
}
.separator {
  font-size: 0.625rem;
  color: #D1D5DB;
}
</style>