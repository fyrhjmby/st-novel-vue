// 文件: ..\src\novel\data\mockNovelProjects.ts
import type { NovelProject } from '@/novel/editor/types/project';
import type {
    Volume,
    NoteItem,
    TreeNode,
    ItemNode,
    NovelCharacter,
    GroupNode,
    OverviewNode,
    PlotAnalysisItem
} from '@/novel/editor/types';


const defaultSettingsData: TreeNode[] = [
    {
        id: 'setting', title: '设定', type: 'root', icon: 'fa-solid fa-book-journal-whills',
        children: [
            {
                id: 'characters', title: '角色', type: 'group', icon: 'fa-solid fa-users text-teal-500', children: [
                    { id: 'characters-overview', title: '角色总览', type: 'characters_overview', icon: 'fa-solid fa-users', content: '', isOverview: true, isReadOnly: true } as OverviewNode,
                ]
            } as GroupNode,
            {
                id: 'locations', title: '地点', type: 'group', icon: 'fa-solid fa-map-location-dot text-green-500', children: [
                    { id: 'locations-overview', title: '地点总览', type: 'locations_overview', icon: 'fa-solid fa-map-location-dot', content: '', isOverview: true, isReadOnly: true } as OverviewNode,
                ]
            } as GroupNode,
            {
                id: 'items', title: '物品', type: 'group', icon: 'fa-solid fa-box-archive text-amber-600', children: [
                    { id: 'items-overview', title: '物品总览', type: 'items_overview', icon: 'fa-solid fa-box-archive', content: '', isOverview: true, isReadOnly: true } as OverviewNode,
                ]
            } as GroupNode,
            {
                id: 'worldview', title: '世界观', type: 'group', icon: 'fa-solid fa-earth-americas text-sky-500', children: [
                    { id: 'worldview-overview', title: '世界观总览', type: 'worldview_overview', icon: 'fa-solid fa-book-atlas', content: '', isOverview: true, isReadOnly: true } as OverviewNode,
                    { id: 'world-overview-item', title: '世界观细则', type: 'worldview_item', icon: 'fa-solid fa-book-atlas', content: '<h1>世界观总览</h1><p>23世纪，人类掌握了亚光速航行技术，开始探索临近星系。</p>' } as ItemNode,
                ]
            } as GroupNode
        ]
    }
];
const defaultPlotCustomData: ItemNode[] = [];
const defaultAnalysisCustomData: ItemNode[] = [];
const defaultOthersCustomData: ItemNode[] = [
    { id: 'custom-others-1', title: '写作风格参考', type: 'others_item', icon: 'fa-regular fa-file-zipper', content: '<h1>写作风格参考</h1><p>参考阿西莫夫《基地》系列的宏大叙事风格，同时融合《黑暗森林》的悬疑氛围。' }
];

export const novelProjects = new Map<string, NovelProject>();

const starRangerCharacters: NovelCharacter[] = [
    {
        id: 'char-calvin',
        name: '卡尔文·里德',
        avatar: 'https://i.pravatar.cc/150?u=calvin',
        identity: '主角, 探索者四号宇航员',
        gender: '男',
        age: 35,
        faction: '人类联邦',
        summary: '孤独的宇航员，在一次深空探索任务中遭遇意外，被迫独自在未知星系中寻找归途。性格坚毅、冷静，但内心深处对家园有着强烈的眷恋。',
        notes: '设计灵感来源于电影《月球》和《星际穿越》。需要重点刻画其在长期孤独环境下的心理变化。',
        status: 'editing'
    },
    {
        id: 'char-aila',
        name: '艾拉 (AILA)',
        avatar: '',
        identity: 'AI, 飞船智能核心',
        summary: '第五代通用人工智能，负责“探索者四号”的全部系统运作。逻辑至上，声音平稳无波澜。在与卡尔文的长期相处中，其程序底层开始出现不符合预期的、类似人类情感的逻辑萌芽。',
        status: 'completed'
    },
];

