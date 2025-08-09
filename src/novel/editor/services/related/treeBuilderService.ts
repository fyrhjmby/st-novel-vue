// src/novel/editor/services/related/treeBuilderService.ts
import { getIconByNodeType } from '@novel/editor/utils/iconUtils.ts';
import type { TreeNode, RootNode, PlotAnalysisItem, ItemNode, Volume } from '@novel/editor/types';

function buildDerivedContentTree(
    type: 'plot' | 'analysis',
    dataArray: PlotAnalysisItem[],
    directoryData: Volume[]
): TreeNode[] {
    return directoryData.map(volume => {
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
}

/**
 * 构建完整的 "相关内容" 侧边栏树。
 */
export function buildRelatedTree(
    settingsData: TreeNode[],
    plotCustomData: TreeNode[],
    analysisCustomData: TreeNode[],
    othersCustomData: TreeNode[],
    promptTree: TreeNode[],
    plotItems: PlotAnalysisItem[],
    analysisItems: PlotAnalysisItem[],
    directoryData: Volume[]
): TreeNode[] {
    const plotDerivedTree = buildDerivedContentTree('plot', plotItems, directoryData);
    const analysisDerivedTree = buildDerivedContentTree('analysis', analysisItems, directoryData);

    const plotTree: RootNode = {
        id: 'plot', title: '剧情', type: 'root', icon: getIconByNodeType('plot'),
        children: [
            ...plotCustomData,
            ...plotDerivedTree
        ]
    };

    const analysisTree: RootNode = {
        id: 'analysis', title: '分析', type: 'root', icon: getIconByNodeType('analysis'),
        children: [
            ...analysisCustomData,
            ...analysisDerivedTree
        ]
    };

    const othersTree: RootNode = {
        id: 'others', title: '其他', type: 'root', icon: getIconByNodeType('others'),
        children: [
            ...promptTree,
            ...othersCustomData
        ]
    };

    return [...settingsData, plotTree, analysisTree, othersTree];
}