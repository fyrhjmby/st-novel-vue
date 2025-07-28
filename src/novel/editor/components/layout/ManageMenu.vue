<template>
  <div
      v-if="visible"
      ref="menuRef"
      class="manage-menu-container"
      :style="menuStyle"
      @click.stop
  >
    <ul class="menu-list">
      <li v-for="item in menuItems" :key="item.id">
        <div v-if="item.isDivider" class="menu-divider"></div>
        <a v-else href="#" class="menu-item" @click.prevent="selectItem(item.id)">
          <span>{{ item.label }}</span>
          <span v-if="item.shortcut" class="shortcut">{{ item.shortcut }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const emit = defineEmits<{
  (e: 'select-action', actionId: string): void;
}>();

const visible = ref(false);
const position = ref({ bottom: 0, left: 0 });
const menuRef = ref<HTMLElement | null>(null);

const menuItems = ref([
  { id: 'command_palette', label: '命令面板...', shortcut: 'Ctrl+Shift+P' },
  { isDivider: true },
  { id: 'system:settings_novel', label: '小说设置', shortcut: '' },
  { id: 'system:settings_context', label: '上下文管理', shortcut: '' },
  { id: 'system:settings_ai_config', label: 'AI 任务配置', shortcut: '' },
  { isDivider: true },
  { id: 'system:settings_editor', label: '编辑器设置', shortcut: '' },
  { id: 'system:settings_tasks', label: '任务管理', shortcut: '' },
  { id: 'system:settings_theme', label: '主题设置' },
  { isDivider: true },
  { id: 'keyboard_shortcuts', label: '键盘快捷方式', shortcut: 'Ctrl+K Ctrl+S' },
  { isDivider: true },
  { id: 'check_for_updates', label: '检查更新...' },
]);

const menuStyle = computed(() => ({
  bottom: `${position.value.bottom}px`,
  left: `${position.value.left}px`,
}));

const show = (buttonElement: HTMLElement) => {
  const rect = buttonElement.getBoundingClientRect();
  position.value.bottom = window.innerHeight - rect.top + 8; // 8px spacing
  position.value.left = rect.left;
  visible.value = true;
};

const hide = () => {
  visible.value = false;
};

const selectItem = (actionId: string) => {
  emit('select-action', actionId);
  hide();
};

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    hide();
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
});

defineExpose({ show, hide });
</script>

<style scoped>
.manage-menu-container {
  position: fixed;
  z-index: 1000;
  width: 260px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.5rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  color: #374151;
}
.menu-list {
  list-style: none;
}
.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.15s;
}
.menu-item:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}
.shortcut {
  color: #9ca3af;
}
.menu-item:hover .shortcut {
  color: #6b7280;
}
.menu-divider {
  height: 1px;
  background-color: #f3f4f6;
  margin: 0.5rem 0;
}
</style>