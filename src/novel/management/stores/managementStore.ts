// 文件: src/novel/management/stores/managementStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { NovelCharacter, WorldviewCategory, NovelMetadata, NovelTag, ContextPreset, RagSearchResult } from '@/novel/management/types';
import {
    mockCharacters,
    mockWorldviewCategories,
    mockNovelMetadata,
    mockFixedContextPresets,
    mockRagSearchResults
} from '@/novel/management/data';

interface SelectedContextItem extends ContextPreset {
    wordCount: number;
}

export const useManagementStore = defineStore('novel-management', () => {
    // --- State ---
    const characters = ref<NovelCharacter[]>([]);
    const worldviewCategories = ref<WorldviewCategory[]>([]);
    const activeCharacterId = ref<string | null>(null);
    const novelMetadata = ref<NovelMetadata | null>(null);

    // Context View State
    const fixedContextPresets = ref<ContextPreset[]>([]);
    const selectedContextItems = ref<SelectedContextItem[]>([]);
    const customContextContent = ref<string>('');
    const dynamicContextSettings = ref({ prevChapters: 3, nextChapters: 2, prevVolumes: 1, nextVolumes: 1 });
    const ragQuery = ref<string>('');
    const ragSearchResults = ref<RagSearchResult[]>([]);

    // --- Getters / Computed ---
    const activeCharacter = computed(() => {
        if (!activeCharacterId.value) return null;
        return characters.value.find(c => c.id === activeCharacterId.value) ?? null;
    });

    const customContentWordCount = computed(() => {
        if (!customContextContent.value.trim()) return 0;
        return customContextContent.value.trim().split(/\s+/).length;
    });

    const totalContextWords = computed(() => {
        const fixedWords = selectedContextItems.value.reduce((sum, item) => sum + (item.wordCount || 0), 0);
        const ragWords = ragSearchResults.value
            .filter(r => r.isSelected)
            .reduce((sum, item) => sum + (item.wordCount || 0), 0);
        return fixedWords + customContentWordCount.value + ragWords;
    });

    const totalChaptersInContext = computed(() => dynamicContextSettings.value.prevChapters + dynamicContextSettings.value.nextChapters);

    const averageRagRelevance = computed(() => {
        const selectedResults = ragSearchResults.value.filter(r => r.isSelected);
        if (selectedResults.length === 0) return 0;
        const totalRelevance = selectedResults.reduce((sum, r) => sum + r.relevance, 0);
        return Math.round(totalRelevance / selectedResults.length);
    });

    // --- Actions ---

    const fetchData = (novelId: string) => {
        console.log(`Fetching management data for novel: ${novelId}`);
        if (novelMetadata.value?.id === novelId && characters.value.length > 0) return;

        characters.value = JSON.parse(JSON.stringify(mockCharacters));
        worldviewCategories.value = JSON.parse(JSON.stringify(mockWorldviewCategories));
        novelMetadata.value = JSON.parse(JSON.stringify(mockNovelMetadata));

        // Context View Data
        fixedContextPresets.value = JSON.parse(JSON.stringify(mockFixedContextPresets));
        ragSearchResults.value = JSON.parse(JSON.stringify(mockRagSearchResults));

        if (characters.value.length > 0) {
            activeCharacterId.value = characters.value[0].id;
        }

        // Initialize some context data for demonstration
        if (selectedContextItems.value.length === 0 && fixedContextPresets.value.length > 0) {
            const firstPreset = fixedContextPresets.value[0];
            selectedContextItems.value.push({ ...firstPreset, wordCount: firstPreset.content.length });
        }
        if (customContextContent.value === '') {
            customContextContent.value = '这是小说的主题：探索与回归。';
        }
    };

    const addFixedContextItem = (itemId: string) => {
        if (!itemId) return;
        const preset = fixedContextPresets.value.find(p => p.id === itemId);
        if (preset && !selectedContextItems.value.some(item => item.id === itemId)) {
            selectedContextItems.value.push({ ...preset, wordCount: preset.content.length });
        }
    };

    const removeFixedContextItem = (index: number) => {
        selectedContextItems.value.splice(index, 1);
    };

    const setActiveCharacter = (characterId: string) => {
        activeCharacterId.value = characterId;
    };

    const updateCharacter = (characterData: Partial<NovelCharacter>) => {
        if (!activeCharacter.value) return;
        Object.assign(activeCharacter.value, characterData);
    };

    const createNewCharacter = () => {
        const newChar: NovelCharacter = { id: `char-${Date.now()}`, name: '新角色', avatar: '', identity: '待定', summary: '', status: 'draft' };
        characters.value.unshift(newChar);
        activeCharacterId.value = newChar.id;
    };

    const saveChanges = () => {
        if (!activeCharacter.value) return;
        console.log('Saving character:', JSON.parse(JSON.stringify(activeCharacter.value)));
        alert('角色信息已保存！');
    };

    const deleteCharacter = (characterId: string) => {
        const index = characters.value.findIndex(c => c.id === characterId);
        if (index > -1 && window.confirm(`确定删除角色 "${characters.value[index].name}"?`)) {
            characters.value.splice(index, 1);
            if (activeCharacterId.value === characterId) {
                activeCharacterId.value = characters.value.length ? characters.value[0].id : null;
            }
        }
    };

    const removeTag = (tagIndex: number) => {
        if (novelMetadata.value) novelMetadata.value.tags.splice(tagIndex, 1);
    };

    const addTag = () => {
        if (!novelMetadata.value) return;
        const newTagText = prompt("输入新标签:");
        if (newTagText?.trim()) {
            novelMetadata.value.tags.push({ text: newTagText, class: 'bg-gray-100 text-gray-800' });
        }
    };

    const saveMetadata = () => {
        if (!novelMetadata.value) return;
        console.log('Saving metadata:', JSON.parse(JSON.stringify(novelMetadata.value)));
        alert('小说设置已保存！');
    };

    return {
        characters, worldviewCategories, activeCharacterId, novelMetadata, fixedContextPresets, selectedContextItems, customContextContent, dynamicContextSettings, ragQuery, ragSearchResults,
        activeCharacter, customContentWordCount, totalContextWords, totalChaptersInContext, averageRagRelevance,
        fetchData, setActiveCharacter, updateCharacter, createNewCharacter, saveChanges, deleteCharacter,
        removeTag, addTag, saveMetadata,
        addFixedContextItem, removeFixedContextItem,
    };
});