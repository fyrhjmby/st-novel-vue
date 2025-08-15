<template>
  <div class="px-4 h-16 flex items-center justify-between border-b border-gray-100 bg-white flex-shrink-0">
    <div class="flex items-center gap-3">
      <router-link to="/workflow/my-flows" class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="返回">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
      </router-link>
      <h1 class="text-lg font-medium text-[#374151]">{{ props.id === 'new' ? '新工作流' : '社交媒体帖子生成器' }}</h1>
    </div>
    <div class="flex items-center gap-3">
      <span v-if="store.isSaving" class="text-xs text-gray-400 mr-2">保存中...</span>
      <span v-else-if="!store.isLoading" class="text-xs text-green-500 mr-2 flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        已保存
      </span>
      <button class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-[#374151] hover:bg-gray-50 transition-colors flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>
        测试
      </button>
      <button @click="store.saveWorkflow" :disabled="store.isSaving" class="px-4 py-2 bg-[#374151] text-white rounded-lg text-sm font-medium hover:bg-[#1F2937] transition-colors flex items-center gap-2 min-w-[90px] justify-center">
        <svg v-if="store.isSaving" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <span v-else>保 存</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '../store/editorStore';

const props = defineProps<{
  id: string;
}>();

const store = useEditorStore();
</script>