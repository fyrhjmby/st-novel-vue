// src/novel/dashboard/stores/novelStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { NovelDashboardItem, NovelCategory } from '@/novel/types';
import * as novelService from '@/novel/dashboard/services/novelService';

export const useNovelStore = defineStore('novel-dashboard-novels', () => {
    const novels = ref<NovelDashboardItem[]>([]);
    const availableCategories = ref<NovelCategory[]>([]);
    const searchQuery = ref('');
    const selectedCategory = ref<NovelCategory | '全部类型'>('全部类型');
    const isLoading = ref(false);

    const filteredNovels = computed(() => {
        return novels.value.filter(novel => {
            const matchesCategory = selectedCategory.value === '全部类型' || novel.category === selectedCategory.value;
            const matchesSearch = novel.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || novel.tags.some(tag => tag.text.toLowerCase().includes(searchQuery.value.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    });

    const fetchNovels = async () => {
        isLoading.value = true;
        try {
            novels.value = await novelService.fetchNovels();
        } catch (error) {
            console.error('Failed to fetch novels:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchCategories = async () => {
        try {
            availableCategories.value = await novelService.fetchAvailableCategories();
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const initializeDashboard = () => {
        fetchNovels();
        fetchCategories();
    };

    const addNovel = (newNovel: NovelDashboardItem) => {
        novels.value.unshift(newNovel);
    };

    const createNovel = async (data: { title: string; synopsis: string; category: NovelCategory }) => {
        try {
            const newNovel = await novelService.createNovel(data);
            addNovel(newNovel);
        } catch (error) {
            console.error('Failed to create novel:', error);
            // 这里可以添加用户反馈，例如弹窗提示
        }
    };

    const deleteNovel = async (novelId: string) => {
        try {
            await novelService.moveToTrash(novelId);
            const index = novels.value.findIndex(n => n.id === novelId);
            if (index !== -1) {
                novels.value.splice(index, 1);
            }
        } catch (error) {
            console.error('Failed to delete novel:', error);
        }
    };

    return {
        novels,
        searchQuery,
        selectedCategory,
        filteredNovels,
        availableCategories,
        isLoading,
        initializeDashboard,
        fetchNovels,
        addNovel,
        createNovel,
        deleteNovel,
    };
});