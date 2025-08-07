import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useItemDataStore } from './itemDataStore.ts';
import { useDirectoryStore } from '@novel/editor/stores/directoryStore.ts';
import { useDerivedContentStore } from '@novel/editor/stores/derivedContentStore.ts';
import { getIconByNodeType } from '@novel/editor/utils/iconUtils.ts';
import type { TreeNode, RootNode, PlotAnalysisItem } from '@novel/editor/types';

export const useTreeBuilderStore = defineStore('related-tree-builder', () => {
    const itemDataStore = useItemDataStore();
    const directoryStore = useDirectoryStore();
    const derivedContentStore = useDerivedContentStore();

    /**
     * 响应式地构建完整的相关内容树，供UI使用
     */
    const relatedData = computed((): TreeNode[] => {
        // 清理无效的派生数据
        const allChapterIds = new Set(directoryStore.directoryData.flatMap(v => v.chapters.map(c => c.id)));
        derivedContentStore.plotItems = derivedContentStore.plotItems.filter(i => allChapterIds.has(i.sourceChapterId));
        derivedContentStore.analysisItems = derivedContentStore.analysisItems.filter(i => allChapterIds.has(i.sourceChapterId));

        // 辅助函数，用于构建派生内容的子树
        const buildDerivedTree = (
            type: 'plot' | 'analysis',
            dataArray: PlotAnalysisItem[]
        ): TreeNode[] => {
            return directoryStore.directoryData.map(volume => ({
                id: `${type}_vol_${volume.id}`,
                title: volume.title,
                type: 'group',
                icon: getIconByNodeType('volume'),
                isReadOnly: true,
                children: volume.chapters
                    .map(chapter => {
                        const derivedForChapter = dataArray.filter(item => item.sourceChapterId === chapter.id);
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
                                type: `${type}_item`,
                                icon: getIconByNodeType(`${type}_item`),
                                originalData: item,
                                content: item.content
                            }))
                        };
                    })
                    .filter((c): c is TreeNode => c !== null)
            })).filter(vol => vol.children.length > 0);
        };

        // 构建各个根节点
        const plotTree: RootNode = {
            id: 'plot', title: '剧情', type: 'root', icon: getIconByNodeType('plot'),
            children: [...itemDataStore.plotCustomData, ...buildDerivedTree('plot', derivedContentStore.plotItems)]
        };
        const analysisTree: RootNode = {
            id: 'analysis', title: '分析', type: 'root', icon: getIconByNodeType('analysis'),
            children: [...itemDataStore.analysisCustomData, ...buildDerivedTree('analysis', derivedContentStore.analysisItems)]
        };
        const othersTree: RootNode = {
            id: 'others', title: '其他', type: 'root', icon: getIconByNodeType('others'),
            children: [...itemDataStore.othersCustomData]
        };

        // 组合并返回最终的树结构
        return [...itemDataStore.settingsData, plotTree, analysisTree, othersTree];
    });

    return {
        relatedData,
    };
});