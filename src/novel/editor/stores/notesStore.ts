// 文件: src\novel\editor\stores\notesStore.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { NoteItem } from '@/novel/editor/types';
import { useEditorStore } from './editorStore';
import { useUIStore } from './uiStore';

export const useNotesStore = defineStore('notes', () => {
    // --- State ---
    const notes = ref<NoteItem[]>([]);

    // --- Actions ---

    const fetchNotes = (data: NoteItem[]) => {
        notes.value = data;
    };

    const findNoteById = (noteId: string): NoteItem | undefined => {
        return notes.value.find(note => note.id === noteId);
    };

    const updateNoteContent = (noteId: string, content: string) => {
        const note = findNoteById(noteId);
        if (note) {
            note.content = content;
            const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
            const newTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : note.title;
            if (newTitle) {
                note.title = newTitle;
            }
        }
    };

    const appendNoteContent = (noteId: string, contentToAppend: string, isAutoApplied: boolean) => {
        const note = findNoteById(noteId);
        if (note) {
            const paragraphs = contentToAppend.split('\n').map(p => `<p>${p || ' '}</p>`).join('');
            let htmlToAppend = paragraphs;
            if (isAutoApplied) {
                htmlToAppend += `<p class="ai-applied-marker">--- AI生成内容已应用 ---</p>`;
            }
            note.content += htmlToAppend;
        }
    };

    const renameNote = (noteId: string, newTitle: string) => {
        const uiStore = useUIStore();
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
        uiStore.setEditingNodeId(null);
    };

    const addNote = (title: string, content: string = '') => {
        const editorStore = useEditorStore();
        const uiStore = useUIStore();
        const newNote: NoteItem = {
            id: `note-${Date.now()}`,
            type: 'note',
            title: title,
            content: `<h1>${title}</h1><p>${content}</p>`,
            timestamp: new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
        notes.value.unshift(newNote);
        editorStore.openTab(newNote.id);
        uiStore.setEditingNodeId(newNote.id);
    };

    const deleteNote = (noteId: string) => {
        const editorStore = useEditorStore();
        const index = notes.value.findIndex(n => n.id === noteId);
        if (index !== -1) {
            if (!window.confirm(`您确定要删除笔记 "${notes.value[index].title}" 吗？`)) return;
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