novelProjects.set('ref-asimov-foundation', {
    metadata: {
        id: 'ref-asimov-foundation',
        title: '《银河帝国：基地》',
        description: '阿西莫夫的经典科幻作品，探讨心理史学。',
        cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=200',
        tags: [{ text: '经典科幻', class: 'bg-gray-100 text-gray-800' }],
        status: '已完结',
        referenceNovelIds: [],
    },
    directoryData: [{
        id: 'ref-asimov-vol-1', type: 'volume', title: '第一部 心理史学家', content: '<h1>第一部 心理史学家</h1><p>本卷大纲...</p>', chapters: [
            { id: 'ref-asimov-ch-1', type: 'chapter', title: '第一节', wordCount: 3000, content: '<h1>第一节</h1><p>哈里·谢顿在川陀的最后一次演讲，预言了帝国的崩溃...</p>', status: 'completed' }
        ]
    }],
    settingsData: [],
    plotCustomData: [],
    analysisCustomData: [],
    derivedPlotData: [],
    derivedAnalysisData: [],
    othersCustomData: [],
    noteData: [],
});

novelProjects.set('ref-cixin-darkforest', {
    metadata: {
        id: 'ref-cixin-darkforest',
        title: '《黑暗森林》',
        description: '刘慈欣《三体》系列的第二部，提出宇宙社会学。',
        cover: 'https://images.unsplash.com/photo-1544716278-e513176f20b5?q=80&w=200',
        tags: [{ text: '硬科幻', class: 'bg-blue-50 text-blue-700' }],
        status: '已完结',
        referenceNovelIds: [],
    },
    directoryData: [{
        id: 'ref-cixin-vol-1', type: 'volume', title: '面壁者', content: '<h1>面壁者</h1><p>本卷大纲...</p>', chapters: [
            { id: 'ref-cixin-ch-1', type: 'chapter', title: '第一章', wordCount: 5000, content: '<h1>第一章</h1><p>面对三体文明的威胁，人类制定了“面壁计划”...</p>', status: 'completed' }
        ]
    }],
    settingsData: [],
    plotCustomData: [],
    analysisCustomData: [],
    derivedPlotData: [],
    derivedAnalysisData: [],
    othersCustomData: [],
    noteData: [],
});

