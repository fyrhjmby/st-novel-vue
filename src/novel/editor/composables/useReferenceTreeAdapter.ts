// 文件: src\novel\editor\composables\useReferenceTreeAdapter.ts
import { computed } from 'vue';
import { useReferenceStore } from '@/novel/editor/stores/referenceStore';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import { useUIStore } from '@/novel/editor/stores/uiStore';
import type { TreeNode } from '@/novel/editor/types';

export function useReferenceTreeAdapter() {
    const referenceStore = useReferenceStore();
    const editorStore = useEditorStore();
    const uiStore = useUIStore();

    const treeNodes = computed((): TreeNode[] => {
        return referenceStore.referenceData;
    });

    const activeNodeId = computed(() => editorStore.activeTabId);
    const expandedNodeIds = computed(() => uiStore.uiState.expandedReferenceNodeIds);

    const handleSelectNode = (node: TreeNode) => {
        // 如果节点有子节点，则切换其展开状态
        if (node.children && node.children.length > 0) {
            uiStore.toggleReferenceNodeExpansion(node.id);
        }
        // 如果节点是可打开的内容项，则在编辑器中打开它
        else if (node.hasOwnProperty('content')) {
            editorStore.openTab(node.id);
        }
    };

    const handleToggleExpansion = (id: string) => {
        uiStore.toggleReferenceNodeExpansion(id);
    };

    return {
        treeNodes,
        activeNodeId,
        expandedNodeIds,
        handleSelectNode,
        handleToggleExpansion,
    };
}