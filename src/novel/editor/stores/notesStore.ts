// 文件: ..\src\novel\editor\stores\notesStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { NoteItem } from '@/novel/editor/types';
import * as noteService from '@/novel/editor/services/noteService';

export const useNotesStore = defineStore('notes', () => {
    const notes = ref<NoteItem[]>([]);
    const novelId = ref<string | null>(null);

    async function fetchNotes(id: string) {
        novelId.value = id;
        try {
            notes.value = await noteService.getNotesForNovel(id);
        } catch (error) {
            console.error("Failed to fetch notes:", error);
            notes.value = [];
        }
    }

    async function saveNotes() {
        const updatePromises = notes.value.map(note =>
            noteService.updateNoteApi(note.id, { title: note.title, content: note.content })
        );
        await Promise.all(updatePromises);
    }

    const findNoteById = (noteId: string): NoteItem | undefined => {
        return notes.value.find(note => note.id === noteId);
    };

    const updateNoteContent = (noteId: string, content: string) => {
        const noteIndex = notes.value.findIndex(n => n.id === noteId);
        if (noteIndex === -1) return;

        const originalNote = notes.value[noteIndex];
        const updatedNote = noteService.updateNoteWithNewContent(originalNote, content);
        notes.value[noteIndex] = updatedNote;
    };

    const appendNoteContent = (noteId: string, contentToAppend: string, isAutoApplied: boolean) => {
        const note = findNoteById(noteId);
        if (note) {
            note.content = noteService.appendContentToNote(note.content, contentToAppend, isAutoApplied);
        }
    };

    const renameNote = (noteId: string, newTitle: string) => {
        const noteIndex = notes.value.findIndex(n => n.id === noteId);

        if (noteIndex !== -1 && newTitle.trim()) {
            const originalNote = notes.value[noteIndex];
            const trimmedTitle = newTitle.trim();
            const updatedNote = noteService.renameNote(originalNote, trimmedTitle);
            notes.value[noteIndex] = updatedNote;
        }
    };

    const addNote = async (title: string): Promise<NoteItem | null> => {
        if (!novelId.value) return null;

        const newNoteData: Partial<Omit<NoteItem, 'id'>> = {
            title,
            content: `<h1>${title}</h1><p></p>`,
        };

        try {
            const newNote = await noteService.createNoteApi(novelId.value, newNoteData);
            notes.value.unshift(newNote);
            return newNote;
        } catch (error) {
            console.error('Failed to add note:', error);
            return null;
        }
    };

    const deleteNote = async (noteId: string): Promise<boolean> => {
        const index = notes.value.findIndex(n => n.id === noteId);
        if (index !== -1) {
            try {
                await noteService.deleteNoteApi(noteId);
                notes.value.splice(index, 1);
                return true;
            } catch (error) {
                console.error('Failed to delete note:', error);
                return false;
            }
        }
        return false;
    };

    return {
        notes,
        fetchNotes,
        saveNotes,
        findNoteById,
        updateNoteContent,
        appendNoteContent,
        renameNote,
        addNote,
        deleteNote
    };
});