// 文件: src\novel\editor\composables\useDirectoryTreeAdapter.ts
import { computed } from 'vue';
import { useDirectoryStore } from '@/novel/editor/stores/directoryStore';
import { useEditorStore } from '@/novel/editor/stores/editorStore';
import { useUIStore } from '@/novel/editor/stores/uiStore';
import { getIconByNodeType } from '@/novel/editor/utils/iconUtils';
import type { TreeNode, VolumeNode } from '@/novel/editor/types';

export function useDirectoryTreeAdapter() {
    const directoryStore = useDirectoryStore();
    const editorStore = useEditorStore();
    const uiStore = useUIStore();

    const treeNodes = computed((): VolumeNode[] => {
        return directoryStore.directoryData.map(volume => ({
            id: volume.id,
            title: volume.title,
            icon: getIconByNodeType(volume.type),
            type: 'volume',
            content: volume.content,
            originalData: volume,
            children: volume.chapters.map(chapter => ({
                id: chapter.id,
                title: chapter.title,
                icon: getIconByNodeType(chapter.type),
                type: 'chapter',
                status: chapter.status,
                content: chapter.content,
                originalData: chapter,
            })),
        }));
    });

    const activeNodeId = computed(() => editorStore.activeTabId);
    const expandedNodeIds = computed(() => uiStore.uiState.expandedNodeIds);
    const editingNodeId = computed(() => uiStore.editingNodeId);

    const handleSelectNode = (node: TreeNode) => {
        if (node.type === 'chapter' || node.type === 'volume') {
            editorStore.openTab(node.id);
        } else if (node.children && node.children.length > 0) {
            uiStore.toggleNodeExpansion(node.id);
        }
    };

    const handleToggleExpansion = (id: string) => {
        uiStore.toggleNodeExpansion(id);
    };

    const handleCommitRename = (payload: { nodeId: string; newTitle: string; }) => {
        directoryStore.renameNode(payload.nodeId, payload.newTitle);
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