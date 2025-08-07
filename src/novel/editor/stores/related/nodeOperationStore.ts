import { defineStore } from 'pinia';
import { useItemDataStore } from './itemDataStore.ts';
import { useTreeBuilderStore } from './treeBuilderStore.ts';
import { useEditorStore } from '@novel/editor/stores/editorStore.ts';
import { useUIStore } from '@novel/editor/stores/uiStore.ts';
import { usePromptTemplateStore } from '../promptTemplateStore.ts';
import { getIconByNodeType } from '@novel/editor/utils/iconUtils.ts';
import type { TreeNode, ItemNode, GroupNode } from '@novel/editor/types';

// --- 辅助函数 ---

// 在给定的树中递归查找节点
const _findNodeInTreeRecursive = (nodes: TreeNode[], nodeId: string): { node: TreeNode; parent: TreeNode | null; siblings: TreeNode[] } | null => {
    for (const node of nodes) {
        if (node.id === nodeId) {
            return { node, parent: null, siblings: nodes };
        }
        if (node.children) {
            const foundInChild = _findNodeInTreeRecursive(node.children, nodeId);
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

// 在给定的树中查找并移除节点
const _findAndRemoveNodeInTree = (nodes: TreeNode[], nodeId: string): boolean => {
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === nodeId) {
            nodes.splice(i, 1);
            return true;
        }
        if (nodes[i].children && _findAndRemoveNodeInTree(nodes[i].children, nodeId)) {
            return true;
        }
    }
    return false;
}

export const useNodeOperationStore = defineStore('related-node-operations', () => {
    const itemDataStore = useItemDataStore();
    const treeBuilderStore = useTreeBuilderStore();
    const editorStore = useEditorStore();
    const uiStore = useUIStore();
    const promptTemplateStore = usePromptTemplateStore();

    /**
     * 在所有相关内容数据中查找节点
     * @param nodeId - 要查找的节点ID
     */
    function findNodeById(nodeId: string): { node: TreeNode; parent: TreeNode | null; siblings: TreeNode[] } | null {
        // 先从动态树中查找，因为它包含了所有内容
        const resultInDynamicTree = _findNodeInTreeRecursive(treeBuilderStore.relatedData as TreeNode[], nodeId);
        if (resultInDynamicTree) return resultInDynamicTree;

        // 作为备用方案，在原始数据源中搜索
        const staticSources = [
            itemDataStore.settingsData,
            itemDataStore.plotCustomData,
            itemDataStore.analysisCustomData,
            itemDataStore.othersCustomData
        ];
        for (const source of staticSources) {
            const result = _findNodeInTreeRecursive(source, nodeId);
            if (result) return result;
        }

        return null;
    }

    /**
     * 更新节点内容
     * @param nodeId - 节点ID
     * @param content - 新的HTML内容
     */
    function updateNodeContent(nodeId: string, content: string) {
        const result = findNodeById(nodeId);
        if (!result?.node || !('content' in result.node)) return;

        // 特殊处理提示词条目
        if (result.node.type === 'prompt_item') {
            promptTemplateStore.updatePromptItemContent(nodeId, content);
            return;
        }

        (result.node as ItemNode).content = content;
        if (!result.node.isReadOnly) {
            const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
            const newTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';
            if (newTitle && newTitle !== result.node.title) {
                result.node.title = newTitle;
            }
        }
    }

    /**
     * 向节点追加内容
     * @param nodeId - 节点ID
     * @param contentToAppend - 要追加的原始文本
     * @param isAutoApplied - 是否为AI自动应用
     */
    function appendNodeContent(nodeId: string, contentToAppend: string, isAutoApplied: boolean) {
        const result = findNodeById(nodeId);
        if (result?.node && 'content' in result.node) {
            const itemNode = result.node as ItemNode;
            const paragraphs = contentToAppend.split('\n').map(p => `<p>${p || ' '}</p>`).join('');
            let htmlToAppend = paragraphs;
            if (isAutoApplied) {
                htmlToAppend += `<p style="font-size:0.8em; color: #9ca3af; text-align:center; margin: 1.5em 0;">--- AI生成内容已应用 ---</p>`;
            }
            if (!itemNode.content) itemNode.content = "";
            itemNode.content += htmlToAppend;
        }
    }

    /**
     * 在设定的分组下添加新节点（分组或条目）
     * @param parentId - 父节点ID
     * @param type - 'group' 或 'item'
     */
    function addRelatedNode(parentId: string, type: 'group' | 'item') {
        const result = findNodeById(parentId);
        if (!result?.node || !result.node.children) return;

        const parentNode = result.node as GroupNode;

        const itemTypePrefix = parentNode.id.endsWith('s') ? parentNode.id.slice(0, -1) : parentNode.id;
        const newNodeType = type === 'group' ? 'group' : `${itemTypePrefix}_item`;
        const newNodeIcon = getIconByNodeType(newNodeType);

        if (type === 'group') {
            const newNode: GroupNode = {
                id: `group-${Date.now()}`,
                title: '新建分组',
                type: 'group',
                icon: newNodeIcon,
                children: [],
            };
            parentNode.children.push(newNode);
            uiStore.setEditingNodeId(newNode.id);
        } else { // type === 'item'
            const newNode: ItemNode = {
                id: `item-${Date.now()}`,
                title: '新建条目',
                type: newNodeType as ItemNode['type'],
                icon: newNodeIcon,
                content: '<h1>新建条目</h1><p>请在此处填写内容...</p>',
            };
            parentNode.children.push(newNode);
            uiStore.setEditingNodeId(newNode.id);
            editorStore.openTab(newNode.id);
        }

        uiStore.ensureRelatedNodeIsExpanded(parentId);
    }

    /**
     * 重命名设定节点
     * @param nodeId - 节点ID
     * @param newTitle - 新标题
     */
    function renameRelatedNode(nodeId: string, newTitle: string) {
        if (!newTitle.trim()) {
            uiStore.setEditingNodeId(null);
            return;
        }
        const result = findNodeById(nodeId);
        if (result?.node && !result.node.isReadOnly) {
            const trimmedTitle = newTitle.trim();
            result.node.title = trimmedTitle;
            if ('content' in result.node && result.node.content && result.node.content.includes('<h1>')) {
                (result.node as ItemNode).content = (result.node as ItemNode).content.replace(/<h1[^>]*>.*?<\/h1>/, `<h1>${trimmedTitle}</h1>`);
            }
        }
        uiStore.setEditingNodeId(null);
    }

    /**
     * 删除设定节点
     * @param nodeId - 节点ID
     */
    function deleteRelatedNode(nodeId: string) {
        const result = findNodeById(nodeId);
        if (!result?.node) return;

        const wasRemoved = _findAndRemoveNodeInTree(itemDataStore.settingsData, nodeId);
        if (wasRemoved) {
            editorStore.closeTab(nodeId);
            if (uiStore.editingNodeId === nodeId) uiStore.setEditingNodeId(null);
        }
    }

    // --- Custom Related (Plot/Analysis) ---

    function addCustomRelatedNode(target: 'plot' | 'analysis') {
        const dataRef = target === 'plot' ? itemDataStore.plotCustomData : itemDataStore.analysisCustomData;
        const icon = getIconByNodeType(`${target}_item`);
        const newNode: ItemNode = {
            id: `custom-${target}-${Date.now()}`,
            title: '新建自定义条目',
            type: `${target}_item`,
            icon: icon,
            content: '<h1>新建自定义条目</h1><p>请在此处填写内容...</p>',
        };
        dataRef.unshift(newNode);
        uiStore.ensureRelatedNodeIsExpanded(target);
        uiStore.setEditingNodeId(newNode.id);
        editorStore.openTab(newNode.id);
    }

    function renameCustomRelatedNode(nodeId: string, newTitle: string) {
        renameRelatedNode(nodeId, newTitle);
    }

    function deleteCustomRelatedNode(nodeId: string) {
        const result = findNodeById(nodeId);
        if (!result?.node) return;

        const wasRemoved = _findAndRemoveNodeInTree(itemDataStore.plotCustomData, nodeId) || _findAndRemoveNodeInTree(itemDataStore.analysisCustomData, nodeId);

        if (wasRemoved) {
            editorStore.closeTab(nodeId);
            if (uiStore.editingNodeId === nodeId) uiStore.setEditingNodeId(null);
        }
    }

    // --- Custom Others ---

    function addCustomOthersNode() {
        const icon = getIconByNodeType('others_item');
        const newNode: ItemNode = {
            id: `custom-others-${Date.now()}`,
            title: '新建其他条目',
            type: 'others_item',
            icon: icon,
            content: '<h1>新建其他条目</h1><p>请在此处填写内容...</p>',
        };
        itemDataStore.othersCustomData.unshift(newNode);
        uiStore.ensureRelatedNodeIsExpanded('others');
        uiStore.setEditingNodeId(newNode.id);
        editorStore.openTab(newNode.id);
    }

    function renameCustomOthersNode(nodeId: string, newTitle: string) {
        renameRelatedNode(nodeId, newTitle);
    }

    function deleteCustomOthersNode(nodeId: string) {
        const result = findNodeById(nodeId);
        if (!result?.node) return;

        const wasRemoved = _findAndRemoveNodeInTree(itemDataStore.othersCustomData, nodeId);

        if (wasRemoved) {
            editorStore.closeTab(nodeId);
            if (uiStore.editingNodeId === nodeId) uiStore.setEditingNodeId(null);
        }
    }

    // --- Prompts ---
    function addPrompt(groupId: string) {
        const newPrompt = promptTemplateStore.addPromptItem(groupId, '新建提示词', '在这里输入你的提示词模板...');
        if (newPrompt) {
            uiStore.ensureRelatedNodeIsExpanded(groupId);
            editorStore.openTab(newPrompt.id);
            uiStore.setEditingNodeId(newPrompt.id);
        }
    }

    function renamePrompt(promptId: string, newTitle: string) {
        if (!newTitle.trim()) {
            uiStore.setEditingNodeId(null);
            return;
        }
        promptTemplateStore.renamePromptItem(promptId, newTitle.trim());
        uiStore.setEditingNodeId(null);
    }

    function deletePrompt(promptId: string) {
        if (promptTemplateStore.deletePromptItem(promptId)) {
            editorStore.closeTab(promptId);
        }
    }

    return {
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
        addPrompt,
        renamePrompt,
        deletePrompt,
    };
});