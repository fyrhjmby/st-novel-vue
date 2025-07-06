<template>
  <div class="activity-bar-container">
    <div class="main-actions">
      <button
          v-for="tab in mainTabs"
          :key="tab.id"
          class="action-item"
          :class="{ 'active': activeTabId === tab.id && isSidebarVisible }"
          :title="tab.title"
          @click="$emit('select-tab', tab.id)"
      >
        <i :class="tab.icon"></i>
      </button>

      <div class="divider"></div>

      <button
          v-for="action in actionButtons"
          :key="action.id"
          class="action-item"
          :title="action.title"
          @click="$emit('trigger-action', action.id)"
      >
        <i :class="action.icon"></i>
      </button>

    </div>
    <div class="footer-actions">
      <button class="action-item" title="管理" @click.stop="$emit('show-manage-menu', $event)">
        <i class="fa-solid fa-gear"></i>
      </button>
      <button class="action-item" title="账户">
        <i class="fa-solid fa-user-circle"></i>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

type TabId = 'directory' | 'related' | 'notes';
type ActionId = 'system:search' | 'system:ai_chat';

interface Tab {
  id: TabId;
  title: string;
  icon: string;
}

interface ActionButton {
  id: ActionId;
  title: string;
  icon: string;
}

defineProps<{
  activeTabId: string | null;
  isSidebarVisible: boolean;
}>();

defineEmits<{
  (e: 'select-tab', id: TabId): void;
  (e: 'trigger-action', id: ActionId): void;
  (e: 'show-manage-menu', event: MouseEvent): void;
}>();

const mainTabs = ref<Tab[]>([
  { id: 'directory', title: '目录', icon: 'fa-solid fa-list-ul' },
  { id: 'related', title: '相关', icon: 'fa-solid fa-sitemap' },
  { id: 'notes', title: '笔记', icon: 'fa-solid fa-book-medical' },
]);

const actionButtons = ref<ActionButton[]>([
  { id: 'system:search', title: '搜索', icon: 'fa-solid fa-magnifying-glass' },
  { id: 'system:ai_chat', title: 'AI 聊天', icon: 'fa-solid fa-wand-magic-sparkles' },
])

</script>

<style scoped>
.activity-bar-container {
  width: 52px;
  height: 100%;
  background-color: #F3F4F6;
  border-right: 1px solid #E5E7EB;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  flex-shrink: 0;
}
.main-actions,
.footer-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.action-item {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: #6B7280;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  position: relative;
}
.action-item:hover {
  color: #1F2937;
  background-color: #E5E7EB;
}
.action-item.active {
  color: #2563EB;
  background-color: #DBEAFE;
}
.action-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background-color: #2563EB;
  border-radius: 0 4px 4px 0;
}
.divider {
  height: 1px;
  width: 28px;
  background-color: #E5E7EB;
  margin: 0.5rem 0;
}
</style>