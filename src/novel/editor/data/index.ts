import type { Volume, RelatedTree, NoteItem, NovelMetadata, NovelCharacter } from '../types';

export const mockDirectoryData: Volume[] = [
    {
        id: 'vol-1', type: 'volume', title: '第一卷：星尘之始', content: '<h1>第一卷：星尘之始</h1>', chapters: [
            { id: 'ch-1', type: 'chapter', title: '第一章：深空孤影', wordCount: 3102, content: '<h1>第一章：深空孤影</h1><p>这是章节的详细内容...</p>', status: 'completed' },
            { id: 'ch-2', type: 'chapter', title: '第二章：异常信号', wordCount: 2845, content: '<h1>第二章：异常信号</h1><p>一个神秘的信号...</p>', status: 'completed' },
            { id: 'ch-3', type: 'chapter', title: '第三章：AI的低语', wordCount: 3500, content: '<h1>第三章：AI的低语</h1><p>飞船的AI“艾拉”开始出现异常...</p>', status: 'editing' },
        ]
    },
];

export const mockCharacters: NovelCharacter[] = [
    { id: 'char-calvin', name: '卡尔文·里德', avatar: '', identity: '主角', summary: '孤独的宇航员...' },
    { id: 'char-aila', name: '艾拉 (AILA)', avatar: '', identity: 'AI', summary: '第五代通用人工智能...' },
];

export const mockSettingsData: RelatedTree[] = [
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
                        content: `<h1>${char.name}</h1><p>${char.summary}</p>`
                    }))
                ]
            },
        ]
    }
];

export const mockPlotCustomData: RelatedTree[] = [
    { id: 'custom-plot-1', title: '关于跃迁点背后的文明猜想', type: 'plot_item', icon: 'fa-solid fa-lightbulb text-rose-500', content: '<h1>关于跃迁点背后的文明猜想</h1>' }
];

export const mockAnalysisCustomData: RelatedTree[] = [];

export const mockNoteData: NoteItem[] = [
    { id: 'note-1', type: 'note', title: '第四章情感转折点设计', timestamp: '今天 14:32', content: '<h1>第四章情感转折点设计</h1><p>需要重点描写卡尔文的复杂心理。</p>' },
];

export const mockAIResponses: Record<'润色' | '续写' | '分析', string> = {
    '续写': "警报的尖啸犹如一把利刃，划破了卡尔文短暂的假寐。",
    '润色': "控制台的警报声，如同一道惊雷，将卡尔文从混沌的浅眠中劈醒。",
    '分析': "从文本来看，主角卡尔文此刻的情绪是震惊与希望的混合体。",
};

export const mockNovelMetadata: NovelMetadata = {
    id: 'novel-1',
    title: '星际漫游者',
    description: '一部关于孤独宇航员在未知星系中寻找回家之路的科幻史诗。',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=200',
    tags: [{ text: '科幻', class: 'bg-blue-50 text-blue-700' }],
    status: '连载中'
};