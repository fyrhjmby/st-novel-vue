import { trashApi } from '@/workflow/api/trashApi';

export const trashService = {
    getDeletedItems: async () => {
        try {
            const data = await trashApi.fetchDeletedItems();
            return data;
        } catch (error) {
            console.error('Failed to get deleted items:', error);
            return [];
        }
    },
};