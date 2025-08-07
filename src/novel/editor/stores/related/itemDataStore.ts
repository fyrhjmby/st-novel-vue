// src/novel/editor/stores/modules/related/itemDataStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { TreeNode } from '@novel/editor/types';

export const useItemDataStore = defineStore('related-item-data', () => {
    // 原始数据状态
    const settingsData = ref<TreeNode[]>([]);
    const plotCustomData = ref<TreeNode[]>([]);
    const analysisCustomData = ref<TreeNode[]>([]);
    const othersCustomData = ref<TreeNode[]>([]);

    /**
     * 从外部获取数据并填充 store
     * @param settings - 设定的树形数据
     * @param plot - 自定义剧情数据
     * @param analysis - 自定义分析数据
     * @param others - 其他自定义数据
     */
    function fetchRelatedData(settings: TreeNode[], plot: TreeNode[], analysis: TreeNode[], others: TreeNode[]) {
        settingsData.value = settings;
        plotCustomData.value = plot;
        analysisCustomData.value = analysis;
        othersCustomData.value = others;
    }

    return {
        settingsData,
        plotCustomData,
        analysisCustomData,
        othersCustomData,
        fetchRelatedData,
    };
});