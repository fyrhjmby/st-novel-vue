// 文件: src/novel/editor/stores/related/nodeOperationStore.ts
import { defineStore } from 'pinia';
import { useItemDataStore } from './itemDataStore.ts';
import { useEditorStore } from '@novel/editor/stores/editorStore.ts';
import { useUIStore } from '@novel/editor/stores/uiStore.ts';
import { usePromptTemplateStore } from '../promptTemplateStore.ts';
import { getIconByNodeType } from '@novel/editor/utils/iconUtils.ts';
import type { TreeNode, ItemNode, GroupNode } from '@novel/editor/types';

const _findNodeInTreeRecursive = (nodes: TreeNode[], nodeId: string): { node: TreeNode; parent: TreeNode | null; } | null => {
    for (const node of nodes) {
        if (node.id === nodeId) {
            return { node, parent: null };
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
    const promptTemplateStore = usePromptTemplateStore();

    function findNodeById(nodeId: string): { node: TreeNode; parent: TreeNode | null; } | null {
        const sources = [
            itemDataStore.settingsData,
            itemDataStore.plotCustomData,
            itemDataStore.analysisCustomData,
            itemDataStore.othersCustomData
        ];
        for (const source of sources) {
            const result = _findNodeInTreeRecursive(source, nodeId);
            if (result) return result;
        }
        const promptResult = _findNodeInTreeRecursive(promptTemplateStore.templates, nodeId);
        if (promptResult) return promptResult;

        return null;
    }

    function updateNodeContent(nodeId: string, content: string) {
        if (promptTemplateStore.findPromptById(nodeId)) {
            promptTemplateStore.updatePromptItemContent(nodeId, content);
            return;
        }

        const result = findNodeById(nodeId);
        if (!result?.node || !('content' in result.node)) return;

        (result.node as ItemNode).content = content;
        if (!result.node.isReadOnly) {
            const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
            const newTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';
            if (newTitle && newTitle !== result.node.title) {
                result.node.title = newTitle;
            }
        }
    }

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

    function addRelatedNode(parentId: string, type: 'group' | 'item') {
        const result = _findNodeInTreeRecursive(itemDataStore.settingsData, parentId);
        if (!result?.node || !result.node.children) return;

        const parentNode = result.node as GroupNode;
        const uiStore = useUIStore();
        const editorStore = useEditorStore();

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

    function renameRelatedNode(nodeId: string, newTitle: string) {
        const result = findNodeById(nodeId);
        if (result?.node && !result.node.isReadOnly && newTitle.trim()) {
            const trimmedTitle = newTitle.trim();
            result.node.title = trimmedTitle;
            if ('content' in result.node && result.node.content && result.node.content.includes('<h1>')) {
                (result.node as ItemNode).content = (result.node as ItemNode).content.replace(/<h1[^>]*>.*?<\/h1>/, `<h1>${trimmedTitle}</h1>`);
            }
        }
    }

    function deleteRelatedNode(nodeId: string) {
        const wasRemoved = _findAndRemoveNodeInTree(itemDataStore.settingsData, nodeId);
        if (wasRemoved) {
            useEditorStore().closeTab(nodeId);
        }
    }

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
        useUIStore().ensureRelatedNodeIsExpanded(target);
        useEditorStore().openTab(newNode.id);
        useUIStore().setEditingNodeId(newNode.id);
    }

    function deleteCustomRelatedNode(nodeId: string) {
        const wasRemoved = _findAndRemoveNodeInTree(itemDataStore.plotCustomData, nodeId) || _findAndRemoveNodeInTree(itemDataStore.analysisCustomData, nodeId);
        if (wasRemoved) {
            useEditorStore().closeTab(nodeId);
        }
    }

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
        useUIStore().ensureRelatedNodeIsExpanded('others');
        useEditorStore().openTab(newNode.id);
        useUIStore().setEditingNodeId(newNode.id);
    }

    function deleteCustomOthersNode(nodeId: string) {
        const wasRemoved = _findAndRemoveNodeInTree(itemDataStore.othersCustomData, nodeId);
        if (wasRemoved) {
            useEditorStore().closeTab(nodeId);
        }
    }

    function addPrompt(groupId: string) {
        const newPrompt = promptTemplateStore.addPromptItem(groupId, '新建提示词', '在这里输入你的提示词模板...');
        if (newPrompt) {
            const uiStore = useUIStore();
            const editorStore = useEditorStore();
            uiStore.ensureRelatedNodeIsExpanded(groupId);
            editorStore.openTab(newPrompt.id);
            uiStore.setEditingNodeId(newPrompt.id);
        }
    }

    function renamePrompt(promptId: string, newTitle: string) {
        if (newTitle.trim()) {
            promptTemplateStore.renamePromptItem(promptId, newTitle.trim());
        }
    }

    function deletePrompt(promptId: string) {
        if (promptTemplateStore.deletePromptItem(promptId)) {
            useEditorStore().closeTab(promptId);
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
        renameCustomRelatedNode: renameRelatedNode,
        deleteCustomRelatedNode,
        addCustomOthersNode,
        renameCustomOthersNode: renameRelatedNode,
        deleteCustomOthersNode,
        addPrompt,
        renamePrompt,
        deletePrompt,
    };
});