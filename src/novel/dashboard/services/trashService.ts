import * as trashApi from '../api/trashApi';
import type { DeletedItem, NovelDashboardItem } from '@/novel/types';

export const fetchTrashedItems = (): Promise<DeletedItem[]> => {
    return trashApi.fetchTrashedItems();
};

export const restoreItem = (itemId: string): Promise<NovelDashboardItem> => {
    return trashApi.restoreItem(itemId);
};

export const deleteItemPermanently = (itemId: string): Promise<void> => {
    return trashApi.deleteItemPermanently(itemId);
};