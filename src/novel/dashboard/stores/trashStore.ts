// src/novel/dashboard/stores/trashStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { DeletedItem } from '@/novel/types';
import * as trashService from '@/novel/dashboard/services/trashService';
import { useNovelStore } from './novelStore';

export const useTrashStore = defineStore('novel-dashboard-trash', () => {
    const trashedItems = ref<DeletedItem[]>([]);
    const isLoading = ref(false);

    const fetchTrashedItems = async () => {
        isLoading.value = true;
        try {
            trashedItems.value = await trashService.fetchTrashedItems();
        } catch (error) {
            console.error('Failed to fetch trashed items:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const restoreItem = async (itemId: string) => {
        try {
            const restoredNovel = await trashService.restoreItem(itemId);

            // 从回收站列表中移除
            const index = trashedItems.value.findIndex(item => item.id === itemId);
            if (index !== -1) {
                trashedItems.value.splice(index, 1);
            }

            // 将恢复的小说添加回主列表
            const novelStore = useNovelStore();
            novelStore.addNovel(restoredNovel);

        } catch (error){
            console.error('Failed to restore item:', error);
            alert('恢复失败，请稍后重试。');
        }
    };

    const deleteItemPermanently = async (itemId: string) => {
        if (confirm(`您确定要永久删除这个项目吗？此操作无法撤销。`)) {
            try {
                await trashService.deleteItemPermanently(itemId);
                const index = trashedItems.value.findIndex(item => item.id === itemId);
                if (index > -1) {
                    trashedItems.value.splice(index, 1);
                }
            } catch (error) {
                console.error('Failed to permanently delete item:', error);
                alert('永久删除失败，请稍后重试。');
            }
        }
    };

    return {
        trashedItems,
        isLoading,
        fetchTrashedItems,
        restoreItem,
        deleteItemPermanently
    };
});