novelProjects.set('novel-1', {
    metadata: {
        id: 'novel-1',
        title: '星际漫游者',
        description: '一部关于孤独宇航员在未知星系中寻找回家之路的科幻史诗。',
        cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=200',
        tags: [{ text: '科幻', class: 'bg-blue-50 text-blue-700' }],
        status: '连载中',
        referenceNovelIds: ['ref-asimov-foundation', 'ref-cixin-darkforest'],
    },
    directoryData: [
        {
            id: 'vol-1', type: 'volume', title: '第一卷：星尘之始', content: '<h1>第一卷：星尘之始</h1><p>本卷大纲...</p>', chapters: [
                { id: 'ch-1', type: 'chapter', title: '第一章：深空孤影', wordCount: 3102, content: '<h1>第一章：深空孤影</h1><p>这是章节的详细内容，讲述了主角卡尔文在孤独的宇宙中开始他的旅程。周围只有无尽的星空和飞船引擎的低鸣。</p>', status: 'completed' },
                { id: 'ch-2', type: 'chapter', title: '第二章：异常信号', wordCount: 2845, content: '<h1>第二章：异常信号</h1><p>一个神秘的信号打破了长久的平静，它似乎来自一个未知的源头，艾拉无法解析其格式。这给卡尔文带来了希望，也带来了恐惧。</p>', status: 'completed' },
                { id: 'ch-3', type: 'chapter', title: '第三章：AI的低语', wordCount: 3500, content: '<h1>第三章：AI的低语</h1><p>在分析信号的过程中，飞船的AI“艾拉”开始出现一些微小的异常行为。它的逻辑似乎在发生某种不为人知的演变。</p>', status: 'editing' },
                { id: 'ch-4', type: 'chapter', title: '第四章: 跃迁点', wordCount: 2415, content: '<h1>第四章: 跃迁点</h1><p>他们最终发现信号源自一个时空奇点——一个理论上存在的跃迁点。这可能是他们回家唯一的希望，也可能是通向毁灭的陷阱。</p>', status: 'editing' },
            ]
        },
        {
            id: 'vol-2', type: 'volume', title: '第二卷：遗忘的航线', content: '<h1>第二卷：遗忘的航线</h1><p>本卷大纲...</p>', chapters: [
                { id: 'ch-5', type: 'chapter', title: '第五章：时空涟漪', wordCount: 0, content: '<h1>第五章：时空涟漪</h1>', status: 'planned' },
            ]
        },
    ],
    settingsData: [
        {
            id: 'setting', title: '设定', type: 'root', icon: 'fa-solid fa-book-journal-whills',
            children: [
                {
                    id: 'characters', title: '角色', type: 'group', icon: 'fa-solid fa-users text-teal-500', children: [
                        { id: 'characters-overview', title: '角色总览', type: 'characters_overview', icon: 'fa-solid fa-users', content: '', isOverview: true, isReadOnly: true } as OverviewNode,
                        ...starRangerCharacters.map(char => ({
                            id: char.id,
                            title: char.name,
                            type: 'character_item',
                            icon: 'fa-regular fa-user',
                            content: `<h1>${char.name}</h1><p>身份：${char.identity}</p><p>简介：${char.summary}</p>`,
                            originalData: char,
                        }))
                    ]
                } as GroupNode,
                {
                    id: 'locations', title: '地点', type: 'group', icon: 'fa-solid fa-map-location-dot text-green-500', children: [
                        { id: 'locations-overview', title: '地点总览', type: 'locations_overview', icon: 'fa-solid fa-map-location-dot', content: '', isOverview: true, isReadOnly: true } as OverviewNode,
                    ]
                } as GroupNode,
                {
                    id: 'items', title: '物品', type: 'group', icon: 'fa-solid fa-box-archive text-amber-600', children: [
                        { id: 'items-overview', title: '物品总览', type: 'items_overview', icon: 'fa-solid fa-box-archive', content: '', isOverview: true, isReadOnly: true } as OverviewNode,
                    ]
                } as GroupNode,
                {
                    id: 'worldview', title: '世界观', type: 'group', icon: 'fa-solid fa-earth-americas text-sky-500', children: [
                        { id: 'worldview-overview', title: '世界观总览', type: 'worldview_overview', icon: 'fa-solid fa-book-atlas', content: '', isOverview: true, isReadOnly: true } as OverviewNode,
                        { id: 'world-overview-item', title: '世界观细则', type: 'worldview_item', icon: 'fa-solid fa-book-atlas', content: '<h1>世界观总览</h1><p>23世纪，人类掌握了亚光速航行技术，开始探索临近星系。</p>' } as ItemNode,
                    ]
                } as GroupNode
            ]
        }
    ],
    plotCustomData: [
        { id: 'custom-plot-1', title: '关于跃迁点背后的文明猜想', type: 'plot_item', icon: 'fa-solid fa-lightbulb text-rose-500', content: '<h1>关于跃迁点背后的文明猜想</h1>' }
    ],
    analysisCustomData: [],
    derivedPlotData: [],
    derivedAnalysisData: [
        {
            id: 'analysis_1682495833181',
            type: 'analysis',
            sourceId: 'ch-3',
            title: '《第三章：AI的低语》分析',
            content: '<h1>《第三章：AI的低语》分析</h1><p>本章通过AI“艾拉”的微小异常，成功地在科幻背景下引入了悬疑元素。这种“不可靠的伙伴”设定，极大地增强了主角卡尔文的孤独感和不确定性，为后续情节发展埋下伏笔。</p>'
        }
    ],
    othersCustomData: [
        { id: 'custom-others-1', title: '写作风格参考', type: 'others_item', icon: 'fa-regular fa-file-zipper', content: '<h1>写作风格参考</h1><p>参考阿西莫夫《基地》系列的宏大叙事风格，同时融合《黑暗森林》的悬疑氛围。' }
    ],
    noteData: [
        { id: 'note-1', type: 'note', title: '第四章情感转折点设计', timestamp: '今天 14:32', content: '<h1>第四章情感转折点设计</h1><p>需要重点描写卡尔文在面对跃迁点时，希望与恐惧交织的复杂心理。</p>' },
    ]
});