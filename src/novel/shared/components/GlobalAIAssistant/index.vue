<template>
  <div
      class="fixed z-50 flex items-center justify-center cursor-grab active:cursor-grabbing"
      :style="{ top: `${position.y}px`, left: `${position.x}px`, width: '12rem', height: '12rem', marginLeft: '-6rem', marginTop: '-6rem' }"
      @mousedown="startDrag"
      @click="handleClick"
  >
    <!-- Radial Menu Items Container -->
    <div
        class="absolute inset-0 pointer-events-none"
    >
      <div
          v-for="item in menuItems"
          :key="item.id"
          :class="['float-menu-item', { 'active': isAiMenuOpen }]"
          :style="{ transform: isAiMenuOpen ? `rotate(${item.angle}deg) translate(80px) rotate(${-item.angle}deg) scale(1)` : 'scale(0.5)' }"
      >
        <component
            :is="item.path ? 'router-link' : 'button'"
            :to="item.path"
            @click.stop="item.action"
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

    <!-- Main Floating Button -->
    <button
        class="w-16 h-16 text-white rounded-full shadow-xl hover:scale-110 focus:scale-110 active:scale-100 transition-all duration-300 flex items-center justify-center pointer-events-auto absolute"
        :class="isAiMenuOpen
          ? 'bg-gradient-to-br from-gray-500 to-gray-600'
          : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'"
    >
      <i
          :class="['fa-solid', isAiMenuOpen ? 'fa-times' : 'fa-wand-magic-sparkles', 'text-2xl transition-transform duration-300 ease-in-out']"
          :style="{ transform: isAiMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }"
      ></i>
    </button>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDraggable } from '@/novel/shared/composables/useDraggable';
import { useAIAssistantStore } from '@/novel/shared/composables/useAIAssistantStore';

const aiAssistantStore = useAIAssistantStore();
const isAiMenuOpen = ref(false);

const toggleMenu = () => {
  isAiMenuOpen.value = !isAiMenuOpen.value;
};

const menuItems = computed(() => [
  {
    id: 'continue',
    name: '续写',
    icon: 'fa-wand-magic-sparkles',
    angle: -165,
    color: { icon: 'text-purple-500', hoverBg: 'hover:bg-purple-50' },
    action: () => {
      aiAssistantStore.openTaskConfig('continue');
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
      aiAssistantStore.openTaskConfig('polish');
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
      aiAssistantStore.openTaskConfig('analyze');
      isAiMenuOpen.value = false;
    }
  },
  {
    id: 'chat',
    name: '聊天',
    icon: 'fa-comments',
    angle: -15,
    color: { icon: 'text-blue-500', hoverBg: 'hover:bg-blue-50' },
    path: '/novel/chat',
    action: () => {
      isAiMenuOpen.value = false;
    }
  }
]);

const { position, dragging, startDrag } = useDraggable({
  initialPosition: { x: window.innerWidth - 100, y: window.innerHeight - 100 },
  padding: 16
});

const handleClick = () => {
  if (dragging.value) {
    return;
  }
  toggleMenu();
};

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
  transform: scale(0.5);
}
.float-menu-item.active {
  opacity: 1;
}
</style>