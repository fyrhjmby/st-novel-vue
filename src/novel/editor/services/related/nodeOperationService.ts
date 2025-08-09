// src/novel/editor/services/related/nodeOperationService.ts
import { getIconByNodeType } from '@novel/editor/utils/iconUtils.ts';
import type { TreeNode, ItemNode, GroupNode } from '@novel/editor/types';

// Private helper function
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

// Private helper function
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
};

export function findNodeById(nodeId: string, allDataSources: TreeNode[][]): { node: TreeNode; parent: TreeNode | null; } | null {
    for (const source of allDataSources) {
        const result = _findNodeInTreeRecursive(source, nodeId);
        if (result) return result;
    }
    return null;
}

export function createRelatedNode(parentNode: GroupNode, type: 'group' | 'item'): GroupNode | ItemNode {
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
        return newNode;
    } else { // type === 'item'
        const newNode: ItemNode = {
            id: `item-${Date.now()}`,
            title: '新建条目',
            type: newNodeType as ItemNode['type'],
            icon: newNodeIcon,
            content: '<h1>新建条目</h1><p>请在此处填写内容...</p>',
        };
        return newNode;
    }
}

export function createCustomNode(type: 'plot' | 'analysis' | 'others'): ItemNode {
    const itemType = type === 'others' ? 'others_item' : `${type}_item`;
    const icon = getIconByNodeType(itemType);
    const title = type === 'others' ? '新建其他条目' : '新建自定义条目';

    const newNode: ItemNode = {
        id: `custom-${type}-${Date.now()}`,
        title: title,
        type: itemType as ItemNode['type'],
        icon: icon,
        content: `<h1>${title}</h1><p>请在此处填写内容...</p>`,
    };
    return newNode;
}

export function deleteNode(nodeId: string, allDataSources: TreeNode[][]): boolean {
    for (const source of allDataSources) {
        if (_findAndRemoveNodeInTree(source, nodeId)) {
            return true;
        }
    }
    return false;
}

export function renameNode(node: TreeNode, newTitle: string) {
    if (node && !node.isReadOnly && newTitle.trim()) {
        const trimmedTitle = newTitle.trim();
        node.title = trimmedTitle;
        if ('content' in node && node.content && node.content.includes('<h1>')) {
            (node as ItemNode).content = (node as ItemNode).content.replace(/<h1[^>]*>.*?<\/h1>/, `<h1>${trimmedTitle}</h1>`);
        }
    }
}

export function updateNodeContent(node: ItemNode, content: string) {
    node.content = content;
    if (!node.isReadOnly) {
        const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
        const newTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';
        if (newTitle && newTitle !== node.title) {
            node.title = newTitle;
        }
    }
}

export function appendNodeContent(node: ItemNode, contentToAppend: string, isAutoApplied: boolean) {
    const paragraphs = contentToAppend.split('\n').map(p => `<p>${p || ' '}</p>`).join('');
    let htmlToAppend = paragraphs;
    if (isAutoApplied) {
        htmlToAppend += `<p style="font-size:0.8em; color: #9ca3af; text-align:center; margin: 1.5em 0;">--- AI生成内容已应用 ---</p>`;
    }
    if (!node.content) node.content = "";
    node.content += htmlToAppend;
}