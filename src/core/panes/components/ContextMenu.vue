<template>
  <div
      v-if="isVisible"
      class="context-menu"
      :style="{ top: `${position.y}px`, left: `${position.x}px` }"
      @click.stop
      @contextmenu.prevent
  >
    <ul class="menu-list">
      <template v-for="item in items" :key="item.id">
        <li v-if="item.isDivider" class="menu-divider"></li>
        <li
            v-else
            :class="['menu-item', { 'disabled': item.isDisabled }]"
            @click.prevent="contextMenuService.execute(item)"
        >
          <i v-if="item.icon" :class="[item.icon, 'menu-icon']"></i>
          <span>{{ item.label }}</span>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import { storeToRefs } from 'pinia';
import { useContextMenuStore } from '@core/panes/stores/contextMenuStore.ts';
import { contextMenuService } from '@core/panes/service/ContextMenuService.ts';

const contextMenuStore = useContextMenuStore();
const { isVisible, position, items } = storeToRefs(contextMenuStore);

const handleClickOutside = () => contextMenuStore.hideMenu();

onMounted(() => window.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => window.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
.context-menu {
  position: fixed;
  z-index: 1000;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  min-width: 14rem;
}
.menu-list { list-style: none; padding: 0; margin: 0; }
.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  user-select: none;
}
.menu-item:not(.disabled):hover { background-color: #f3f4f6; }
.menu-item.disabled { color: #9ca3af; cursor: not-allowed; }
.menu-icon { width: 1rem; text-align: center; color: #6B7280; }
.menu-item:not(.disabled):hover .menu-icon { color: #374151; }
.menu-divider { height: 1px; background-color: #f3f4f6; margin: 0.5rem 0; }
</style>