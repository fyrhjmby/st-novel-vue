import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { NoteItem } from '../types';

export const useNotesStore = defineStore('novel-notes', () => {
    const notes = ref<NoteItem[]>([]);

    function fetchNotes(data: NoteItem[]) {
        notes.value = data;
    }

    function findNoteById(noteId: string): NoteItem | undefined {
        return notes.value.find(note => note.id === noteId);
    }

    function updateNoteContent(noteId: string, content: string) {
        const note = findNoteById(noteId);
        if (note) {
            note.content = content;
            const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
            const newTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : note.title;
            if (newTitle) note.title = newTitle;
        }
    }

    function addNote(title: string, content: string = ''): NoteItem {
        const newNote: NoteItem = {
            id: `note-${Date.now()}`,
            type: 'note',
            title: title,
            content: `<h1>${title}</h1><p>${content}</p>`,
            timestamp: new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
        notes.value.unshift(newNote);
        return newNote;
    }

    function renameNote(noteId: string, newTitle: string) {
        const note = findNoteById(noteId);
        if (note && newTitle.trim()) {
            const trimmedTitle = newTitle.trim();
            note.title = trimmedTitle;
            if (note.content.includes('<h1>')) {
                note.content = note.content.replace(/<h1[^>]*>.*?<\/h1>/, `<h1>${trimmedTitle}</h1>`);
            } else {
                note.content = `<h1>${trimmedTitle}</h1>` + note.content;
            }
        }
    }

    function deleteNote(noteId: string) {
        const index = notes.value.findIndex(n => n.id === noteId);
        if (index !== -1) {
            if (!window.confirm(`您确定要删除笔记 "${notes.value[index].title}" 吗？`)) return;
            notes.value.splice(index, 1);
        }
    }

    return {
        notes,
        fetchNotes,
        findNoteById,
        updateNoteContent,
        addNote,
        renameNote,
        deleteNote,
    };
});