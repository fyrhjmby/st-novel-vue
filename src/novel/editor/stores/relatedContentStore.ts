// 文件: ..\src\novel\editor\stores\relatedContentStore.ts
import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import * as nodeOperationService from '@/novel/editor/services/related/nodeOperationService';
import * as treeBuilderService from '@/novel/editor/services/related/treeBuilderService';
import { updateAllOverviewContent } from '@/novel/editor/services/related/overviewService';
import { relatedContentService } from '@/novel/editor/services/relatedContentService';
import { useDirectoryStore } from '@/novel/editor/stores/directoryStore';
import { useDerivedContentStore } from '@/novel/editor/stores/derivedContentStore';
import { usePromptTemplateStore } from '@/novel/editor/stores/promptTemplateStore';
import type { TreeNode, ItemNode, GroupNode } from '@/novel/editor/types';

export const useRelatedContentStore = defineStore('relatedContent', () => {
    const settingsData = ref<TreeNode[]>([]);
    const plotCustomData = ref<ItemNode[]>([]);
    const analysisCustomData = ref<ItemNode[]>([]);
    const othersCustomData = ref<ItemNode[]>([]);
    const novelId = ref<string | null>(null);

    const directoryStore = useDirectoryStore();
    const derivedContentStore = useDerivedContentStore();
    const promptTemplateStore = usePromptTemplateStore();

    const relatedData = computed(() => {
        const allValidSourceIds = new Set(directoryStore.directoryData.flatMap(v => [v.id, ...v.chapters.map(c => c.id)]));
        const validPlotItems = derivedContentStore.plotItems.filter(i => allValidSourceIds.has(i.sourceId));
        const validAnalysisItems = derivedContentStore.analysisItems.filter(i => allValidSourceIds.has(i.sourceId));

        return treeBuilderService.buildRelatedTree(
            settingsData.value,
            plotCustomData.value,
            analysisCustomData.value,
            othersCustomData.value,
            promptTemplateStore.promptTree,
            validPlotItems,
            validAnalysisItems,
            directoryStore.directoryData
        );
    });

    const allDataSourcesForFind = computed(() => [
        settingsData.value,
        plotCustomData.value,
        analysisCustomData.value,
        othersCustomData.value
    ]);

    watch(settingsData, (newData) => {
        updateAllOverviewContent(newData);
    }, { deep: true });

    async function fetchRelatedContent(id: string) {
        novelId.value = id;
        promptTemplateStore.initialize();
        try {
            const data = await relatedContentService.getRelatedContent(id);
            settingsData.value = data.settingsData;
            plotCustomData.value = data.plotCustomData;
            analysisCustomData.value = data.analysisCustomData;
            othersCustomData.value = data.othersCustomData;
        } catch (error) {
            console.error(`Failed to fetch related content for novel ${id}:`, error);
        }
    }

    async function saveRelatedContent() {
        if (!novelId.value) return;
        await relatedContentService.saveRelatedContent(novelId.value, {
            settingsData: settingsData.value,
            plotCustomData: plotCustomData.value,
            analysisCustomData: analysisCustomData.value,
            othersCustomData: othersCustomData.value
        });
    }

    function findNodeById(nodeId: string): { node: TreeNode; parent: TreeNode | null; } | null {
        const findRecursive = (nodes: TreeNode[], parent: TreeNode | null): { node: TreeNode; parent: TreeNode | null; } | null => {
            for (const node of nodes) {
                if (node.id === nodeId) {
                    return { node, parent };
                }
                if (node.children) {
                    const found = findRecursive(node.children, node);
                    if (found) return found;
                }
            }
            return null;
        };

        for (const source of allDataSourcesForFind.value) {
            const result = findRecursive(source, null);
            if (result) return result;
        }
        return null;
    }

    function updateNodeContent(nodeId: string, content: string) {
        const result = findNodeById(nodeId);
        if (result?.node && 'content' in result.node) {
            nodeOperationService.updateNodeContent(result.node as ItemNode, content);
        }
    }

    function appendNodeContent(nodeId: string, contentToAppend: string, isAutoApplied: boolean) {
        const result = findNodeById(nodeId);
        if (result?.node && 'content' in result.node) {
            nodeOperationService.appendNodeContent(result.node as ItemNode, contentToAppend, isAutoApplied);
        }
    }

    function renameRelatedNode(nodeId: string, newTitle: string) {
        const trimmedTitle = newTitle.trim();
        if (!trimmedTitle) return;
        const result = findNodeById(nodeId);
        if (result?.node) {
            nodeOperationService.renameNode(result.node, trimmedTitle);
        }
    }

    function addRelatedNode(parentId: string, type: 'group' | 'item'): ItemNode | GroupNode | null {
        const result = findNodeById(parentId);
        if (!result?.node || !result.node.children) return null;

        const parentNode = result.node as GroupNode;
        const newNode = nodeOperationService.createRelatedNode(parentNode, type);
        parentNode.children.push(newNode);
        return newNode;
    }

    function addCustomRelatedNode(target: 'plot' | 'analysis'): ItemNode {
        const dataRef = target === 'plot' ? plotCustomData : analysisCustomData;
        const newNode = nodeOperationService.createCustomNode(target);
        dataRef.value.unshift(newNode);
        return newNode;
    }

    function addCustomOthersNode(): ItemNode {
        const newNode = nodeOperationService.createCustomNode('others');
        othersCustomData.value.unshift(newNode);
        return newNode;
    }

    function deleteNode(nodeId: string): boolean {
        const findAndRemove = (nodes: TreeNode[], id: string): boolean => {
            const index = nodes.findIndex(node => node.id === id);
            if (index !== -1) {
                nodes.splice(index, 1);
                return true;
            }
            for (const node of nodes) {
                if (node.children && findAndRemove(node.children, id)) {
                    return true;
                }
            }
            return false;
        };

        return findAndRemove(settingsData.value, nodeId) ||
            findAndRemove(plotCustomData.value, nodeId) ||
            findAndRemove(analysisCustomData.value, nodeId) ||
            findAndRemove(othersCustomData.value, nodeId);
    }

    const deleteRelatedNode = deleteNode;
    const deleteCustomRelatedNode = deleteNode;
    const deleteCustomOthersNode = deleteNode;

    const renameCustomRelatedNode = renameRelatedNode;
    const renameCustomOthersNode = renameRelatedNode;

    return {
        settingsData,
        plotCustomData,
        analysisCustomData,
        othersCustomData,
        relatedData,
        fetchRelatedContent,
        saveRelatedContent,
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