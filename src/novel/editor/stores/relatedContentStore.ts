// 文件: src/novel/editor/stores/relatedContentStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useEditorStore } from './editorStore';
import { useUIStore } from './uiStore';
import { useDirectoryStore } from './directoryStore';
import { useDerivedContentStore } from './derivedContentStore';
import { getIconByNodeType } from '@/novel/editor/utils/iconUtils';
import type { TreeNode, RootNode, GroupNode, ItemNode, OverviewNode } from '@/novel/editor/types';

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

export const useRelatedContentStore = defineStore('relatedContent', () => {
    const settingsData = ref<TreeNode[]>([]);
    const plotCustomData = ref<TreeNode[]>([]);
    const analysisCustomData = ref<TreeNode[]>([]);

    const findNodeById = (nodeId: string): { node: TreeNode; parent: TreeNode | null; siblings: TreeNode[] } | null => {
        const sources = [settingsData.value, plotCustomData.value, analysisCustomData.value];
        for (const source of sources) {
            const result = _findNodeInTreeRecursive(source, nodeId);
            if (result) return result;
        }
        return null;
    }

    const processedSettingsData = computed((): TreeNode[] => {
        const clonedData: TreeNode[] = JSON.parse(JSON.stringify(settingsData.value));
        const overviewGroups = ['characters', 'locations', 'items', 'worldview'];

        const findAndProcess = (nodes: TreeNode[]) => {
            for (const node of nodes) {
                if (node.type === 'group' && overviewGroups.includes(node.id) && node.children) {
                    const group = node as GroupNode;
                    const itemsToSummarize = group.children.filter(child => child.type.endsWith('_item')) as ItemNode[];

                    const demoteHeadings = (htmlContent: string): string => {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = htmlContent;
                        const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5');
                        headings.forEach(heading => {
                            const level = parseInt(heading.tagName.charAt(1), 10);
                            const newLevel = Math.min(6, level + 1);
                            const newHeading = document.createElement(`h${newLevel}`);
                            newHeading.innerHTML = heading.innerHTML;
                            for (const attr of heading.attributes) {
                                newHeading.setAttribute(attr.name, attr.value);
                            }
                            heading.parentNode?.replaceChild(newHeading, heading);
                        });
                        return tempDiv.innerHTML;
                    }

                    const itemContents = itemsToSummarize.map(item => item.content ? demoteHeadings(item.content) : '').filter(Boolean);
                    const overviewContent = `<h1>${group.title}总览</h1>` + itemContents.join('<hr>');
                    const overviewId = `${group.id}-overview`;
                    const overviewType = `${group.id}_overview` as OverviewNode['type'];
                    let overviewNode = group.children.find(child => child.id === overviewId);

                    const overviewNodeData: OverviewNode = {
                        id: overviewId, title: `${group.title}总览`, type: overviewType, icon: getIconByNodeType(overviewType), content: overviewContent, isOverview: true, isReadOnly: true,
                    };

                    if (overviewNode) {
                        Object.assign(overviewNode, overviewNodeData);
                    } else {
                        group.children.unshift(overviewNodeData);
                    }
                }
                if (node.children) {
                    findAndProcess(node.children);
                }
            }
        };
        findAndProcess(clonedData);
        return clonedData;
    });

    const relatedData = computed((): TreeNode[] => {
        const directoryStore = useDirectoryStore();
        const derivedContentStore = useDerivedContentStore();

        const allChapterIds = new Set(directoryStore.directoryData.flatMap(v => v.chapters.map(c => c.id)));
        for (const key of derivedContentStore.plotData.keys()) {
            if (!allChapterIds.has(key)) derivedContentStore.plotData.delete(key);
        }
        for (const key of derivedContentStore.analysisData.keys()) {
            if (!allChapterIds.has(key)) derivedContentStore.analysisData.delete(key);
        }

        const buildDerivedTree = (
            type: 'plot' | 'analysis',
            dataMap: Map<string, any>
        ): TreeNode[] => {
            return directoryStore.directoryData.map(volume => ({
                id: `${type}_vol_${volume.id}`,
                title: volume.title,
                type: `${type}_volume`,
                icon: getIconByNodeType(`${type}_volume`),
                isReadOnly: true,
                children: volume.chapters
                    .filter(chapter => dataMap.has(chapter.id))
                    .map(chapter => {
                        const item = dataMap.get(chapter.id)!;
                        return {
                            id: item.id,
                            title: item.title,
                            type: `${type}_chapter`,
                            icon: getIconByNodeType(`${type}_chapter`),
                            isReadOnly: true,
                            originalData: item
                        };
                    })
            })).filter(vol => vol.children.length > 0);
        };

        const plotTree: RootNode = {
            id: 'plot', title: '剧情', type: 'root', icon: getIconByNodeType('plot'),
            children: [...plotCustomData.value, ...buildDerivedTree('plot', derivedContentStore.plotData)]
        };
        const analysisTree: RootNode = {
            id: 'analysis', title: '分析', type: 'root', icon: getIconByNodeType('analysis'),
            children: [...analysisCustomData.value, ...buildDerivedTree('analysis', derivedContentStore.analysisData)]
        };

        return [...processedSettingsData.value, plotTree, analysisTree];
    });

    function fetchRelatedData(settings: TreeNode[], plot: TreeNode[], analysis: TreeNode[]) {
        settingsData.value = settings;
        plotCustomData.value = plot;
        analysisCustomData.value = analysis;
    }

    function updateNodeContent(nodeId: string, content: string) {
        const result = findNodeById(nodeId);
        if (result?.node && 'content' in result.node) {
            (result.node as ItemNode).content = content;
            if(!result.node.isReadOnly) {
                const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
                const newTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';
                if (newTitle && newTitle !== result.node.title) {
                    result.node.title = newTitle;
                }
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

    const addRelatedNode = (parentId: string, type: 'group' | 'item') => {
        const editorStore = useEditorStore();
        const uiStore = useUIStore();
        const result = findNodeById(parentId);
        if (!result?.node) return;

        const parentNode = result.node;
        if (!parentNode.children) parentNode.children = [];
        const itemTypePrefix = parentNode.id.replace(/s$/, '');
        const newNodeType = type === 'group' ? 'group' : `${itemTypePrefix}_item`;
        const newNodeIcon = getIconByNodeType(newNodeType);
        const newNode: TreeNode = {
            id: `${type}-${Date.now()}`,
            title: type === 'group' ? '新建分组' : '新建条目',
            type: newNodeType,
            icon: newNodeIcon,
            content: type === 'item' ? '<h1>新建条目</h1><p>请在此处填写内容...</p>' : undefined,
            children: type === 'group' ? [] : undefined,
        } as GroupNode | ItemNode;
        parentNode.children.push(newNode);
        uiStore.toggleRelatedNodeExpansion(parentId);
        uiStore.setEditingNodeId(newNode.id);
        if ('content' in newNode && newNode.content !== undefined) editorStore.openTab(newNode.id);
    };

    const renameRelatedNode = (nodeId: string, newTitle: string) => {
        const uiStore = useUIStore();
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
    };

    const deleteRelatedNode = (nodeId: string) => {
        const editorStore = useEditorStore();
        const uiStore = useUIStore();
        const result = findNodeById(nodeId);
        if (!result?.node) return;
        if (!window.confirm(`您确定要删除 "${result.node.title}" 吗？此操作无法撤销。`)) return;

        const wasRemoved = _findAndRemoveNodeInTree(settingsData.value, nodeId);
        if (wasRemoved) {
            editorStore.closeTab(nodeId);
            if (uiStore.editingNodeId === nodeId) uiStore.setEditingNodeId(null);
        }
    };

    const addCustomRelatedNode = (target: 'plot' | 'analysis') => {
        const editorStore = useEditorStore();
        const uiStore = useUIStore();
        const dataRef = target === 'plot' ? plotCustomData : analysisCustomData;
        const icon = getIconByNodeType(`${target}_item`);
        const newNode: ItemNode = {
            id: `custom-${target}-${Date.now()}`,
            title: '新建自定义条目',
            type: `${target}_item`,
            icon: icon,
            content: '<h1>新建自定义条目</h1><p>请在此处填写内容...</p>',
        };
        dataRef.value.unshift(newNode);
        uiStore.toggleRelatedNodeExpansion(target);
        uiStore.setEditingNodeId(newNode.id);
        editorStore.openTab(newNode.id);
    };

    const renameCustomRelatedNode = (nodeId: string, newTitle: string) => {
        renameRelatedNode(nodeId, newTitle);
    };

    const deleteCustomRelatedNode = (nodeId: string) => {
        const editorStore = useEditorStore();
        const uiStore = useUIStore();
        const result = findNodeById(nodeId);
        if (!result?.node) return;
        if (!window.confirm(`您确定要删除 "${result.node.title}" 吗？此操作无法撤销。`)) return;

        const wasRemoved = _findAndRemoveNodeInTree(plotCustomData.value, nodeId) || _findAndRemoveNodeInTree(analysisCustomData.value, nodeId);

        if (wasRemoved) {
            editorStore.closeTab(nodeId);
            if (uiStore.editingNodeId === nodeId) uiStore.setEditingNodeId(null);
        }
    };

    return {
        settingsData,
        plotCustomData,
        analysisCustomData,
        relatedData,
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
    };
});