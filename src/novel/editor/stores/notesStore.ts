import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { NoteItem } from '@/novel/editor/types';
import { useEditorStore } from './editorStore';
import { useUIStore } from './uiStore';
import { noteService } from '@/novel/editor/services/noteService';

export const useNotesStore = defineStore('notes', () => {
    const notes = ref<NoteItem[]>([]);

    const fetchNotes = (data: NoteItem[]) => {
        notes.value = data;
    };

    const findNoteById = (noteId: string): NoteItem | undefined => {
        return notes.value.find(note => note.id === noteId);
    };

    const updateNoteContent = (noteId: string, content: string) => {
        const noteIndex = notes.value.findIndex(n => n.id === noteId);
        if (noteIndex === -1) return;

        const originalNote = notes.value[noteIndex];
        const updatedNote = noteService.updateNoteWithNewContent(originalNote, content);
        notes.value.splice(noteIndex, 1, updatedNote);
    };

    const appendNoteContent = (noteId: string, contentToAppend: string, isAutoApplied: boolean) => {
        const note = findNoteById(noteId);
        if (note) {
            note.content = noteService.appendContentToNote(note.content, contentToAppend, isAutoApplied);
        }
    };

    const renameNote = (noteId: string, newTitle: string) => {
        const uiStore = useUIStore();
        const noteIndex = notes.value.findIndex(n => n.id === noteId);

        if (noteIndex !== -1 && newTitle.trim()) {
            const originalNote = notes.value[noteIndex];
            const trimmedTitle = newTitle.trim();
            const updatedNote = noteService.renameNote(originalNote, trimmedTitle);
            notes.value.splice(noteIndex, 1, updatedNote);
        }
        uiStore.setEditingNodeId(null);
    };

    const addNote = (title: string, content: string = '') => {
        const editorStore = useEditorStore();
        const uiStore = useUIStore();

        const newNote = noteService.createNote(title, content);
        notes.value.unshift(newNote);

        editorStore.openTab(newNote.id);
        uiStore.setEditingNodeId(newNote.id);
    };

    const deleteNote = (noteId: string) => {
        const editorStore = useEditorStore();
        const index = notes.value.findIndex(n => n.id === noteId);
        if (index !== -1) {
            notes.value.splice(index, 1);
            editorStore.closeTab(noteId);
        }
    };

    return {
        notes,
        fetchNotes,
        findNoteById,
        updateNoteContent,
        appendNoteContent,
        renameNote,
        addNote,
        deleteNote
    };
});