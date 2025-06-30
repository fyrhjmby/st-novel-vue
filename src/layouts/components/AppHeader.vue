<template>
  <header class="h-20 px-8 flex items-center justify-between border-b border-gray-100 flex-shrink-0 bg-white">
    <div class="flex items-center gap-8">
      <h1 class="text-lg font-medium text-[#374151]">{{ route.meta.title || 'AI Creator Platform' }}</h1>
    </div>
    <div class="flex items-center gap-2">
      <button class="p-2 hover:bg-gray-50 rounded-lg transition-colors">
        <svg
            class="w-5 h-5 text-[#6B7280]"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21L16.65 16.65" />
        </svg>
      </button>
      <button class="p-2 hover:bg-gray-50 rounded-lg transition-colors relative">
        <svg
            class="w-5 h-5 text-[#6B7280]"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
        >
          <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" />
          <path d="M13.73 21C13.5 21.6 12.8 22 12 22C11.2 22 10.5 21.6 10.27 21" />
        </svg>
        <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>
      <div class="ml-4 flex items-center gap-3">
        <div class="w-9 h-9 bg-gray-200 rounded-full"></div>
        <div>
          <p class="text-sm font-medium text-[#374151]">张小明</p>
          <p class="text-xs text-[#9CA3AF]">免费版</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>