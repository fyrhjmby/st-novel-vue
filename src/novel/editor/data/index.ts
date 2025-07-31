// 文件: src/novel/editor/data/index.ts
import type { Volume, Chapter, NoteItem, NovelMetadata, NovelCharacter, AITask, TreeNode, ItemNode, RootNode, GroupNode, PlotAnalysisItem } from '@/novel/editor/types';

export const mockDirectoryData: Volume[] = [
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
];

export const mockCharacters: NovelCharacter[] = [
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

export const mockSettingsData: TreeNode[] = [
    {
        id: 'settings', title: '设定', type: 'root', icon: 'fa-solid fa-book-journal-whills',
        children: [
            {
                id: 'characters', title: '角色', type: 'group', icon: 'fa-solid fa-users text-teal-500', children: [
                    ...mockCharacters.map(char => ({
                        id: char.id,
                        title: char.name,
                        type: 'character_item',
                        icon: 'fa-regular fa-user',
                        content: `<h1>${char.name}</h1><p>${char.summary}</p>`,
                        originalData: char,
                    }))
                ]
            } as GroupNode,
            { id: 'locations', title: '地点', type: 'group', icon: 'fa-solid fa-map-location-dot text-green-500', children: [] } as GroupNode,
            { id: 'items', title: '物品', type: 'group', icon: 'fa-solid fa-box-archive text-amber-600', children: [] } as GroupNode,
            {
                id: 'worldview', title: '世界观', type: 'group', icon: 'fa-solid fa-earth-americas text-sky-500', children: [
                    { id: 'world-overview', title: '世界观总览', type: 'worldview_item', icon: 'fa-solid fa-book-atlas', content: '<h1>世界观总览</h1><p>23世纪，人类掌握了亚光速航行技术，开始探索临近星系。</p>' } as ItemNode,
                ]
            } as GroupNode
        ]
    } as RootNode,
];

export const mockPlotCustomData: ItemNode[] = [
    { id: 'custom-plot-1', title: '关于跃迁点背后的文明猜想', type: 'plot_item', icon: 'fa-solid fa-lightbulb text-rose-500', content: '<h1>关于跃迁点背后的文明猜想</h1>' }
];

export const mockAnalysisCustomData: ItemNode[] = [];

export const mockNoteData: NoteItem[] = [
    { id: 'note-1', type: 'note', title: '第四章情感转折点设计', timestamp: '今天 14:32', content: '<h1>第四章情感转折点设计</h1><p>需要重点描写卡尔文在面对跃迁点时，希望与恐惧交织的复杂心理。</p>' },
];

export const mockAIResponses: Record<AITask['type'], string> = {
    '续写': "警报的尖啸犹如一把利刃，划破了卡尔文短暂的假寐。他猛然挺直身躯，猩红的警示灯在他眼中投下不祥的光晕。'发现引力异常，' 艾拉的合成音毫无波澜，却字字千钧，'我们正迫近一个理论中的时空奇点——跃迁点。根据数据库推演，这或许是返回太阳系的唯一路径。'",
    '润色': "控制台的警报声，如同一道惊雷，将卡尔文从混沌的浅眠中劈醒。他霍然坐直，闪烁的红色警告灯在视网膜上烙下灼热的印记。",
    '分析': "从文本来看，主角卡尔文此刻的情绪是震惊与希望的混合体。'浅眠'暗示了他长期的精神疲惫，而警报则是一个外部冲突的触发器。'回家'是核心动机，为后续情节发展提供了强大的驱动力。建议在后续描写中，可以加入更多关于他过去的回忆闪现，以丰富人物形象。",
    '剧情生成': "卡尔文发现的跃迁点并非自然形成。一个古老的、早已消亡的文明建造了它，作为星际高速公路网络的一部分。这个文明的遗迹散布在跃迁点周围的星系中，每一个遗迹都像一个面包屑，引导着后来者。但同时，守护这些遗迹的古老自动化系统依然在运作，它们会将任何未经授权的闯入者视为威胁。"
};

export const mockNovelMetadata: NovelMetadata = {
    id: 'novel-1',
    title: '星际漫游者',
    description: '一部关于孤独宇航员在未知星系中寻找回家之路的科幻史诗。',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=200',
    tags: [{ text: '科幻', class: 'bg-blue-50 text-blue-700' }],
    status: '连载中'
};