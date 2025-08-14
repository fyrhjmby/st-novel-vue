<template>
  <router-view />
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';
import { useSystemSettingsStore } from '@/settings/stores/systemSettingsStore';

const settingsStore = useSystemSettingsStore();

const themeMap: Record<string, string> = {
  '默认主题': '',
  '深色模式': 'dark',
  '护眼模式': 'eyecare-green', // Changed from 'sepia' to 'eyecare-green' for semantic correctness
};

watchEffect(() => {
  // Eagerly initialize store if needed, especially for first load
  if (!settingsStore.activeTheme) {
    settingsStore.initializeSettings();
  }

  const themeClass = themeMap[settingsStore.activeTheme] || '';
  const htmlElement = document.documentElement;

  // Remove other theme classes before adding the new one
  Object.values(themeMap).forEach(className => {
    if (className && htmlElement.classList.contains(className)) {
      htmlElement.classList.remove(className);
    }
  });

  if (themeClass) {
    htmlElement.classList.add(themeClass);
  }
});
</script>

<style>
/* Remove the old body styles, as they are now handled by main.css with CSS variables */
body {
  /* background-color is now set by --color-bg-app in main.css */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  display: none;
}
</style>