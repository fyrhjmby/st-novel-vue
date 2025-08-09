import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import * as nodeOperationService from '@/novel/editor/services/related/nodeOperationService';
import * as treeBuilderService from '@/novel/editor/services/related/treeBuilderService';
import { updateAllOverviewContent } from '@/novel/editor/services/related/overviewService';
import { useDirectoryStore } from '@/novel/editor/stores/directoryStore';
import { useDerivedContentStore } from '@/novel/editor/stores/derivedContentStore';
import { usePromptTemplateStore } from '@/novel/editor/stores/promptTemplateStore';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import { useUIStore } from '@/novel/editor/stores/uiStore';
import type { TreeNode, ItemNode, GroupNode } from '@/novel/editor/types';

export const useRelatedContentStore = defineStore('relatedContent', () => {
    // --- State ---
    const settingsData = ref<TreeNode[]>([]);
    const plotCustomData = ref<TreeNode[]>([]);
    const analysisCustomData = ref<TreeNode[]>([]);
    const othersCustomData = ref<TreeNode[]>([]);

    // --- Dependencies ---
    const directoryStore = useDirectoryStore();
    const derivedContentStore = useDerivedContentStore();
    const promptTemplateStore = usePromptTemplateStore();
    const editorStore = useEditorStore();
    const uiStore = useUIStore();

    // --- Computed ---
    const relatedData = computed(() => {
        // Filter out derived items whose source has been deleted
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

    const allDataSources = computed(() => [
        settingsData.value,
        plotCustomData.value,
        analysisCustomData.value,
        othersCustomData.value
    ]);

    // --- Watchers ---
    watch(settingsData, (newData) => {
        updateAllOverviewContent(newData);
    }, { deep: true });

    // --- Actions ---
    function fetchRelatedData(settings: any[], plot: any[], analysis: any[], others: any[]) {
        promptTemplateStore.initialize();
        settingsData.value = settings;
        plotCustomData.value = plot;
        analysisCustomData.value = analysis;
        othersCustomData.value = others;
    }

    function findNodeById(nodeId: string): { node: TreeNode; parent: TreeNode | null; } | null {
        return nodeOperationService.findNodeById(nodeId, allDataSources.value);
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
        const result = findNodeById(nodeId);
        if (result?.node) {
            nodeOperationService.renameNode(result.node, newTitle);
        }
    }

    // --- Action: Add ---
    function addRelatedNode(parentId: string, type: 'group' | 'item') {
        const result = findNodeById(parentId);
        if (!result?.node || !result.node.children) return;

        const parentNode = result.node as GroupNode;
        const newNode = nodeOperationService.createRelatedNode(parentNode, type);
        parentNode.children.push(newNode);

        uiStore.ensureRelatedNodeIsExpanded(parentId);
        uiStore.setEditingNodeId(newNode.id);
        if (newNode.type.endsWith('_item')) {
            editorStore.openTab(newNode.id);
        }
    }

    function addCustomRelatedNode(target: 'plot' | 'analysis') {
        const dataRef = target === 'plot' ? plotCustomData : analysisCustomData;
        const newNode = nodeOperationService.createCustomNode(target);
        dataRef.value.unshift(newNode);

        uiStore.ensureRelatedNodeIsExpanded(target);
        editorStore.openTab(newNode.id);
        uiStore.setEditingNodeId(newNode.id);
    }

    function addCustomOthersNode() {
        const newNode = nodeOperationService.createCustomNode('others');
        othersCustomData.value.unshift(newNode);
        uiStore.ensureRelatedNodeIsExpanded('others');
        editorStore.openTab(newNode.id);
        uiStore.setEditingNodeId(newNode.id);
    }

    // --- Action: Delete ---
    function deleteNode(nodeId: string): boolean {
        const wasRemoved = nodeOperationService.deleteNode(nodeId, allDataSources.value);
        if (wasRemoved) {
            editorStore.closeTab(nodeId);
        }
        return wasRemoved;
    }
    const deleteRelatedNode = deleteNode;
    const deleteCustomRelatedNode = deleteNode;
    const deleteCustomOthersNode = deleteNode;

    // --- Actions with specific naming for context menus ---
    const renameCustomRelatedNode = renameRelatedNode;
    const renameCustomOthersNode = renameRelatedNode;

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