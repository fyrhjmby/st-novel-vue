// 文件: ..\src\novel\services\novelProjectService.ts
import { novelProjects } from '@/novel/data/mockNovelProjects';
import type { NovelProject } from '@/novel/editor/types/project';
import type { Volume, ItemNode, TreeNode, PlotAnalysisItem } from '@/novel/editor/types';

const defaultSettingsData: TreeNode[] = [
    {
        id: 'setting', title: '设定', type: 'root', icon: 'fa-solid fa-book-journal-whills',
        children: [
            { id: 'characters', title: '角色', type: 'group', icon: 'fa-solid fa-users text-teal-500', children: [{ id: 'characters-overview', title: '角色总览', type: 'characters_overview', icon: 'fa-solid fa-users', content: '', isOverview: true, isReadOnly: true }] },
            { id: 'locations', title: '地点', type: 'group', icon: 'fa-solid fa-map-location-dot text-green-500', children: [{ id: 'locations-overview', title: '地点总览', type: 'locations_overview', icon: 'fa-solid fa-map-location-dot', content: '', isOverview: true, isReadOnly: true }] },
            { id: 'items', title: '物品', type: 'group', icon: 'fa-solid fa-box-archive text-amber-600', children: [{ id: 'items-overview', title: '物品总览', type: 'items_overview', icon: 'fa-solid fa-box-archive', content: '', isOverview: true, isReadOnly: true }] },
            { id: 'worldview', title: '世界观', type: 'group', icon: 'fa-solid fa-earth-americas text-sky-500', children: [{ id: 'worldview-overview', title: '世界观总览', type: 'worldview_overview', icon: 'fa-solid fa-book-atlas', content: '', isOverview: true, isReadOnly: true }, { id: 'world-overview-item', title: '世界观细则', type: 'worldview_item', icon: 'fa-solid fa-book-atlas', content: '<h1>世界观总览</h1><p>23世纪，人类掌握了亚光速航行技术，开始探索临近星系。</p>' }] }
        ]
    }
];
const defaultPlotCustomData: ItemNode[] = [];
const defaultAnalysisCustomData: ItemNode[] = [];
const defaultOthersCustomData: ItemNode[] = [
    { id: 'custom-others-1', title: '写作风格参考', type: 'others_item', icon: 'fa-regular fa-file-zipper', content: '<h1>写作风格参考</h1><p>参考阿西莫夫《基地》系列的宏大叙事风格，同时融合《黑暗森林》的悬疑氛围。' }
];

export const getNovelProject = (novelId: string): NovelProject | undefined => {
    return novelProjects.get(novelId);
}

export const getAllNovelProjects = (): NovelProject[] => {
    return Array.from(novelProjects.values());
}

export const createNewNovelProject = (id: string, title: string, description: string, category: string): NovelProject => {
    const newProject: NovelProject = {
        metadata: {
            id,
            title,
            description,
            cover: `https://source.unsplash.com/random/400x500?book&sig=${Date.now()}`,
            tags: [{ text: category, class: 'bg-gray-100 text-gray-600' }],
            status: '连载中',
            referenceNovelIds: [],
        },
        directoryData: [
            {
                id: `vol-${Date.now()}`,
                type: 'volume',
                title: '第一卷',
                content: `<h1>第一卷</h1>`,
                chapters: [],
            }
        ],
        settingsData: JSON.parse(JSON.stringify(defaultSettingsData)),
        plotCustomData: JSON.parse(JSON.stringify(defaultPlotCustomData)),
        analysisCustomData: JSON.parse(JSON.stringify(defaultAnalysisCustomData)),
        derivedPlotData: [],
        derivedAnalysisData: [],
        othersCustomData: JSON.parse(JSON.stringify(defaultOthersCustomData)),
        noteData: []
    };

    novelProjects.set(id, newProject);
    return newProject;
};

export const importNovelProject = (id: string, title: string, description: string, category: string, directoryData: Volume[]): NovelProject => {
    const newProject: NovelProject = {
        metadata: {
            id,
            title,
            description,
            cover: `https://source.unsplash.com/random/400x500?book&sig=${Date.now()}`,
            tags: [{ text: category, class: 'bg-gray-100 text-gray-600' }],
            status: '连载中',
            referenceNovelIds: [],
        },
        directoryData: directoryData,
        settingsData: JSON.parse(JSON.stringify(defaultSettingsData)),
        plotCustomData: JSON.parse(JSON.stringify(defaultPlotCustomData)),
        analysisCustomData: JSON.parse(JSON.stringify(defaultAnalysisCustomData)),
        derivedPlotData: [],
        derivedAnalysisData: [],
        othersCustomData: JSON.parse(JSON.stringify(defaultOthersCustomData)),
        noteData: []
    };

    novelProjects.set(id, newProject);
    return newProject;
};