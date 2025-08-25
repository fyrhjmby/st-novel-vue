import apiClient from '@/api/client';
import type { NoteItem } from '@/novel/editor/types';

/**
 * 获取指定小说的所有笔记。
 * @param novelId - 小说的ID。
 * @returns 返回一个包含所有笔记条目的数组。
 */
export const getNotesForNovel = async (novelId: string): Promise<NoteItem[]> => {
    const response = await apiClient.get(`/novels/${novelId}/notes`);
    return response.data;
};

/**
 * 为指定小说创建一个新的笔记。
 * @param novelId - 小说的ID。
 * @param noteData - 创建笔记所需的数据（如标题、内容）。
 * @returns 返回新创建的笔记对象。
 */
export const createNote = async (novelId: string, noteData: Partial<Omit<NoteItem, 'id'>>): Promise<NoteItem> => {
    const response = await apiClient.post(`/novels/${novelId}/notes`, noteData);
    return response.data;
};

/**
 * 更新指定笔记的信息。
 * @param noteId - 要更新的笔记的ID。
 * @param noteData - 包含更新字段的对象。
 * @returns 返回更新后的笔记对象。
 */
export const updateNote = async (noteId: string, noteData: Partial<Omit<NoteItem, 'id'>>): Promise<NoteItem> => {
    const response = await apiClient.patch(`/notes/${noteId}`, noteData);
    return response.data;
};

/**
 * 删除一个笔记。
 * @param noteId - 要删除的笔记的ID。
 */
export const deleteNote = async (noteId: string): Promise<void> => {
    await apiClient.delete(`/notes/${noteId}`);
};