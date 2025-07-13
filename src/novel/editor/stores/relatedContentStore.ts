import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useDirectoryStore } from './directoryStore';
import type { RelatedTree, Volume } from '../types';
import { getIconByNodeType } from '../utils/iconUtils';

export const useRelatedContentStore = defineStore('novel-related-content', () => {
    const settingsData = ref<RelatedTree[]>([]);
    const plotCustomData = ref<RelatedTree[]>([]);
    const analysisCustomData = ref<RelatedTree[]>([]);

    const _findNodeRecursive = (nodes: RelatedTree[], nodeId: string): { node: RelatedTree; parent: RelatedTree | null } | null => {
        for (const node of nodes) {
            if (node.id === nodeId) return { node, parent: null };
            if (node.children) {
                const foundInChild = _findNodeRecursive(node.children, nodeId);
                if (foundInChild) {
                    if (!foundInChild.parent) foundInChild.parent = node;
                    return foundInChild;
                }
            }
        }
        return null;
    };

    const relatedData = computed((): RelatedTree[] => {
        const directoryStore = useDirectoryStore();

        const generateMirroredTree = (sourceNodes: Volume[], prefix: string, suffix: string, iconMap: { volume: string; chapter: string }): RelatedTree[] => {
            return sourceNodes.map(volume => ({
                id: `${prefix}_vol_${volume.id}`,
                title: `${volume.title}${suffix}`,
                type: `${prefix}_volume`,
                icon: iconMap.volume,
                content: `<h1>${volume.title}${suffix}</h1>`,
                children: volume.chapters.map(chapter => ({
                    id: `${prefix}_ch_${chapter.id}`,
                    title: `${chapter.title}${suffix}`,
                    type: `${prefix}_chapter`,
                    icon: iconMap.chapter,
                    content: `<h1>${chapter.title}${suffix}</h1>`,
                }))
            }));
        };

        const plotTree: RelatedTree = {
            id: 'plot', title: '剧情', type: 'root', icon: 'fa-solid fa-feather-pointed',
            children: [...plotCustomData.value, ...generateMirroredTree(directoryStore.directoryData, 'plot', ' 剧情', { volume: 'fa-solid fa-book-bible text-rose-500', chapter: 'fa-solid fa-scroll text-rose-500' })]
        };
        const analysisTree: RelatedTree = {
            id: 'analysis', title: '分析', type: 'root', icon: 'fa-solid fa-magnifying-glass-chart',
            children: [...analysisCustomData.value, ...generateMirroredTree(directoryStore.directoryData, 'analysis', ' 分析', { volume: 'fa-solid fa-chart-pie text-orange-500', chapter: 'fa-solid fa-chart-simple text-orange-500' })]
        };
        return [...settingsData.value, plotTree, analysisTree];
    });

    function findNodeById(nodeId: string) {
        return _findNodeRecursive(relatedData.value, nodeId);
    }

    function fetchRelatedData(settings: RelatedTree[], plot: RelatedTree[], analysis: RelatedTree[]) {
        settingsData.value = settings;
        plotCustomData.value = plot;
        analysisCustomData.value = analysis;
    }

    function updateNodeContent(nodeId: string, content: string) {
        const result = findNodeById(nodeId);
        if (result?.node && 'content' in result.node) {
            result.node.content = content;
            const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
            const newTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';
            if (newTitle && newTitle !== result.node.title) {
                result.node.title = newTitle;
            }
        }
    }

    function addRelatedNode(parentId: string, type: 'group' | 'item'): RelatedTree | null {
        const result = findNodeById(parentId);
        if (!result?.node) return null;

        const parentNode = result.node;
        if (!parentNode.children) parentNode.children = [];

        const itemTypePrefix = parentNode.id.replace(/s$/, '');
        const newNodeType = type === 'group' ? 'group' : `${itemTypePrefix}_item`;

        const newNode: RelatedTree = {
            id: `${type}-${Date.now()}`,
            title: type === 'group' ? '新建分组' : '新建条目',
            type: newNodeType,
            icon: getIconByNodeType(newNodeType),
            content: type === 'item' ? `<h1>新建条目</h1>` : undefined,
            children: type === 'group' ? [] : undefined,
        };
        parentNode.children.push(newNode);
        return newNode;
    }

    function addCustomRelatedNode(target: 'plot' | 'analysis'): RelatedTree {
        const dataRef = target === 'plot' ? plotCustomData : analysisCustomData;
        const newNode: RelatedTree = {
            id: `custom-${target}-${Date.now()}`,
            title: '新建自定义条目',
            type: `${target}_item`,
            icon: getIconByNodeType(`${target}_item`),
            content: '<h1>新建自定义条目</h1>',
        };
        dataRef.value.unshift(newNode);
        return newNode;
    }

    function renameRelatedNode(nodeId: string, newTitle: string) {
        if (!newTitle.trim()) return;

        const result = findNodeById(nodeId);
        if (result?.node) {
            const trimmedTitle = newTitle.trim();
            result.node.title = trimmedTitle;
            if (result.node.content?.includes('<h1>')) {
                result.node.content = result.node.content.replace(/<h1[^>]*>.*?<\/h1>/, `<h1>${trimmedTitle}</h1>`);
            }
        }
    }

    function deleteRelatedNode(nodeId: string) {
        const nodeToDelete = findNodeById(nodeId)?.node;
        if (!nodeToDelete) return;
        if (!window.confirm(`您确定要删除 "${nodeToDelete.title}" 吗？此操作无法撤销。`)) return;

        const _findAndRemove = (nodes: RelatedTree[]): boolean => {
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].id === nodeId) {
                    nodes.splice(i, 1);
                    return true;
                }
                if (nodes[i].children && _findAndRemove(nodes[i].children!)) {
                    return true;
                }
            }
            return false;
        }
        _findAndRemove(settingsData.value);
    }

    function deleteCustomRelatedNode(nodeId: string) {
        const sources = [plotCustomData, analysisCustomData];
        for (const source of sources) {
            const index = source.value.findIndex(item => item.id === nodeId);
            if (index !== -1) {
                if (!window.confirm(`您确定要删除 "${source.value[index].title}" 吗？`)) return;
                source.value.splice(index, 1);
                break;
            }
        }
    }

    return {
        relatedData,
        fetchRelatedData,
        findNodeById,
        updateNodeContent,
        addRelatedNode,
        addCustomRelatedNode,
        renameRelatedNode,
        deleteRelatedNode,
        deleteCustomRelatedNode,
    };
});