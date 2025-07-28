// 文件: src/novel/editor/stores/relatedContentStore.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { RelatedTree, Volume } from '@/novel/editor/types';
import { useEditorStore } from './editorStore';
import { useUIStore } from './uiStore';
import { useDirectoryStore } from './directoryStore';
import { getIconByNodeType } from '@/novel/editor/utils/iconUtils';

export const useRelatedContentStore = defineStore('relatedContent', () => {
    // --- State ---
    const settingsData = ref<RelatedTree[]>([]);
    const plotCustomData = ref<RelatedTree[]>([]);
    const analysisCustomData = ref<RelatedTree[]>([]);

    // --- Private Helpers ---
    const _findNodeRecursive = (nodes: RelatedTree[], nodeId: string): { node: RelatedTree; parent: RelatedTree | null; siblings: RelatedTree[] } | null => {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.id === nodeId) {
                return { node, parent: null, siblings: nodes };
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

    // BUG FIX: New helper to find node in the actual state, not in computed properties.
    const _findNodeInState = (nodeId: string): RelatedTree | null => {
        const sources = [settingsData.value, plotCustomData.value, analysisCustomData.value];
        for (const source of sources) {
            const result = _findNodeRecursive(source, nodeId);
            if (result) return result.node;
        }
        return null;
    }

    const _findAndRemoveNode = (nodes: RelatedTree[], nodeId: string): boolean => {
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === nodeId) {
                nodes.splice(i, 1);
                return true;
            }
            if (nodes[i].children) {
                if (_findAndRemoveNode(nodes[i].children!, nodeId)) {
                    return true;
                }
            }
        }
        return false;
    }

    const _generateMirroredTree = (sourceNodes: Volume[], prefix: string, suffix: string, iconMap: { volume: string; chapter: string }): RelatedTree[] => {
        return sourceNodes.map(volume => ({
            id: `${prefix}_vol_${volume.id}`,
            title: `${volume.title}${suffix}`,
            type: `${prefix}_volume`,
            icon: iconMap.volume,
            content: `<h1>${volume.title}${suffix}</h1><p>这是对整个卷的派生内容占位符。</p>`,
            children: volume.chapters.map(chapter => ({
                id: `${prefix}_ch_${chapter.id}`,
                title: `${chapter.title}${suffix}`,
                type: `${prefix}_chapter`,
                icon: iconMap.chapter,
                content: `<h1>${chapter.title}${suffix}</h1><p>这是对章节的派生内容占位符，可以用于撰写相关剧情或进行分析。</p>`,
            }))
        }));
    };

    // --- Getters & Computed ---
    const mirroredPlotTree = computed(() => {
        const directoryStore = useDirectoryStore();
        return _generateMirroredTree(directoryStore.directoryData, 'plot', ' 剧情', { volume: getIconByNodeType('plot_volume'), chapter: getIconByNodeType('plot_chapter') });
    });

    const mirroredAnalysisTree = computed(() => {
        const directoryStore = useDirectoryStore();
        return _generateMirroredTree(directoryStore.directoryData, 'analysis', ' 分析', { volume: getIconByNodeType('analysis_volume'), chapter: getIconByNodeType('analysis_chapter') });
    });

    const processedSettingsData = computed(() => {
        const clonedData: RelatedTree[] = JSON.parse(JSON.stringify(settingsData.value));
        const overviewGroups = ['characters', 'locations', 'items', 'worldview'];

        const findAndProcess = (nodes: RelatedTree[]) => {
            for (const node of nodes) {
                if (node.type === 'group' && overviewGroups.includes(node.id) && node.children) {
                    const group = node;
                    const itemsToSummarize = group.children.filter(child => child.type.endsWith('_item'));

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

                    const itemContents = itemsToSummarize.map(item => {
                        return item.content ? demoteHeadings(item.content) : '';
                    }).filter(Boolean);

                    const overviewContent = `<h1>${group.title}总览</h1>` + itemContents.join('<hr>');

                    const overviewId = `${group.id}-overview`;
                    const overviewType = `${group.id}_overview`;
                    let overviewNode = group.children.find(child => child.id === overviewId);

                    const overviewNodeData: RelatedTree = {
                        id: overviewId,
                        title: `${group.title}总览`,
                        type: overviewType,
                        icon: getIconByNodeType(overviewType),
                        content: overviewContent,
                        isOverview: true,
                        isReadOnly: true,
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

    const relatedData = computed((): RelatedTree[] => {
        const plotTree: RelatedTree = {
            id: 'plot', title: '剧情', type: 'root', icon: getIconByNodeType('plot'),
            children: [...plotCustomData.value, ...mirroredPlotTree.value]
        };
        const analysisTree: RelatedTree = {
            id: 'analysis', title: '分析', type: 'root', icon: getIconByNodeType('analysis'),
            children: [...analysisCustomData.value, ...mirroredAnalysisTree.value]
        };
        return [...processedSettingsData.value, plotTree, analysisTree];
    });

    // --- Actions ---

    const fetchRelatedData = (settings: RelatedTree[], plot: RelatedTree[], analysis: RelatedTree[]) => {
        settingsData.value = settings;
        plotCustomData.value = plot;
        analysisCustomData.value = analysis;
    };

    const findNodeById = (nodeId: string) => {
        return _findNodeRecursive(relatedData.value, nodeId);
    };

    // BUG FIX: This function now correctly mutates the state.
    const updateNodeContent = (nodeId: string, content: string) => {
        const node = _findNodeInState(nodeId);
        if (node && 'content' in node) {
            node.content = content;
            const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
            const newTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';
            if (newTitle && newTitle !== node.title) {
                node.title = newTitle;
            }
        }
    };

    const appendNodeContent = (nodeId: string, contentToAppend: string, isAutoApplied: boolean) => {
        const node = _findNodeInState(nodeId);
        if (node && 'content' in node) {
            const paragraphs = contentToAppend.split('\n').map(p => `<p>${p || ' '}</p>`).join('');
            let htmlToAppend = paragraphs;
            if (isAutoApplied) {
                htmlToAppend += `<p class="ai-applied-marker">--- AI生成内容已应用 ---</p>`;
            }
            if (!node.content) {
                node.content = "";
            }
            node.content += htmlToAppend;
        }
    };

    const addRelatedNode = (parentId: string, type: 'group' | 'item') => {
        const editorStore = useEditorStore();
        const uiStore = useUIStore();
        const parentNode = _findNodeInState(parentId);
        if (!parentNode) return;

        if (!parentNode.children) parentNode.children = [];
        const itemTypePrefix = parentNode.id.replace(/s$/, '');
        const newNodeType = type === 'group' ? 'group' : `${itemTypePrefix}_item`;
        const newNodeIcon = getIconByNodeType(newNodeType);
        const newNode: RelatedTree = {
            id: `${type}-${Date.now()}`,
            title: type === 'group' ? '新建分组' : '新建条目',
            type: newNodeType,
            icon: newNodeIcon,
            content: type === 'item' ? '<h1>新建条目</h1><p>请在此处填写内容...</p>' : undefined,
            children: type === 'group' ? [] : undefined,
        };
        parentNode.children.push(newNode);
        uiStore.toggleRelatedNodeExpansion(parentId);
        uiStore.setEditingNodeId(newNode.id);
        if (newNode.content !== undefined) editorStore.openTab(newNode.id);
    };

    // BUG FIX: This function now correctly mutates the state.
    const renameRelatedNode = (nodeId: string, newTitle: string) => {
        const uiStore = useUIStore();
        if (!newTitle.trim()) {
            uiStore.setEditingNodeId(null);
            return;
        }

        const node = _findNodeInState(nodeId);
        if (node) {
            const trimmedTitle = newTitle.trim();
            node.title = trimmedTitle;
            if (node.content && node.content.includes('<h1>')) {
                node.content = node.content.replace(/<h1[^>]*>.*?<\/h1>/, `<h1>${trimmedTitle}</h1>`);
            }
        }
        uiStore.setEditingNodeId(null);
    };

    const deleteRelatedNode = (nodeId: string) => {
        const editorStore = useEditorStore();
        const uiStore = useUIStore();
        const nodeToDelete = _findNodeInState(nodeId);
        if (!nodeToDelete) return;
        if (!window.confirm(`您确定要删除 "${nodeToDelete.title}" 吗？此操作无法撤销。`)) return;

        const wasRemoved = _findAndRemoveNode(settingsData.value, nodeId);
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
        const newNode: RelatedTree = {
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
        const nodeToDelete = _findNodeInState(nodeId);
        if (!nodeToDelete) return;
        if (!window.confirm(`您确定要删除 "${nodeToDelete.title}" 吗？此操作无法撤销。`)) return;

        let wasRemoved = _findAndRemoveNode(plotCustomData.value, nodeId) || _findAndRemoveNode(analysisCustomData.value, nodeId);

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