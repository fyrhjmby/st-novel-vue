

<template>
  <div
      class="fixed z-50"
      :style="{ top: `${position.y}px`, left: `${position.x}px` }"
  />
    <div class="absolute top-1/2 left-1/2 w-48 h-48 -mt-24 -ml-24 pointer-events-none">
      <div
          v-for="item in menuItems"
          :key="item.id"
          :class="['float-menu-item', { 'active': isAiMenuOpen }]"
          :style="{ transform: isAiMenuOpen ? `rotate(${item.angle}deg) translate(80px) rotate(${-item.angle}deg) scale(1)` : 'scale(0.5)' }"
      >
        <component
            :is="item.path ? 'router-link' : 'button'"
            :to="item.path"
            @click="item.action"
            :class="[
            'w-16 h-16 bg-white rounded-full shadow-lg flex flex-col items-center justify-center gap-1 transition-all border border-gray-100 pointer-events-auto',
            item.color.hoverBg,
            'text-[#374151]',
            'hover:text-black'
          ]"
            :title="item.name"
        >
          <i :class="['fa-solid', item.icon, item.color.icon, 'text-xl']"></i>
          <span class="text-xs font-medium">{{ item.name }}</span>
        </component>
      </div>
    </div>

    <button
        @click="toggleMenu"
        @mousedown.stop="startDrag"
        class="w-16 h-16 text-white rounded-full shadow-xl hover:scale-110 focus:scale-110 active:scale-100 transition-all duration-300 flex items-center justify-center cursor-grab active:cursor-grabbing"
        :class="isAiMenuOpen
          ? 'bg-gradient-to-br from-gray-500 to-gray-600'
          : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'"
    >
      <i
          :class="['fa-solid', isAiMenuOpen ? 'fa-times' : 'fa-wand-magic-sparkles', 'text-2xl transition-transform duration-300 ease-in-out']"
          :style="{ transform: isAiMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }"
      ></i>
    </button>

    <!-- [移除] 配置模态框已经被移到更顶层的布局中，以确保其全局性 -->
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDraggable } from '@/novel/shared/composables/useDraggable.ts';
// [修复] 导入正确的 useAITaskStore，用于打开配置模态框
import { useAITaskStore } from '@/novel/shared/composables/useAITaskStore.ts';

const { openTaskConfig } = useAITaskStore();

const isAiMenuOpen = ref(false);

const toggleMenu = () => {
  if (dragging.value) return;
  isAiMenuOpen.value = !isAiMenuOpen.value;
};

// [修复] Actions 现在调用 openTaskConfig 来打开配置模态框，而不是直接执行任务
const menuItems = computed(() => [
  {
    id: 'continue',
    name: '续写',
    icon: 'fa-wand-magic-sparkles',
    angle: -165,
    color: { icon: 'text-purple-500', hoverBg: 'hover:bg-purple-50' },
    action: () => {
      openTaskConfig('continue');
      isAiMenuOpen.value = false;
    }
  },
  {
    id: 'polish',
    name: '润色',
    icon: 'fa-palette',
    angle: -115,
    color: { icon: 'text-teal-500', hoverBg: 'hover:bg-teal-50' },
    action: () => {
      openTaskConfig('polish');
      isAiMenuOpen.value = false;
    }
  },
  {
    id: 'analyze',
    name: '分析',
    icon: 'fa-magnifying-glass-chart',
    angle: -65,
    color: { icon: 'text-amber-500', hoverBg: 'hover:bg-amber-50' },
    action: () => {
      openTaskConfig('analyze');
      isAiMenuOpen.value = false;
    }
  },
  {
    id: 'chat',
    name: '聊天',
    icon: 'fa-comments',
    angle: -15,
    color: { icon: 'text-blue-500', hoverBg: 'hover:bg-blue-50' },
    path: '/novel/chat', // 跳转到聊天页面，这是一个特例
    action: () => {
      isAiMenuOpen.value = false;
    }
  }
]);

const { position, dragging, startDrag } = useDraggable({
  initialPosition: { x: window.innerWidth - 100, y: window.innerHeight - 100 },
  padding: 16
});
</script>

<style scoped>
.float-menu-item {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -2rem; /* -32px */
  margin-top: -2rem; /* -32px */
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.float-menu-item.active {
  opacity: 1;
}
</style>