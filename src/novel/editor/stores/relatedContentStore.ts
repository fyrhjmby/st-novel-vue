// 文件: src/novel/editor/stores/relatedContentStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { RelatedTree, PlotAnalysisItem } from '@/novel/editor/types';
import { useEditorStore } from './editorStore';
import { useUIStore } from './uiStore';
import { useDirectoryStore } from './directoryStore';
import { getIconByNodeType } from '@/novel/editor/utils/iconUtils';

const _findNodeInTreeRecursive = (nodes: RelatedTree[], nodeId: string): { node: RelatedTree; parent: RelatedTree | null; siblings: RelatedTree[] } | null => {
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

const _findAndRemoveNodeInTree = (nodes: RelatedTree[], nodeId: string): boolean => {
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
    const directoryStore = useDirectoryStore();

    const settingsData = ref<RelatedTree[]>([]);
    const plotCustomData = ref<RelatedTree[]>([]);
    const analysisCustomData = ref<RelatedTree[]>([]);
    const plotData = ref<Map<string, PlotAnalysisItem>>(new Map());
    const analysisData = ref<Map<string, PlotAnalysisItem>>(new Map());

    const _findNodeInSettingsOrCustom = (nodeId: string): { node: RelatedTree; parent: RelatedTree | null; siblings: RelatedTree[] } | null => {
        const sources = [settingsData.value, plotCustomData.value, analysisCustomData.value];
        for (const source of sources) {
            const result = _findNodeInTreeRecursive(source, nodeId);
            if (result) return result;
        }
        return null;
    }

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

    const relatedData = computed((): RelatedTree[] => {
        const allChapterIds = new Set(directoryStore.directoryData.flatMap(v => v.chapters.map(c => c.id)));
        for (const key of plotData.value.keys()) {
            if (!allChapterIds.has(key)) plotData.value.delete(key);
        }
        for (const key of analysisData.value.keys()) {
            if (!allChapterIds.has(key)) analysisData.value.delete(key);
        }

        const buildDerivedTree = (
            type: 'plot' | 'analysis',
            dataMap: Map<string, PlotAnalysisItem>
        ): RelatedTree[] => {
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

        const plotTree: RelatedTree = {
            id: 'plot', title: '剧情', type: 'root', icon: getIconByNodeType('plot'),
            children: [...plotCustomData.value, ...buildDerivedTree('plot', plotData.value)]
        };
        const analysisTree: RelatedTree = {
            id: 'analysis', title: '分析', type: 'root', icon: getIconByNodeType('analysis'),
            children: [...analysisCustomData.value, ...buildDerivedTree('analysis', analysisData.value)]
        };

        return [...processedSettingsData.value, plotTree, analysisTree];
    });

    function fetchRelatedData(settings: RelatedTree[], plot: RelatedTree[], analysis: RelatedTree[]) {
        settingsData.value = settings;
        plotCustomData.value = plot;
        analysisCustomData.value = analysis;
    }

    function ensureDerivedItemExists(itemId: string) {
        const [type, sourceChapterId] = itemId.split(/_(.+)/);
        if (!type || !sourceChapterId) return;

        const dataMap = type === 'plot' ? plotData.value : analysisData.value;
        if (dataMap.has(sourceChapterId)) return;

        const chapterResult = directoryStore.findNodeById(sourceChapterId);
        if (!chapterResult || chapterResult.node.type !== 'chapter') return;
        const chapter = chapterResult.node;

        const suffix = type === 'plot' ? ' 剧情' : ' 分析';
        const newItem: PlotAnalysisItem = {
            id: itemId,
            sourceChapterId: sourceChapterId,
            title: `${chapter.title}${suffix}`,
            content: `<h1>${chapter.title}${suffix}</h1><p>AI正在生成内容，请稍候...</p>`
        };
        dataMap.set(sourceChapterId, newItem);
    }

    function findItemFromDerivedMaps(nodeId: string): PlotAnalysisItem | null {
        const [type, sourceChapterId] = nodeId.split(/_(.+)/);
        if (!type || !sourceChapterId) return null;

        const dataMap = type === 'plot' ? plotData.value : (type === 'analysis' ? analysisData.value : null);
        return dataMap?.get(sourceChapterId) ?? null;
    }

    function updateNodeContent(nodeId: string, content: string) {
        const derivedItem = findItemFromDerivedMaps(nodeId);
        if (derivedItem) {
            derivedItem.content = content;
            const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
            const newTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : derivedItem.title;
            if (newTitle) {
                derivedItem.title = newTitle;
            }
            return;
        }

        const result = _findNodeInSettingsOrCustom(nodeId);
        if (result?.node && 'content' in result.node) {
            result.node.content = content;
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
        const derivedItem = findItemFromDerivedMaps(nodeId);
        if (derivedItem) {
            const paragraphs = contentToAppend.split('\n').map(p => `<p>${p || ' '}</p>`).join('');
            let htmlToAppend = paragraphs;
            if (isAutoApplied) {
                htmlToAppend += `<p style="font-size:0.8em; color: #9ca3af; text-align:center; margin: 1.5em 0;">--- AI生成内容已应用 ---</p>`;
            }
            if (!derivedItem.content) derivedItem.content = "";
            derivedItem.content += htmlToAppend;
            return;
        }

        const result = _findNodeInSettingsOrCustom(nodeId);
        if (result?.node && 'content' in result.node) {
            const paragraphs = contentToAppend.split('\n').map(p => `<p>${p || ' '}</p>`).join('');
            let htmlToAppend = paragraphs;
            if (isAutoApplied) {
                htmlToAppend += `<p style="font-size:0.8em; color: #9ca3af; text-align:center; margin: 1.5em 0;">--- AI生成内容已应用 ---</p>`;
            }
            if (!result.node.content) result.node.content = "";
            result.node.content += htmlToAppend;
        }
    }

    const addRelatedNode = (parentId: string, type: 'group' | 'item') => {
        const editorStore = useEditorStore();
        const uiStore = useUIStore();
        const result = _findNodeInSettingsOrCustom(parentId);
        if (!result?.node) return;

        const parentNode = result.node;
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

    const renameRelatedNode = (nodeId: string, newTitle: string) => {
        const uiStore = useUIStore();
        if (!newTitle.trim()) {
            uiStore.setEditingNodeId(null);
            return;
        }

        const result = _findNodeInSettingsOrCustom(nodeId);
        if (result?.node && !result.node.isReadOnly) {
            const trimmedTitle = newTitle.trim();
            result.node.title = trimmedTitle;
            if (result.node.content && result.node.content.includes('<h1>')) {
                result.node.content = result.node.content.replace(/<h1[^>]*>.*?<\/h1>/, `<h1>${trimmedTitle}</h1>`);
            }
        }
        uiStore.setEditingNodeId(null);
    };

    const deleteRelatedNode = (nodeId: string) => {
        const editorStore = useEditorStore();
        const uiStore = useUIStore();
        const result = _findNodeInSettingsOrCustom(nodeId);
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
        const result = _findNodeInSettingsOrCustom(nodeId);
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
        plotData,
        analysisData,
        relatedData,
        fetchRelatedData,
        updateNodeContent,
        appendNodeContent,
        ensureDerivedItemExists,
        findItemFromDerivedMaps,
        addRelatedNode,
        renameRelatedNode,
        deleteRelatedNode,
        addCustomRelatedNode,
        renameCustomRelatedNode,
        deleteCustomRelatedNode,
    };
});