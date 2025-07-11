<template>
  <div v-if="isVisible" class="palette-overlay" @click="hide">
    <div class="palette-container" @click.stop>
      <div class="search-wrapper">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Type a command"
            class="search-input"
            @keydown.down.prevent="navigate(1)"
            @keydown.up.prevent="navigate(-1)"
            @keydown.enter.prevent="executeSelected"
        />
      </div>
      <ul class="results-list">
        <li
            v-for="(command, index) in filteredCommands"
            :key="command.id"
            :class="{ 'selected': index === selectedIndex }"
            @click="executeCommand(command.id)"
            @mouseenter="selectedIndex = index"
        >
          <i v-if="command.icon" :class="[command.icon, 'command-icon']"></i>
          <span>{{ command.label }}</span>
        </li>
        <li v-if="filteredCommands.length === 0" class="no-results">
          No matching commands
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { commandService } from '@/core/services/CommandService';
import type { Command } from '@/core/types';

const isVisible = ref(false);
const searchQuery = ref('');
const allCommands = ref<Command[]>([]);
const selectedIndex = ref(0);
const searchInput = ref<HTMLInputElement | null>(null);

const filteredCommands = computed(() => {
  if (!searchQuery.value) {
    return allCommands.value;
  }
  const query = searchQuery.value.toLowerCase();
  return allCommands.value.filter(cmd =>
      cmd.label.toLowerCase().includes(query)
  );
});

const show = () => {
  allCommands.value = Array.from(commandService.commands.values());
  isVisible.value = true;
  nextTick(() => {
    searchInput.value?.focus();
  });
};

const hide = () => {
  isVisible.value = false;
  searchQuery.value = '';
  selectedIndex.value = 0;
};

const navigate = (direction: 1 | -1) => {
  const newIndex = selectedIndex.value + direction;
  if (newIndex >= 0 && newIndex < filteredCommands.value.length) {
    selectedIndex.value = newIndex;
  }
};

const executeSelected = () => {
  const command = filteredCommands.value[selectedIndex.value];
  if (command) {
    executeCommand(command.id);
  }
};

const executeCommand = (commandId: string) => {
  commandService.execute(commandId);
  hide();
};

const handleGlobalKey = (e: KeyboardEvent) => {
  if(e.ctrlKey && e.shiftKey && e.key === 'P') {
    e.preventDefault();
    show();
  }
  if(e.key === 'Escape' && isVisible.value) {
    hide();
  }
}

onMounted(() => window.addEventListener('keydown', handleGlobalKey));
onUnmounted(() => window.removeEventListener('keydown', handleGlobalKey));

defineExpose({ show, hide });
</script>

<style scoped>
.palette-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  justify-content: center;
  padding-top: 15vh;
}
.palette-container {
  width: 100%;
  max-width: 600px;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: min-content;
  max-height: 70vh;
}
.search-wrapper {
  position: relative;
  border-bottom: 1px solid #e5e7eb;
  padding: 0.75rem;
}
.search-icon {
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}
.search-input {
  width: 100%;
  font-size: 1rem;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: none;
  outline: none;
  background: transparent;
}
.results-list {
  overflow-y: auto;
  padding: 0.5rem;
}
.results-list li {
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.results-list li.selected {
  background-color: #3B82F6;
  color: white;
}
.no-results {
  color: #9ca3af;
  text-align: center;
  padding: 2rem;
  cursor: default;
}
</style>