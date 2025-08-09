import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Novel } from '@/novel/types';
import type { DeletedItem } from '@/novel/dashboard/types';
import { mockTrashedItems, mockNovels } from '@/novel/dashboard/data';
import { useNovelStore } from './novelStore';

export const useTrashStore = defineStore('novel-dashboard-trash', () => {
    const trashedItems = ref<DeletedItem[]>([]);

    const fetchTrashedItems = () => {
        if (trashedItems.value.length > 0) {
            return;
        }
        trashedItems.value = mockTrashedItems;
    };

    const addItemToTrash = (novel: Novel) => {
        const trashedItem: DeletedItem = {
            id: novel.id,
            name: novel.title,
            type: '小说',
            icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7H15M9 11H15M9 15H13"/></svg>',
            deletedAt: new Date().toISOString(),
            retentionDays: 30,
            retentionPercent: 100,
        };
        trashedItems.value.unshift(trashedItem);
    };

    const restoreItem = (itemId: string) => {
        const index = trashedItems.value.findIndex(item => item.id === itemId);
        if (index === -1) return;

        // 在模拟环境中，我们从原始的 mockNovels 中查找数据以模拟从数据库恢复
        const novelToRestore = mockNovels.find(n => n.id === itemId);

        if (novelToRestore) {
            const novelStore = useNovelStore();
            novelStore.restoreNovel(novelToRestore);
            trashedItems.value.splice(index, 1);
        } else {
            alert('恢复失败：未找到原始小说数据。');
        }
    };

    const deleteItemPermanently = (itemId: string) => {
        const index = trashedItems.value.findIndex(item => item.id === itemId);
        if (index > -1) {
            if (confirm(`您确定要永久删除《${trashedItems.value[index].name}》吗？此操作无法撤销。`)) {
                trashedItems.value.splice(index, 1);
            }
        }
    };

    return {
        trashedItems,
        fetchTrashedItems,
        addItemToTrash,
        restoreItem,
        deleteItemPermanently
    };
});