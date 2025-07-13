<template>
  <div class="notes-tab-container">
    <div class="header">
      <h3 class="title">章节笔记</h3>
      <button @click="commandService.execute('novel.note.create')" class="action-btn" title="新建笔记"><i class="fa-solid fa-plus fa-xs"></i></button>
    </div>
    <div class="notes-list">
      <div
          v-for="(note, index) in notesStore.notes"
          :key="note.id"
          @click="tabManagementService.openTab(note.id)"
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
                @blur="commitRename($event, note.id)"
                @keydown.enter.prevent="commitRename($event, note.id)"
                @keydown.esc.prevent="cancelRename"
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
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, nextTick, onBeforeUpdate } from 'vue';
import { useEditorStore } from '../../stores/editorStore';
import { useNotesStore } from '../../stores/notesStore';
import { useUIStore } from '../../stores/uiStore';
import { commandService } from '@core/services/CommandService';
import { tabManagementService } from '@core/tabs/service/TabManagementService';
import { contextMenuService } from '@core/panes/service/ContextMenuService';
import type { NoteItem } from '../../types';
import type { TreeNode } from './TreeView.vue';
import { getIconByNodeType } from '../../utils/iconUtils';

const editorStore = useEditorStore();
const notesStore = useNotesStore();
const uiStore = useUIStore();
const renameInputs = ref<HTMLInputElement[]>([]);

const editingNodeId = computed(() => uiStore.editingNodeId);
const activeTabId = computed(() => editorStore.activeTabId);

watch(editingNodeId, (newId) => {
  if (newId?.startsWith('note-')) {
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

const handleContextMenu = (note: NoteItem, event: MouseEvent) => {
  const nodePayload: TreeNode = { id: note.id, title: note.title, type: note.type, icon: getIconByNodeType(note.type), originalData: note };
  contextMenuService.show(event, 'novel-directory-node', { node: nodePayload });
}

const commitRename = (event: Event, nodeId: string) => {
  const input = event.target as HTMLInputElement;
  notesStore.renameNote(nodeId, input.value);
  uiStore.setEditingNodeId(null);
};

const cancelRename = () => {
  uiStore.setEditingNodeId(null);
};
</script>
<style scoped>
.notes-tab-container { padding: 1rem; display: flex; flex-direction: column; height: 100%; width: 100%; overflow: hidden; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding: 0 0.5rem; flex-shrink: 0; }
.title { font-size: 0.875rem; font-weight: 500; color: #4B5563; }
.action-btn { width: 1.75rem; height: 1.75rem; display: flex; align-items: center; justify-content: center; color: #6B7280; border-radius: 0.375rem; transition: background-color 0.15s; }
.action-btn:hover { background-color: #E5E7EB; }
.notes-list { flex-grow: 1; overflow-y: auto; space-y: 0.5rem; padding-right: 4px; }
.notes-list::-webkit-scrollbar { width: 6px; }
.notes-list::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
.note-item { padding: 0.75rem; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; background-color: #FFFFFF; }
.note-item:hover { background-color: #F9FAFB; border-color: #F3F4F6; }
.note-item.active { background-color: #FEFCE8; border-color: #FDE047; }
.note-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; }
.note-title { font-size: 0.875rem; font-weight: 500; color: #1F2937; flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.note-timestamp { font-size: 0.75rem; color: #CA8A04; flex-shrink: 0; }
.note-content { font-size: 0.75rem; color: #4B5563; margin-top: 0.375rem; line-height: 1.6; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
.rename-input { flex-grow: 1; background-color: white; border: 1px solid #3B82F6; border-radius: 4px; padding: 1px 4px; font-size: 0.875rem; color: #1F2937; outline: none; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
</style>