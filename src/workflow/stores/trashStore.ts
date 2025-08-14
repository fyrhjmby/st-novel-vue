import { defineStore } from 'pinia';
import { ref } from 'vue';
import { trashService } from '@/workflow/services/trashService';
import type { DeletedItem } from '@/workflow/types';

export const useTrashStore = defineStore('trash', () => {
    const deletedItems = ref<DeletedItem[]>([]);
    const isLoading = ref(false);

    const loadDeletedItems = async () => {
        isLoading.value = true;
        try {
            deletedItems.value = await trashService.getDeletedItems();
        } catch (error) {
            console.error('Error loading deleted items in store:', error);
            deletedItems.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    return {
        deletedItems,
        isLoading,
        loadDeletedItems,
    };
});