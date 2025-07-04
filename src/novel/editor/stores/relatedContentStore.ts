import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { RelatedTree, Volume } from '@/novel/editor/types';
import { useEditorStore } from './editorStore';
import { useDirectoryStore } from './directoryStore';
import { getIconByNodeType } from '@/novel/editor/utils/iconUtils';

export const useRelatedContentStore = defineStore('relatedContent', () => {
    // --- State ---
    const settingsData = ref<RelatedTree[]>([]);
    const plotCustomData = ref<RelatedTree[]>([]);
    const analysisCustomData = ref<RelatedTree[]>([]);

    // --- Private Helpers ---

    const _findNodeRecursive = (nodes: RelatedTree[], nodeId: string): { node: RelatedTree; parent: RelatedTree | null; siblings: RelatedTree[] } | null => {
        for (const node of nodes) {
            if (node.id === nodeId) {
                return { node, parent: null, siblings: nodes };
            }
            if (node.children) {
                const found = _findNodeRecursive(node.children, nodeId);
                if (found) {
                    return { ...found, parent: found.parent || node };
                }
            }
        }
        return null;
    };

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


    // --- Getters & Computed ---

    const processedSettingsData = computed(() => {
        const clonedData: RelatedTree[] = JSON.parse(JSON.stringify(settingsData.value));
        const overviewGroups = ['characters', 'locations', 'items'];

        const findAndProcess = (nodes: RelatedTree[]) => {
            for (const node of nodes) {
                if (node.type === 'group' && overviewGroups.includes(node.id) && node.children) {
                    const overviewId = `${node.id}-overview`;
                    if (!node.children.some(child => child.id === overviewId)) {
                        const overviewNode: RelatedTree = {
                            id: overviewId,
                            title: `${node.title}总览`,
                            type: `${node.id}_item`,
                            icon: node.icon.replace(/ text-[\w\-]+$/, ''), // 移除颜色类
                            content: `<h1>${node.title}总览</h1><p>所有${node.title}的概述...</p>`
                        };
                        node.children.unshift(overviewNode);
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

    const mirroredPlotTree = computed(() => {
        const directoryStore = useDirectoryStore();
        return _generateMirroredTree(directoryStore.directoryData, 'plot', ' 剧情', { volume: 'fa-solid fa-book-bible text-rose-500', chapter: 'fa-solid fa-scroll text-rose-500' });
    });

    const mirroredAnalysisTree = computed(() => {
        const directoryStore = useDirectoryStore();
        return _generateMirroredTree(directoryStore.directoryData, 'analysis', ' 分析', { volume: 'fa-solid fa-chart-pie text-orange-500', chapter: 'fa-solid fa-chart-simple text-orange-500' });
    });

    const relatedData = computed((): RelatedTree[] => {
        const plotTree: RelatedTree = {
            id: 'plot', title: '剧情', type: 'root', icon: 'fa-solid fa-feather-pointed',
            children: [
                ...plotCustomData.value,
                ...mirroredPlotTree.value
            ]
        };
        const analysisTree: RelatedTree = {
            id: 'analysis', title: '分析', type: 'root', icon: 'fa-solid fa-magnifying-glass-chart',
            children: [
                ...analysisCustomData.value,
                ...mirroredAnalysisTree.value
            ]
        };
        return [...processedSettingsData.value, plotTree, analysisTree];
    });

    const _generateMirroredTree = (sourceNodes: Volume[], prefix: string, suffix: string, iconMap: { volume: string; chapter: string }): RelatedTree[] => {
        return sourceNodes.map(volume => ({
            id: `${prefix}-vol-${volume.id}`,
            title: `${volume.title}${suffix}`,
            type: `${prefix}_volume`,
            icon: iconMap.volume,
            content: `<h1>${volume.title}${suffix}</h1><p>这是对整个卷的派生内容占位符。</p>`,
            children: volume.chapters.map(chapter => ({
                id: `${prefix}-ch-${chapter.id}`,
                title: `${chapter.title}${suffix}`,
                type: `${prefix}_chapter`,
                icon: iconMap.chapter,
                content: `<h1>${chapter.title}${suffix}</h1><p>这是对章节的派生内容占位符，可以用于撰写相关剧情或进行分析。</p>`,
            }))
        }));
    };

    // --- Actions ---

    const findNodeById = (nodeId: string) => {
        const dataSources = [settingsData.value, plotCustomData.value, analysisCustomData.value];
        for (const source of dataSources) {
            const result = _findNodeRecursive(source, nodeId);
            if (result?.node) return result;
        }
        // Check combined trees if not found in raw data (for plot/analysis roots)
        return _findNodeRecursive(relatedData.value, nodeId);
    };

    const fetchRelatedData = (settings: RelatedTree[], plot: RelatedTree[], analysis: RelatedTree[]) => {
        settingsData.value = settings;
        plotCustomData.value = plot;
        analysisCustomData.value = analysis;
    };

    const updateNodeContent = (nodeId: string, content: string) => {
        const result = findNodeById(nodeId);
        if (result && result.node && 'content' in result.node) {
            result.node.content = content;
            const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
            const newTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';
            if (newTitle && newTitle !== result.node.title) {
                result.node.title = newTitle;
            }
        }
    };

    const addRelatedNode = (parentId: string, type: 'group' | 'item') => {
        const editorStore = useEditorStore();
        const result = findNodeById(parentId);
        if (!result?.node) return;

        const parentNode = result.node;
        if (!parentNode.children) parentNode.children = [];

        const newNodeType = type === 'group' ? 'group' : `${parentNode.id}_item`;
        const newNodeIcon = getIconByNodeType(newNodeType);

        const newNode: RelatedTree = {
            id: `${type}-${Date.now()}`,
            title: type === 'group' ? '新建分组' : '新建条目',
            type: newNodeType,
            icon: newNodeIcon,
            content: type === 'item' ? `<h1>新建条目</h1>` : undefined,
            children: type === 'group' ? [] : undefined,
        };

        parentNode.children.push(newNode);
        editorStore.toggleRelatedNodeExpansion(parentId);
        editorStore.setEditingNodeId(newNode.id);
        if (newNode.content !== undefined) editorStore.setActiveItem(newNode.id);
    };

    const renameRelatedNode = (nodeId: string, newTitle: string) => {
        const editorStore = useEditorStore();
        if (!newTitle.trim()) {
            editorStore.setEditingNodeId(null);
            return;
        }
        const result = findNodeById(nodeId);
        if (result?.node) {
            result.node.title = newTitle.trim();
            if (result.node.content) {
                result.node.content = result.node.content.replace(/<h1[^>]*>.*?<\/h1>/, `<h1>${newTitle.trim()}</h1>`);
            }
        }
        editorStore.setEditingNodeId(null);
    };

    const deleteRelatedNode = (nodeId: string) => {
        const editorStore = useEditorStore();
        const nodeToDelete = findNodeById(nodeId)?.node;
        if (!nodeToDelete) return;

        if (!window.confirm(`您确定要删除 "${nodeToDelete.title}" 吗？此操作无法撤销。`)) return;

        const wasRemoved = _findAndRemoveNode(settingsData.value, nodeId);

        if (wasRemoved) {
            if (editorStore.activeItemId === nodeId) editorStore.setActiveItem(null);
            if (editorStore.editingNodeId === nodeId) editorStore.setEditingNodeId(null);
        }
    };

    const addCustomRelatedNode = (target: 'plot' | 'analysis') => {
        const editorStore = useEditorStore();
        const dataRef = target === 'plot' ? plotCustomData : analysisCustomData;
        const icon = target === 'plot' ? 'fa-solid fa-lightbulb text-rose-500' : 'fa-solid fa-magnifying-glass-plus text-orange-500';

        const newNode: RelatedTree = {
            id: `custom-${target}-${Date.now()}`,
            title: '新建自定义条目',
            type: `${target}_item`,
            icon: icon,
            content: '<h1>新建自定义条目</h1>',
        };

        dataRef.value.unshift(newNode);
        editorStore.toggleRelatedNodeExpansion(target);
        editorStore.setEditingNodeId(newNode.id);
        editorStore.setActiveItem(newNode.id);
    };

    const renameCustomRelatedNode = (nodeId: string, newTitle: string) => {
        const editorStore = useEditorStore();
        if (!newTitle.trim()) {
            editorStore.setEditingNodeId(null);
            return;
        }
        const result = findNodeById(nodeId);
        if (result?.node) {
            result.node.title = newTitle.trim();
            if (result.node.content) {
                result.node.content = result.node.content.replace(/<h1[^>]*>.*?<\/h1>/, `<h1>${newTitle.trim()}</h1>`);
            }
        }
        editorStore.setEditingNodeId(null);
    };

    const deleteCustomRelatedNode = (nodeId: string) => {
        const editorStore = useEditorStore();
        const sources = [plotCustomData, analysisCustomData];
        let wasRemoved = false;
        let nodeTitle = '';

        for (const source of sources) {
            const index = source.value.findIndex(item => item.id === nodeId);
            if (index !== -1) {
                nodeTitle = source.value[index].title;
                if (!window.confirm(`您确定要删除 "${nodeTitle}" 吗？此操作无法撤销。`)) return;

                source.value.splice(index, 1);
                wasRemoved = true;
                break;
            }
        }

        if (wasRemoved) {
            if (editorStore.activeItemId === nodeId) editorStore.setActiveItem(null);
            if (editorStore.editingNodeId === nodeId) editorStore.setEditingNodeId(null);
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
        addRelatedNode,
        renameRelatedNode,
        deleteRelatedNode,
        addCustomRelatedNode,
        renameCustomRelatedNode,
        deleteCustomRelatedNode,
    };
});