
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Novel, NovelCategory } from '@/novel/types/index.ts';
import type { RecentActivityItem, DeletedItem } from '@/novel/dashboard/types.ts';
import { mockNovels, mockRecentItems, mockTrashedItems } from '@/novel/dashboard/data';

export const useDashboardStore = defineStore('novel-dashboard', () => {
    // --- State ---
    const novels = ref<Novel[]>([]);
    const recentItems = ref<RecentActivityItem[]>([]);
    const trashedItems = ref<DeletedItem[]>([]);
    const searchQuery = ref('');
    const selectedCategory = ref<NovelCategory | '全部类型'>('全部类型');


    // --- Getters / Computed ---
    const filteredNovels = computed(() => {
        return novels.value.filter(novel => {
            const matchesCategory = selectedCategory.value === '全部类型' || novel.category === selectedCategory.value;
            const matchesSearch = novel.title.includes(searchQuery.value) || novel.tags.some(tag => tag.text.includes(searchQuery.value));
            return matchesCategory && matchesSearch;
        });
    });

    const availableCategories = computed((): NovelCategory[] => {
        const categories = new Set(novels.value.map(novel => novel.category));
        return Array.from(categories);
    });

    const groupedRecentItems = computed(() => {
        const groups: { period: string; items: RecentActivityItem[] }[] = [];
        if (recentItems.value.length === 0) return groups;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const todayItems: RecentActivityItem[] = [];
        const yesterdayItems: RecentActivityItem[] = [];
        const earlierItems: RecentActivityItem[] = [];

        // 首先按时间降序排序
        const sortedItems = [...recentItems.value].sort((a, b) => new Date(b.editedAt).getTime() - new Date(a.editedAt).getTime());

        sortedItems.forEach(item => {
            const itemDate = new Date(item.editedAt);
            itemDate.setHours(0, 0, 0, 0);

            if (itemDate.getTime() === today.getTime()) {
                todayItems.push(item);
            } else if (itemDate.getTime() === yesterday.getTime()) {
                yesterdayItems.push(item);
            } else {
                earlierItems.push(item);
            }
        });

        if (todayItems.length > 0) {
            groups.push({ period: '今天', items: todayItems });
        }
        if (yesterdayItems.length > 0) {
            groups.push({ period: '昨天', items: yesterdayItems });
        }
        if (earlierItems.length > 0) {
            groups.push({ period: '更早', items: earlierItems });
        }

        return groups;
    });

    // --- Actions ---

    const fetchAllData = () => {
        // 如果已有数据，则不重复获取，防止覆盖
        if (novels.value.length > 0) {
            return;
        }

        novels.value = mockNovels;
        recentItems.value = mockRecentItems;
        trashedItems.value = mockTrashedItems;
    };

    const setSearchQuery = (query: string) => {
        searchQuery.value = query;
    };

    const setCategoryFilter = (category: NovelCategory | '全部类型') => {
        selectedCategory.value = category;
    };

    const createNovel = (data: { title: string; synopsis: string; category: NovelCategory }) => {
        const newNovel: Novel = {
            id: `novel-${Date.now()}`,
            title: data.title,
            description: data.synopsis,
            category: data.category,
            cover: `https://source.unsplash.com/random/400x500?book&sig=${Date.now()}`,
            status: { text: '编辑中', class: 'bg-green-500/90' },
            tags: [{ text: data.category, class: 'bg-gray-100 text-gray-600' }],
            chapters: 0,
            lastUpdated: '刚刚'
        };
        novels.value.unshift(newNovel);
    };

    const deleteNovel = (novelId: string) => {
        const index = novels.value.findIndex(n => n.id === novelId);
        if (index === -1) return;

        const novelToDelete = novels.value[index];
        const trashedItem: DeletedItem = {
            id: novelToDelete.id,
            name: novelToDelete.title,
            type: '小说',
            icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7H15M9 11H15M9 15H13"/></svg>',
            deletedAt: new Date().toISOString(),
            retentionDays: 30,
            retentionPercent: 100
        };

        trashedItems.value.unshift(trashedItem);
        novels.value.splice(index, 1);
    };

    const restoreNovel = (itemId: string) => {
        // 这部分逻辑依赖于一个完整的对象，而不仅仅是ID
        // 暂不实现，仅提供接口
    };

    const deleteItemPermanently = (itemId: string) => {
        const index = trashedItems.value.findIndex(item => item.id === itemId);
        if (index > -1) {
            trashedItems.value.splice(index, 1);
        }
    };


    return {
        novels,
        recentItems,
        trashedItems,
        searchQuery,
        selectedCategory,
        filteredNovels,
        availableCategories,
        groupedRecentItems,
        fetchAllData,
        setSearchQuery,
        setCategoryFilter,
        createNovel,
        deleteNovel,
        restoreNovel,
        deleteItemPermanently
    };
});