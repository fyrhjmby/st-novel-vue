// 文件: src/novel/editor/data/index.ts
import type { Volume, RelatedTree, NoteItem } from '@/novel/editor/types';

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

export const mockSettingsData: RelatedTree[] = [
    {
        id: 'settings', title: '设定', type: 'root', icon: 'fa-solid fa-book-journal-whills',
        children: [
            {
                id: 'characters', title: '角色', type: 'group', icon: 'fa-solid fa-users text-teal-500', children: [
                    { id: 'char-calvin', title: '卡尔文·里德', type: 'character_item', icon: 'fa-regular fa-user', content: '<h1>卡尔文·里德</h1><p>主角，性格坚毅，内心深处渴望回家。</p>' },
                    { id: 'char-aila', title: '艾拉 (AILA)', type: 'character_item', icon: 'fa-regular fa-user', content: '<h1>艾拉 (AILA)</h1><p>飞船的AI，逻辑至上，但开始出现人性化的迹象。</p>' },
                ]
            },
            { id: 'locations', title: '地点', type: 'group', icon: 'fa-solid fa-map-location-dot text-green-500', children: [] },
            { id: 'items', title: '物品', type: 'group', icon: 'fa-solid fa-box-archive text-amber-600', children: [] },
            {
                id: 'worldview', title: '世界观', type: 'group', icon: 'fa-solid fa-earth-americas text-sky-500', children: [
                    { id: 'world-overview', title: '世界观总览', type: 'worldview_item', icon: 'fa-solid fa-book-atlas', content: '<h1>世界观总览</h1><p>23世纪，人类掌握了亚光速航行技术，开始探索临近星系。</p>' },
                ]
            }
        ]
    }
];

export const mockPlotCustomData: RelatedTree[] = [
    { id: 'custom-plot-1', title: '关于跃迁点背后的文明猜想', type: 'plot_item', icon: 'fa-solid fa-lightbulb text-rose-500', content: '<h1>关于跃迁点背后的文明猜想</h1>' }
];

export const mockAnalysisCustomData: RelatedTree[] = [];

export const mockNoteData: NoteItem[] = [
    { id: 'note-1', type: 'note', title: '第四章情感转折点设计', timestamp: '今天 14:32', content: '<h1>第四章情感转折点设计</h1><p>需要重点描写卡尔文在面对跃迁点时，希望与恐惧交织的复杂心理。</p>' },
];

export const mockAIResponses: Record<'润色' | '续写' | '分析', string> = {
    '续写': "警报的尖啸犹如一把利刃，划破了卡尔文短暂的假寐。他猛然挺直身躯，猩红的警示灯在他眼中投下不祥的光晕。'发现引力异常，' 艾拉的合成音毫无波澜，却字字千钧，'我们正迫近一个理论中的时空奇点——跃迁点。根据数据库推演，这或许是返回太阳系的唯一路径。'",
    '润色': "控制台的警报声，如同一道惊雷，将卡尔文从混沌的浅眠中劈醒。他霍然坐直，闪烁的红色警告灯在视网膜上烙下灼热的印记。",
    '分析': "从文本来看，主角卡尔文此刻的情绪是震惊与希望的混合体。'浅眠'暗示了他长期的精神疲惫，而警报则是一个外部冲突的触发器。'回家'是核心动机，为后续情节发展提供了强大的驱动力。建议在后续描写中，可以加入更多关于他过去的回忆闪现，以丰富人物形象。",
};