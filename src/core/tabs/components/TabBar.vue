<template>
  <div class="tab-bar-container">
    <div
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-item"
        :class="{ 'active': tab.id === activeTabId, 'inactive-pane-tab': !isActivePane }"
        @click.stop="tabManagementService.activateTab(tab.id)"
    >
      <i :class="[tab.icon, 'tab-icon']"></i>
      <span class="tab-title">{{ tab.title }}</span>
      <div class="close-icon-wrapper">
        <i
            v-if="!tab.isDirty"
            class="fa-solid fa-times close-icon"
            @click.stop="tabManagementService.closeTab(tab.id)"
        ></i>
        <div v-else class="dirty-indicator" @click.stop="tabManagementService.closeTab(tab.id)"></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import { tabManagementService } from '@core/tabs/service/TabManagementService.ts';
import type { Tab } from '@core/types.ts';

defineProps({
  tabs: { type: Array as PropType<Tab[]>, required: true },
  activeTabId: { type: String as PropType<string | null>, required: true },
  paneId: { type: String, required: true },
  isActivePane: { type: Boolean, required: true },
});
</script>

<style scoped>
.tab-bar-container {
  display: flex; flex-shrink: 0; background-color: #F3F4F6;
  border-bottom: 1px solid #E5E7EB; padding-top: 0.5rem; padding-left: 0.5rem;
  overflow-x: auto;
}
.tab-item {
  display: flex; align-items: center; padding: 0.6rem 0.5rem 0.6rem 1rem;
  font-size: 0.875rem; color: #6B7280; cursor: pointer;
  border: 1px solid transparent; border-bottom: none;
  border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem;
  background-color: #E5E7EB; white-space: nowrap; transition: background-color 0.2s, color 0.2s;
}
.tab-item:not(:first-child) { margin-left: -1px; }
.tab-item:hover { background-color: #FFFFFF; }
.tab-item.active {
  background-color: #FFFFFF; color: #1F2937;
  border-color: #E5E7EB; z-index: 2; margin-bottom: -1px;
  padding-bottom: calc(0.6rem + 1px);
}
.inactive-pane-tab { background-color: #F3F4F6; color: #9CA3AF; }
.inactive-pane-tab:hover { background-color: #E5E7EB; }
.inactive-pane-tab.active { background-color: #F9FAFB; color: #6B7280; }
.tab-icon { margin-right: 0.5rem; }
.active .tab-icon { color: #3B82F6; }
.inactive-pane-tab.active .tab-icon { color: inherit; }
.tab-title { max-width: 150px; overflow: hidden; text-overflow: ellipsis; }

.close-icon-wrapper {
  margin-left: 0.75rem;
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 99px;
  flex-shrink: 0;
}
.close-icon {
  font-size: 0.8rem;
  opacity: 0.5;
  transition: all 0.2s;
  padding: 0.25rem;
}
.tab-item:hover .close-icon { opacity: 1; }
.close-icon:hover { background-color: #E5E7EB; border-radius: 99px; }

.dirty-indicator {
  width: 0.5rem;
  height: 0.5rem;
  background-color: #6B7280;
  border-radius: 99px;
  transition: all 0.2s;
}
.tab-item:hover .dirty-indicator {
  background-color: transparent;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%236B7280'%3E%3Cpath d='M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z'/%3E%3C/svg%3E");
  background-size: 100% 100%;
  width: 1rem;
  height: 1rem;
}
</style>