
import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useItemDataStore } from '@novel/editor/stores/related/itemDataStore';
import { useTreeBuilderStore } from '@novel/editor/stores/related/treeBuilderStore';
import { useNodeOperationStore } from '@novel/editor/stores/related/nodeOperationStore';
import { useOverviewStore } from '@novel/editor/stores/related/overviewStore';

export const useRelatedContentStore = defineStore('relatedContent', () => {
    // 实例化所有子模块
    const itemDataStore = useItemDataStore();
    const treeBuilderStore = useTreeBuilderStore();
    const nodeOperationStore = useNodeOperationStore();

    // 初始化总览内容的监听逻辑
    useOverviewStore();

    // --- State & Computed ---
    // 从子模块中导出状态和计算属性
    const settingsData = computed(() => itemDataStore.settingsData);
    const plotCustomData = computed(() => itemDataStore.plotCustomData);
    const analysisCustomData = computed(() => itemDataStore.analysisCustomData);
    const othersCustomData = computed(() => itemDataStore.othersCustomData);
    const relatedData = computed(() => treeBuilderStore.relatedData);

    // --- Actions ---
    // 从子模块中导出所有方法，保持接口不变
    const { fetchRelatedData } = itemDataStore;
    const {
        findNodeById,
        updateNodeContent,
        appendNodeContent,
        addRelatedNode,
        renameRelatedNode,
        deleteRelatedNode,
        addCustomRelatedNode,
        renameCustomRelatedNode,
        deleteCustomRelatedNode,
        addCustomOthersNode,
        renameCustomOthersNode,
        deleteCustomOthersNode,
    } = nodeOperationStore;

    return {
        // State & Computed
        settingsData,
        plotCustomData,
        analysisCustomData,
        othersCustomData,
        relatedData,
        // Actions
        fetchRelatedData,
        findNodeById,
        updateNodeContent,
        appendNodeContent,
        addRelatedNode,
        renameRelatedNode,
        deleteRelatedNode,
        addCustomRelatedNode,
        renameCustomRelatedNode,
        deleteCustomRelatedNode,
        addCustomOthersNode,
        renameCustomOthersNode,
        deleteCustomOthersNode,
    };
});