<!-- 文件: src/core/components/ContextMenu.vue -->
<!-- 描述: 一个通用的、由命令驱动的右键菜单。 -->
<template>
  <div
      v-if="visible"
      class="context-menu"
      :style="{ top: `${position.y}px`, left: `${position.x}px` }"
      @click.stop
      @contextmenu.prevent
  >
    <ul class="menu-list">
      <li v-for="item in items" :key="item.id">
        <div v-if="item.isDivider" class="menu-divider"></div>
        <a
            v-else
            href="#"
            class="menu-item"
            :class="{ 'disabled': !canExecute(item.commandId, item.commandContext) }"
            @click.prevent="executeCommand(item)"
        >
          <i v-if="item.icon" :class="[item.icon, 'menu-icon']"></i>
          <span>{{ item.label }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { commandService } from '@/core/services/CommandService';
import type { ContextMenuItem, CommandContext } from '@/core/types';

const visible = ref(false);
const position = ref({ x: 0, y: 0 });
const items = ref<ContextMenuItem[]>([]);

const show = (event: MouseEvent, menuItems: ContextMenuItem[]) => {
  items.value = menuItems;
  visible.value = true;
  position.value.x = event.clientX;
  position.value.y = event.clientY;
};

const hide = () => {
  visible.value = false;
  items.value = [];
};

const canExecute = (commandId: string, context?: CommandContext) => {
  const command = commandService.get(commandId);
  if (!command) return false;
  if (command.canExecute) {
    return command.canExecute(context);
  }
  return true;
};

const executeCommand = (item: ContextMenuItem) => {
  if (canExecute(item.commandId, item.commandContext)) {
    commandService.execute(item.commandId, item.commandContext);
    hide();
  }
};

const handleClickOutside = (event: MouseEvent) => hide();

onMounted(() => window.addEventListener('click', handleClickOutside));
onBeforeUnmount(() => window.removeEventListener('click', handleClickOutside));

defineExpose({ show, hide });
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
.menu-list { list-style: none; }
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
  text-decoration: none;
}
.menu-item:not(.disabled):hover { background-color: #f3f4f6; }
.menu-item.disabled { color: #9ca3af; cursor: not-allowed; }
.menu-icon { width: 1rem; text-align: center; }
.menu-divider { height: 1px; background-color: #f3f4f6; margin: 0.5rem 0; }
</style>