<template>
  <div class="min-h-screen p-8 bg-[var(--color-bg-app)]">
    <div class="max-w-[1800px] mx-auto bg-[var(--color-bg-primary)] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
      <div class="h-10 px-5 flex items-center border-b border-[var(--color-border-secondary)] bg-[var(--color-bg-muted)] flex-shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
          <div class="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div class="w-3 h-3 rounded-full bg-[#28CA42]"></div>
        </div>
        <div class="ml-auto flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
          <span>AI Creator Platform</span>
        </div>
      </div>
      <div class="h-[calc(100vh-4rem-40px)] flex">
        <SettingsSidebar />
        <main class="flex-1 flex flex-col overflow-hidden">
          <AppHeader />
          <div class="flex-1 overflow-auto hide-scrollbar">
            <router-view />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SettingsSidebar from '@/settings/components/SettingsSidebar.vue'
import AppHeader from '@/layouts/components/AppHeader.vue'
</script>