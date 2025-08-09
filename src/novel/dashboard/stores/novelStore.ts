import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Novel, NovelCategory } from '@/novel/types';
import { mockNovels } from '@/novel/dashboard/data';
import { createNewNovelProject } from '@/novel/services/novelProjectService';
import { useTrashStore } from './trashStore';

export const useNovelStore = defineStore('novel-dashboard-novels', () => {
    const novels = ref<Novel[]>([]);
    const searchQuery = ref('');
    const selectedCategory = ref<NovelCategory | '全部类型'>('全部类型');

    const filteredNovels = computed(() => {
        return novels.value.filter(novel => {
            const matchesCategory = selectedCategory.value === '全部类型' || novel.category === selectedCategory.value;
            const matchesSearch = novel.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || novel.tags.some(tag => tag.text.toLowerCase().includes(searchQuery.value.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    });

    const availableCategories = computed((): NovelCategory[] => {
        const categories = new Set(novels.value.map(novel => novel.category));
        return Array.from(categories);
    });

    const fetchNovels = () => {
        if (novels.value.length > 0) {
            return;
        }
        novels.value = mockNovels;
    };

    const addNovel = (newNovel: Novel) => {
        novels.value.unshift(newNovel);
    };

    const createNovel = (data: { title: string; synopsis: string; category: NovelCategory }) => {
        const newNovelId = `novel-${Date.now()}`;
        const newProject = createNewNovelProject(newNovelId, data.title, data.synopsis, data.category);

        const newNovelForDashboard: Novel = {
            id: newProject.metadata.id,
            title: newProject.metadata.title,
            description: newProject.metadata.description,
            category: data.category,
            cover: newProject.metadata.cover,
            status: { text: '编辑中', class: 'bg-green-500/90' },
            tags: newProject.metadata.tags,
            chapters: 0,
            lastUpdated: '刚刚'
        };
        addNovel(newNovelForDashboard);
    };

    const deleteNovel = (novelId: string) => {
        const index = novels.value.findIndex(n => n.id === novelId);
        if (index === -1) return;

        const novelToDelete = novels.value[index];
        const trashStore = useTrashStore();
        trashStore.addItemToTrash(novelToDelete);

        novels.value.splice(index, 1);
    };

    const restoreNovel = (novel: Novel) => {
        addNovel(novel);
    };

    return {
        novels,
        searchQuery,
        selectedCategory,
        filteredNovels,
        availableCategories,
        fetchNovels,
        addNovel,
        createNovel,
        deleteNovel,
        restoreNovel
    };
});