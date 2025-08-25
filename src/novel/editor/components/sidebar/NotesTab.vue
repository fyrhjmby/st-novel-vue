// 文件: src\novel\editor\components\sidebar\NotesTab.vue

<template>
  <div class="notes-tab-container">
    <div class="header">
      <h3 class="title">章节笔记</h3>
      <button @click="handleAddNewNote" class="action-btn" title="新建笔记"><i class="fa-solid fa-plus fa-xs"></i></button>
    </div>
    <div class="notes-list">
      <div
          v-for="(note, index) in notesStore.notes"
          :key="note.id"
          @click="editorStore.openTab(note.id)"
          @contextmenu.prevent="handleContextMenu(note, $event)"
          class="note-item"
          :class="{ 'active': activeTabId === note.id }"
      >
        <div class="note-header">
          <template v-if="editingNodeId === note.id">
            <input
                :ref="el => { if (el) renameInputs[index] = el as HTMLInputElement }"
                type="text"
                :value="note.title"
                class="rename-input"
                @blur="handleCommitRename($event, note.id)"
                @keydown.enter.prevent="handleCommitRename($event, note.id)"
                @keydown.esc.prevent="handleCancelRename"
                @click.stop
            />
          </template>
          <template v-else>
            <p class="note-title">{{ note.title }}</p>
          </template>
          <span class="note-timestamp">{{ note.timestamp }}</span>
        </div>
        <p class="note-content">{{ note.content.replace(/<[^>]+>/g, '') }}</p>
      </div>
    </div>
    <div class="quick-add-footer">
      <input
          type="text"
          placeholder="快速添加新笔记..."
          class="quick-add-input"
          v-model="quickAddValue"
          @keydown.enter="handleQuickAdd"
      >
      <button @click="handleQuickAdd" class="quick-add-btn"><i class="fa-solid fa-paper-plane fa-sm"></i></button>
    </div>
  </div>
</template>
<script setup lang="ts">
// 文件: ..\src\novel\editor\components\sidebar\NotesTab.vue
import { ref, computed, watch, nextTick, onBeforeUpdate } from 'vue';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import { useNotesStore } from '@/novel/editor/stores/notesStore';
import { useUIStore } from '@/novel/editor/stores/uiStore';
import type { NoteItem } from '@/novel/editor/types';
import type { TreeNode } from './TreeView.vue';
import { getIconByNodeType } from '@/novel/editor/utils/iconUtils';

const emit = defineEmits<{
  (e: 'show-context-menu', payload: { node: TreeNode; event: MouseEvent }): void;
}>();

const editorStore = useEditorStore();
const notesStore = useNotesStore();
const uiStore = useUIStore();
const quickAddValue = ref('');
const renameInputs = ref<HTMLInputElement[]>([]);

const editingNodeId = computed(() => uiStore.editingNodeId);
const activeTabId = computed(() => editorStore.activeTabId);


watch(editingNodeId, (newId) => {
  if (newId && newId.startsWith('note-')) {
    nextTick(() => {
      const noteIndex = notesStore.notes.findIndex(n => n.id === newId);
      if (noteIndex !== -1 && renameInputs.value[noteIndex]) {
        renameInputs.value[noteIndex].focus();
        renameInputs.value[noteIndex].select();
      }
    });
  }
});

onBeforeUpdate(() => {
  renameInputs.value = [];
});

const addNewNoteAndEdit = async (title: string) => {
  const newNote = await notesStore.addNote(title);
  if (newNote) {
    editorStore.openTab(newNote.id);
    uiStore.setEditingNodeId(newNote.id);
  }
};

const handleAddNewNote = () => {
  addNewNoteAndEdit('新建笔记');
};

const handleQuickAdd = () => {
  const value = quickAddValue.value.trim();
  if (!value) return;
  addNewNoteAndEdit(value);
  quickAddValue.value = '';
};

const handleContextMenu = (note: NoteItem, event: MouseEvent) => {
  const nodePayload: TreeNode = {
    id: note.id,
    title: note.title,
    type: note.type,
    icon: getIconByNodeType(note.type),
    originalData: note
  };
  emit('show-context-menu', { node: nodePayload, event });
}

const handleCommitRename = (event: Event, nodeId: string) => {
  const input = event.target as HTMLInputElement;
  const newTitle = input.value.trim();
  if(newTitle) {
    notesStore.renameNote(nodeId, newTitle);
  }
  handleCancelRename();
};

const handleCancelRename = () => {
  uiStore.setEditingNodeId(null);
};
</script>
<style scoped>
.notes-tab-container {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0 0.5rem;
  flex-shrink: 0;
}
.title { font-size: 0.875rem; font-weight: 500; color: #4B5563; }
.action-btn { width: 1.75rem; height: 1.75rem; display: flex; align-items: center; justify-content: center; color: #6B7280; border-radius: 0.375rem; transition: background-color 0.15s; }
.action-btn:hover { background-color: #E5E7EB; }

.notes-list {
  flex-grow: 1;
  overflow-y: auto;
  space-y: 0.5rem;
  padding-right: 4px;
}
.notes-list::-webkit-scrollbar { width: 6px; }
.notes-list::-webkit-scrollbar-track { background: transparent; }
.notes-list::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }

.note-item { padding: 0.75rem; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; background-color: #FFFFFF; }
.note-item:hover { background-color: #F9FAFB; border-color: #F3F4F6; }
.note-item.active { background-color: #FEFCE8; border-color: #FDE047; }
.note-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; }
.note-title { font-size: 0.875rem; font-weight: 500; color: #1F2937; flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.note-timestamp { font-size: 0.75rem; color: #CA8A04; flex-shrink: 0; }
.note-content { font-size: 0.75rem; color: #4B5563; margin-top: 0.375rem; line-height: 1.6; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
.rename-input {
  flex-grow: 1;
  background-color: white;
  border: 1px solid #3B82F6;
  border-radius: 4px;
  padding: 1px 4px;
  font-size: 0.875rem;
  color: #1F2937;
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
.quick-add-footer {
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid #E5E7EB;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.quick-add-input {
  flex-grow: 1;
  background: white;
  border: 1px solid #D1D5DB;
  border-radius: 0.5rem;
  padding: 0.4rem 0.75rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
}
.quick-add-input:focus {
  border-color: #3B82F6;
  box-shadow: 0 0 0 1px #3B82F6;
}
.quick-add-btn {
  width: 2.2rem;
  height: 2.2rem;
  flex-shrink: 0;
  background-color: #F3F4F6;
  border-radius: 0.5rem;
  color: #4B5563;
  transition: background-color 0.2s;
}
.quick-add-btn:hover {
  background-color: #E5E7EB;
}
</style>