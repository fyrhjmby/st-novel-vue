<template>
  <div v-if="isVisible" class="palette-overlay" @click="store.hide">
    <div class="palette-container" @click.stop>
      <div class="search-wrapper">
        <i class="fa-solid fa-magnifying-glass search-icon"></i>
        <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Type a command"
            class="search-input"
            @keydown.down.prevent="store.navigate(1)"
            @keydown.up.prevent="store.navigate(-1)"
            @keydown.enter.prevent="commandPaletteService.executeSelected()"
        />
      </div>
      <ul class="results-list">
        <li
            v-for="(command, index) in filteredCommands"
            :key="command.id"
            :class="{ 'selected': index === selectedIndex }"
            @click="commandPaletteService.executeCommand(command.id)"
            @mouseenter="store.setSelectedIndex(index)"
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
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useCommandPaletteStore } from '@core/palette/stores/commandPaletteStore.ts';
import { commandPaletteService } from '@core/palette/services/CommandPaletteService.ts';
import { storeToRefs } from 'pinia';

const store = useCommandPaletteStore();
const { isVisible, searchQuery, filteredCommands, selectedIndex } = storeToRefs(store);

const searchInput = ref<HTMLInputElement | null>(null);

watch(isVisible, (newValue) => {
  if (newValue) {
    nextTick(() => {
      searchInput.value?.focus();
    });
  }
});

const handleGlobalKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isVisible.value) {
    store.hide();
  }
}

onMounted(() => window.addEventListener('keydown', handleGlobalKey));
onUnmounted(() => window.removeEventListener('keydown', handleGlobalKey));
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