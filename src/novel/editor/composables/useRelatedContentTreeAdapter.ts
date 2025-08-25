// 文件: src\novel\editor\composables\useRelatedContentTreeAdapter.ts
import { computed } from 'vue';
import { useRelatedContentStore } from '@/novel/editor/stores/relatedContentStore';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import { useUIStore } from '@/novel/editor/stores/uiStore';
import { usePromptTemplateStore } from '@/novel/editor/stores/promptTemplateStore';
import type { TreeNode } from '@/novel/editor/types';

export function useRelatedContentTreeAdapter() {
    const relatedContentStore = useRelatedContentStore();
    const editorStore = useEditorStore();
    const uiStore = useUIStore();
    const promptTemplateStore = usePromptTemplateStore();

    const treeNodes = computed((): TreeNode[] => {
        return relatedContentStore.relatedData;
    });

    const activeNodeId = computed(() => editorStore.activeTabId);
    const expandedNodeIds = computed(() => uiStore.uiState.expandedRelatedNodeIds);
    const editingNodeId = computed(() => uiStore.editingNodeId);

    const handleSelectNode = (node: TreeNode) => {
        if ('content' in node && node.content !== undefined) {
            editorStore.openTab(node.id);
        } else if (node.children && node.children.length > 0) {
            uiStore.toggleRelatedNodeExpansion(node.id);
        }
    };

    const handleToggleExpansion = (id: string) => {
        uiStore.toggleRelatedNodeExpansion(id);
    };

    const handleCommitRename = (payload: { nodeId: string; newTitle: string; }) => {
        const { node } = relatedContentStore.findNodeById(payload.nodeId) || { node: null };
        const nodeType = node?.type;
        const newTitle = payload.newTitle.trim();

        if (newTitle) {
            switch (nodeType) {
                case 'prompt_item':
                    promptTemplateStore.renamePrompt(payload.nodeId, newTitle);
                    break;
                case 'others_item':
                    relatedContentStore.renameCustomOthersNode(payload.nodeId, newTitle);
                    break;
                case 'plot_item':
                case 'analysis_item':
                    if (payload.nodeId.startsWith('custom-')) {
                        relatedContentStore.renameCustomRelatedNode(payload.nodeId, newTitle);
                    } else {
                        relatedContentStore.renameRelatedNode(payload.nodeId, newTitle);
                    }
                    break;
                default:
                    relatedContentStore.renameRelatedNode(payload.nodeId, newTitle);
                    break;
            }
        }
        uiStore.setEditingNodeId(null);
    };

    const handleCancelRename = () => {
        uiStore.setEditingNodeId(null);
    };

    return {
        treeNodes,
        activeNodeId,
        expandedNodeIds,
        editingNodeId,
        handleSelectNode,
        handleToggleExpansion,
        handleCommitRename,
        handleCancelRename
    };
}