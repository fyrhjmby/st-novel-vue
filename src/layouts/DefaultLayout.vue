<template>
  <div class="h-screen w-screen flex bg-[var(--color-bg-primary)] design-frame-container">
    <div class="design-frame">
      <div class="h-10 px-5 flex items-center border-b border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)] flex-shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
          <div class="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div class="w-3 h-3 rounded-full bg-[#28CA42]"></div>
        </div>
        <div class="ml-auto flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
          <span>AI Creator Platform</span>
        </div>
      </div>
      <div class="h-[calc(100%-40px)] flex">
        <AppSidebar />
        <main class="flex-1 bg-[var(--color-bg-primary)] flex flex-col transition-colors">
          <AppHeader />
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/layouts/components/AppSidebar.vue'
import AppHeader from '@/layouts/components/AppHeader.vue'
</script>

<style scoped>
.design-frame-container {
  padding: 2rem;
  background-color: var(--color-bg-app);
  transition: background-color 0.3s ease;
}
.design-frame {
  width: 100%;
  height: 100%;
  max-width: 1800px;
  margin: auto;
  background: var(--color-bg-primary);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  transition: background-color 0.3s ease;
}
html.dark .design-frame {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
</style>