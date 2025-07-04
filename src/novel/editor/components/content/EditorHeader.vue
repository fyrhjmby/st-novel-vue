<template>
  <header class="header">
    <div v-if="activeItem" class="header-left">
        <span class="item-icon" :class="iconColorClass">
            <i :class="icon"></i>
        </span>
      <span class="item-title">{{ activeItem.title }}</span>
      <span v-if="activeItem.type === 'chapter' && (activeItem as any).status === 'editing'" class="item-status-badge">
          已保存
        </span>
    </div>
    <div v-else class="header-left">
      <span class="item-title">请从左侧选择一个文档</span>
    </div>

    <div v-if="activeItem" class="header-right">
      <div class="stats">
        <span v-if="wordCount > 0">字数: {{ wordCount }}</span>
        <template v-if="readingTime > 0">
          <span class="divider">•</span>
          <span>预计阅读: {{ readingTime }}分钟</span>
        </template>
      </div>
      <div class="actions">
        <router-link to="/novel/read" class="action-btn" title="阅读模式"><i class="fa-solid fa-book-open-reader"></i></router-link>
        <router-link to="/novel/history" class="action-btn" title="历史版本"><i class="fa-solid fa-clock-rotate-left"></i></router-link>
        <button class="action-btn" title="更多选项"><i class="fa-solid fa-ellipsis-vertical"></i></button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import { getIconByNodeType } from '@/novel/editor/utils/iconUtils';

const props = defineProps({
  activeItem: {
    type: Object as PropType<any | null>,
    default: null
  }
});

const wordCount = computed(() => (props.activeItem?.type === 'chapter' && props.activeItem.wordCount) ? props.activeItem.wordCount : 0);

const readingTime = computed(() => {
  if (!wordCount.value) return 0;
  const time = Math.ceil(wordCount.value / 300);
  return time > 0 ? time : 1;
});

const icon = computed(() => {
  if (!props.activeItem) return getIconByNodeType('default');
  return getIconByNodeType(props.activeItem.type);
});

const iconColorClass = computed(() => {
  const iconClasses = icon.value.split(' ');
  // 返回颜色相关的类，例如 'text-purple-500'
  return iconClasses.filter(c => c.startsWith('text-')).join(' ');
});

</script>

<style scoped>
.header { height: 4rem; padding: 0 1.5rem; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #F3F4F6; flex-shrink: 0; background-color: #FFFFFF; }
.header-left { display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem; }
.item-icon { width: 1.25rem; text-align: center; }
.item-title { font-weight: 500; color: #1F2937; }
.item-status-badge { font-size: 0.75rem; font-weight: 500; padding: 0.125rem 0.5rem; border-radius: 9999px; color: #15803D; background-color: #DCFCE7; }
.header-right { display: flex; align-items: center; gap: 1rem; }
.stats { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: #6B7280; }
.stats .divider { color: #D1D5DB; }
.actions { display: flex; align-items: center; gap: 0.25rem; }
.action-btn { width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; color: #6B7280; border-radius: 0.5rem; transition: background-color 0.15s; }
.action-btn:hover { background-color: #F3F4F6; }
</style>