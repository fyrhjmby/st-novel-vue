import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { NoteItem } from '@/novel/editor/types';
import { useEditorStore } from './editorStore';

export const useNotesStore = defineStore('notes', () => {
    // --- State ---
    const notes = ref<NoteItem[]>([]);

    // --- Actions ---

    /**
     * 获取并设置笔记数据。
     * @param data - 笔记数组。
     */
    const fetchNotes = (data: NoteItem[]) => {
        notes.value = data;
    };

    /**
     * 根据ID查找笔记。
     * @param noteId - 笔记ID。
     */
    const findNoteById = (noteId: string): NoteItem | undefined => {
        return notes.value.find(note => note.id === noteId);
    };

    /**
     * 更新指定ID的笔记内容，并同步标题。
     * @param noteId - 目标笔记ID。
     * @param content - 新的内容。
     */
    const updateNoteContent = (noteId: string, content: string) => {
        const note = findNoteById(noteId);
        if (note) {
            note.content = content;
            // Notes might not have h1, but we can keep the logic for consistency
            const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
            const newTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : note.title; // Fallback to old title
            if (newTitle) {
                note.title = newTitle;
            }
        }
    };

    /**
     * 重命名一个笔记。
     * @param noteId - 目标笔记ID。
     * @param newTitle - 新标题。
     */
    const renameNote = (noteId: string, newTitle: string) => {
        const editorStore = useEditorStore();
        const note = findNoteById(noteId);
        if (note && newTitle.trim()) {
            note.title = newTitle.trim();
            note.content = note.content.replace(/<h1[^>]*>.*?<\/h1>/, `<h1>${newTitle.trim()}</h1>`);
        }
        editorStore.setEditingNodeId(null);
    };


    /**
     * 添加一条新笔记。
     * @param title - 笔记标题。
     * @param content - 笔记内容（可选）。
     */
    const addNote = (title: string, content: string = '') => {
        const editorStore = useEditorStore();
        const newNote: NoteItem = {
            id: `note-${Date.now()}`,
            type: 'note',
            title: title,
            content: `<h1>${title}</h1><p>${content}</p>`,
            timestamp: new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
        notes.value.unshift(newNote);
        editorStore.setActiveItem(newNote.id);
    };

    /**
     * 删除一条笔记。
     * @param noteId - 要删除的笔记ID。
     */
    const deleteNote = (noteId: string) => {
        const editorStore = useEditorStore();
        const index = notes.value.findIndex(n => n.id === noteId);
        if (index !== -1) {
            if (!window.confirm(`您确定要删除笔记 "${notes.value[index].title}" 吗？`)) return;
            notes.value.splice(index, 1);

            if (editorStore.activeItemId === noteId) {
                editorStore.setActiveItem(null);
            }
        }
    };


    return {
        notes,
        fetchNotes,
        findNoteById,
        updateNoteContent,
        renameNote,
        addNote,
        deleteNote
    };
});