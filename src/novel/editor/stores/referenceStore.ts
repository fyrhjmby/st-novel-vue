import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { TreeNode } from '@/novel/editor/types';
import { referenceService } from '@/novel/editor/services/referenceService';

const _findNodeRecursive = (nodes: TreeNode[], nodeId: string): { node: TreeNode; parent: TreeNode | null; } | null => {
    for (const node of nodes) {
        if (node.id === nodeId) {
            return { node, parent: null };
        }
        if (node.children) {
            const foundInChild = _findNodeRecursive(node.children, nodeId);
            if (foundInChild) {
                if (!foundInChild.parent) {
                    foundInChild.parent = node;
                }
                return foundInChild;
            }
        }
    }
    return null;
};

export const useReferenceStore = defineStore('reference', () => {
    const referenceData = ref<TreeNode[]>([]);

    const loadReferences = async (referenceNovelIds: string[]) => {
        referenceData.value = await referenceService.buildReferenceTree(referenceNovelIds);
    };

    const findNodeById = (nodeId: string): { node: TreeNode; parent: TreeNode | null; } | null => {
        return _findNodeRecursive(referenceData.value, nodeId);
    };

    return {
        referenceData,
        loadReferences,
        findNodeById
    };
});