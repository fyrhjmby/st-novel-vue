<template>
  <div class="notes-tab-container">
    <div class="header">
      <h3 class="title">章节笔记</h3>
      <button class="action-btn" title="新建笔记"><i class="fa-solid fa-plus fa-xs"></i></button>
    </div>
    <div class="notes-list">
      <div
          v-for="note in editorStore.noteData"
          :key="note.id"
          @click="editorStore.setActiveItem(note.id)"
          class="note-item"
          :class="{ 'active': editorStore.activeItemId === note.id }"
      >
        <div class="note-header">
          <p class="note-title">{{ note.title }}</p>
          <span class="note-timestamp">{{ note.timestamp }}</span>
        </div>
        <p class="note-content">{{ note.content }}</p>
      </div>
    </div>
    <div class="quick-add-footer">
      <input type="text" placeholder="快速添加新笔记..." class="quick-add-input">
      <button class="quick-add-btn"><i class="fa-solid fa-paper-plane fa-sm"></i></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/novel/editor/stores/editorStore';
const editorStore = useEditorStore();
</script>

<style scoped>
.notes-tab-container { padding: 1rem; display: flex; flex-direction: column; height: 100%; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding: 0 0.5rem; flex-shrink: 0; }
.title { font-size: 0.875rem; font-weight: 500; color: #4B5563; }
.action-btn { width: 1.75rem; height: 1.75rem; display: flex; align-items: center; justify-content: center; color: #6B7280; border-radius: 0.375rem; transition: background-color 0.15s; }
.action-btn:hover { background-color: #E5E7EB; }
.notes-list { flex-grow: 1; space-y: 0.5rem; overflow-y: auto; padding-right: 4px; }
.note-item { padding: 0.75rem; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; background-color: #FFFFFF; }
.note-item:hover { background-color: #F9FAFB; border-color: #F3F4F6; }
.note-item.active { background-color: #FEFCE8; border-color: #FDE047; }
.note-header { display: flex; justify-content: space-between; align-items: flex-start; }
.note-title { font-size: 0.875rem; font-weight: 500; color: #1F2937; padding-right: 3rem; }
.note-timestamp { font-size: 0.75rem; color: #CA8A04; flex-shrink: 0; }
.note-content { font-size: 0.75rem; color: #4B5563; margin-top: 0.375rem; line-height: 1.6; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
.quick-add-footer { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #F3F4F6; display: flex; gap: 0.5rem; flex-shrink: 0; }
.quick-add-input { flex-grow: 1; background: white; border: 1px solid #D1D5DB; border-radius: 0.5rem; padding: 0.4rem 0.75rem; font-size: 0.875rem; outline: none; transition: all 0.2s; }
.quick-add-input:focus { border-color: #3B82F6; box-shadow: 0 0 0 1px #3B82F6; }
.quick-add-btn { flex-shrink: 0; width: 2rem; height: 2rem; background-color: #4B5563; color: white; border-radius: 0.5rem; transition: background-color 0.2s; }
.quick-add-btn:hover { background-color: #374151; }
</style>