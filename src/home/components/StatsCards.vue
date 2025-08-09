<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-xl p-6 border border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <div class="w-10 h-10 bg-[#F3F4F6] rounded-lg flex items-center justify-center" v-html="stat.icon"></div>
        <span class="text-xs font-medium px-2 py-1 rounded-md" :class="stat.trendClass">{{ stat.trend }}</span>
      </div>
      <p class="text-2xl font-light text-[#374151]">{{ stat.value }}</p>
      <p class="text-sm text-[#9CA3AF] mt-1">{{ stat.label }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Stat } from '@/types/home';

defineProps({
  stats: {
    type: Array as PropType<Stat[]>,
    required: true,
  },
});
</script>