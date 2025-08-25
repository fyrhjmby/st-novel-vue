// 文件: ..\src\novel\editor\stores\derivedViewStore.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useDerivedContentStore } from './derivedContentStore';
import type { PlotAnalysisItem, EditorItem } from '@/novel/editor/types';

export const useDerivedViewStore = defineStore('derived-view', () => {
    // State
    const sourceItem = ref<EditorItem | null>(null);
    const derivedType = ref<'plot' | 'analysis' | null>(null);
    const items = ref<PlotAnalysisItem[]>([]);
    const currentIndex = ref(0);

    // Getters
    const currentItem = computed(() => items.value[currentIndex.value] || null);
    const viewTitle = computed(() => {
        if (!sourceItem.value || !derivedType.value) return '派生内容';
        const typeName = derivedType.value === 'plot' ? '剧情' : '分析';
        return `《${sourceItem.value.title}》的${typeName}`;
    });

    // Actions
    async function loadItems(source: EditorItem, type: 'plot' | 'analysis') {
        const derivedContentStore = useDerivedContentStore();
        sourceItem.value = source;
        derivedType.value = type;
        items.value = derivedContentStore.getDerivedItemsForSource(source.id, type);

        // If no items exist, create one to start with
        if (items.value.length === 0) {
            const newItem = await derivedContentStore.createManualDerivedItem(source, type);
            if (newItem) {
                items.value = [newItem];
            }
        }

        currentIndex.value = 0;
    }

    async function createNewItem() {
        if (!sourceItem.value || !derivedType.value) return;
        const derivedContentStore = useDerivedContentStore();
        const newItem = await derivedContentStore.createManualDerivedItem(sourceItem.value, derivedType.value);
        if (newItem) {
            // Reload to get the updated list and navigate to the new item
            items.value = derivedContentStore.getDerivedItemsForSource(sourceItem.value.id, derivedType.value);
            currentIndex.value = items.value.findIndex(i => i.id === newItem.id);
        }
    }

    function goToIndex(index: number) {
        if (index >= 0 && index < items.value.length) {
            currentIndex.value = index;
        }
    }

    function nextItem() {
        if (currentIndex.value < items.value.length - 1) {
            currentIndex.value++;
        }
    }

    function prevItem() {
        if (currentIndex.value > 0) {
            currentIndex.value--;
        }
    }

    return {
        sourceItem,
        derivedType,
        items,
        currentIndex,
        currentItem,
        viewTitle,
        loadItems,
        createNewItem,
        goToIndex,
        nextItem,
        prevItem
    };
});