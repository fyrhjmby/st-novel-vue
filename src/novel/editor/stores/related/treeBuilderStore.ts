// 文件: src/novel/editor/stores/related/treeBuilderStore.ts

import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useItemDataStore } from './itemDataStore.ts';
import { useDirectoryStore } from '@novel/editor/stores/directoryStore.ts';
import { useDerivedContentStore } from '@novel/editor/stores/derivedContentStore.ts';
import { usePromptTemplateStore } from '@novel/editor/stores/promptTemplateStore';
import { getIconByNodeType } from '@novel/editor/utils/iconUtils.ts';
import type { TreeNode, RootNode, PlotAnalysisItem, ItemNode } from '@novel/editor/types';

export const useTreeBuilderStore = defineStore('related-tree-builder', () => {
    const itemDataStore = useItemDataStore();
    const directoryStore = useDirectoryStore();
    const derivedContentStore = useDerivedContentStore();
    const promptTemplateStore = usePromptTemplateStore();

    /**
     * 响应式地构建完整的相关内容树，供UI使用
     */
    const relatedData = computed((): TreeNode[] => {
        // 清理无效的派生内容
        const allValidSourceIds = new Set(directoryStore.directoryData.flatMap(v => [v.id, ...v.chapters.map(c => c.id)]));
        derivedContentStore.plotItems = derivedContentStore.plotItems.filter(i => allValidSourceIds.has(i.sourceId));
        derivedContentStore.analysisItems = derivedContentStore.analysisItems.filter(i => allValidSourceIds.has(i.sourceId));

        const buildDerivedContentTree = (type: 'plot' | 'analysis', dataArray: PlotAnalysisItem[]): TreeNode[] => {
            return directoryStore.directoryData.map(volume => {
                // 查找与此卷直接相关的派生项
                const derivedForVolume = dataArray
                    .filter(item => item.sourceId === volume.id)
                    .map(item => ({
                        id: item.id,
                        title: item.title,
                        type: `${type}_item` as ItemNode['type'],
                        icon: getIconByNodeType(`${type}_item`),
                        originalData: item,
                        content: item.content
                    }));

                // 为此卷下的章节查找派生项并分组
                const derivedForChapters = volume.chapters
                    .map(chapter => {
                        const derivedForChapter = dataArray.filter(item => item.sourceId === chapter.id);
                        if (derivedForChapter.length === 0) return null;

                        return {
                            id: `${type}_ch_group_${chapter.id}`,
                            title: chapter.title,
                            type: 'group',
                            icon: getIconByNodeType('chapter'),
                            isReadOnly: true,
                            children: derivedForChapter.map(item => ({
                                id: item.id,
                                title: item.title,
                                type: `${type}_item` as ItemNode['type'],
                                icon: getIconByNodeType(`${type}_item`),
                                originalData: item,
                                content: item.content
                            }))
                        };
                    })
                    .filter((c): c is TreeNode => c !== null);

                // 如果该卷及其章节都没有派生内容，则不显示该卷的节点
                if (derivedForVolume.length === 0 && derivedForChapters.length === 0) {
                    return null;
                }

                return {
                    id: `${type}_vol_group_${volume.id}`,
                    title: volume.title,
                    type: 'group',
                    icon: getIconByNodeType('volume'),
                    isReadOnly: true,
                    children: [
                        ...derivedForVolume,
                        ...derivedForChapters
                    ]
                };
            }).filter((v): v is TreeNode => v !== null);
        };

        const allPlotItems = derivedContentStore.plotItems;
        const allAnalysisItems = derivedContentStore.analysisItems;

        const plotTree: RootNode = {
            id: 'plot', title: '剧情', type: 'root', icon: getIconByNodeType('plot'),
            children: [
                ...itemDataStore.plotCustomData,
                ...buildDerivedContentTree('plot', allPlotItems)
            ]
        };
        const analysisTree: RootNode = {
            id: 'analysis', title: '分析', type: 'root', icon: getIconByNodeType('analysis'),
            children: [
                ...itemDataStore.analysisCustomData,
                ...buildDerivedContentTree('analysis', allAnalysisItems)
            ]
        };
        const othersTree: RootNode = {
            id: 'others', title: '其他', type: 'root', icon: getIconByNodeType('others'),
            children: [
                ...promptTemplateStore.templates,
                ...itemDataStore.othersCustomData
            ]
        };

        return [...itemDataStore.settingsData, plotTree, analysisTree, othersTree];
    });

    return {
        relatedData,
    };
});