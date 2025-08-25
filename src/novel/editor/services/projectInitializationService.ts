// 文件: src\novel\editor\services\projectInitializationService.ts

import type { TreeNode, ItemNode, Volume, Chapter } from '@/novel/editor/types';
import { getIconByNodeType } from '@/novel/editor/utils/iconUtils';

const createOverviewNode = (parentId: string, title: string): TreeNode => ({
    id: `${parentId}_overview`,
    title: `${title}总览`,
    type: `${parentId}_overview`,
    icon: getIconByNodeType(`${parentId}_overview`),
    content: `<p class="overview-placeholder">此分类下暂无内容，请添加条目。</p>`,
    isOverview: true,
    isReadOnly: true,
});

export const createDefaultSettingsTree = (): TreeNode[] => {
    const settingRoot: TreeNode = {
        id: 'setting',
        title: '设定',
        type: 'root',
        icon: getIconByNodeType('setting'),
        children: [
            {
                id: 'characters', title: '角色', type: 'group', icon: getIconByNodeType('group'),
                children: [createOverviewNode('characters', '角色')]
            },
            {
                id: 'locations', title: '地点', type: 'group', icon: getIconByNodeType('group'),
                children: [createOverviewNode('locations', '地点')]
            },
            {
                id: 'items', title: '物品', type: 'group', icon: getIconByNodeType('group'),
                children: [createOverviewNode('items', '物品')]
            },
            {
                id: 'worldview', title: '世界观', type: 'group', icon: getIconByNodeType('group'),
                children: [createOverviewNode('worldview', '世界观')]
            }
        ]
    };
    return [settingRoot];
};

export const createDefaultPlotItem = (): ItemNode[] => {
    return [{
        id: `custom-plot-${Date.now()}`,
        title: '初始剧情节点',
        type: 'plot_item',
        icon: getIconByNodeType('plot_item'),
        content: `<h1>初始剧情节点</h1><p>在这里开始构建你的故事剧情。</p>`,
    }];
};

export const createDefaultAnalysisItem = (): ItemNode[] => {
    return [{
        id: `custom-analysis-${Date.now()}`,
        title: '初始分析节点',
        type: 'analysis_item',
        icon: getIconByNodeType('analysis_item'),
        content: `<h1>初始分析节点</h1><p>在这里记录你对故事的分析和思考。</p>`,
    }];
};

export const createDefaultDirectory = (): Volume[] => {
    const chapterId = `ch-default-${Date.now()}`;
    const volumeId = `vol-default-${Date.now()}`;
    const defaultChapter: Chapter = {
        id: chapterId,
        type: 'chapter',
        volumeId: volumeId,
        title: '第一章',
        wordCount: 0,
        content: `<h1>第一章</h1><p>故事从这里开始...</p>`,
        status: 'editing',
        order: 0,
    };
    const defaultVolume: Volume = {
        id: volumeId,
        type: 'volume',
        title: '第一卷',
        content: `<h1>第一卷</h1><p>故事的第一卷。</p>`,
        chapters: [defaultChapter],
        order: 0,
    };
    return [defaultVolume];
};