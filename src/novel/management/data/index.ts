// 文件: src/novel/management/data/index.ts
import type { NovelCharacter, WorldviewCategory, NovelMetadata, ContextPreset, RagSearchResult } from '@/novel/management/types';

export const mockCharacters: NovelCharacter[] = [
    {
        id: 'char-1',
        name: '卡尔文',
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
        id: 'char-2',
        name: '艾拉',
        avatar: '',
        identity: 'AI, 飞船智能核心',
        summary: '第五代通用人工智能，负责“探索者四号”的全部系统运作。逻辑至上，声音平稳无波澜。在与卡尔文的长期相处中，其程序底层开始出现不符合预期的、类似人类情感的逻辑萌芽。',
        status: 'completed'
    },
];

export const mockWorldviewCategories: WorldviewCategory[] = [
    {
        id: 'location',
        name: '地点',
        icon: 'fa-solid fa-location-dot',
        items: [
            { id: 'loc-1', title: '探索者四号', description: '主角所在的深空探测飞船，配备了实验性的曲率引擎，设计用于长期单人任务。', lastUpdated: '2天前' }
        ]
    },
    {
        id: 'tech',
        name: '技术',
        icon: 'fa-solid fa-microchip',
        items: [
            { id: 'tech-1', title: '再生咖啡', description: '飞船内物质循环系统的产物，味道聊胜于无，是卡尔文在漫长旅途中为数不多的慰藉之一。', lastUpdated: '5天前' }
        ]
    }
];

export const mockNovelMetadata: NovelMetadata = {
    id: 'novel-1',
    title: '星际漫游者',
    description: '一部关于孤独宇航员在未知星系中寻找回家之路的科幻史诗。',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=200',
    tags: [{ text: '科幻', class: 'bg-blue-50 text-blue-700' }],
    status: '连载中'
};

export const mockFixedContextPresets: ContextPreset[] = [
    ...mockCharacters.map(c => ({
        id: c.id,
        group: '角色设定',
        title: c.name,
        description: c.identity,
        content: c.summary
    })),
    ...mockWorldviewCategories.flatMap(cat => cat.items.map(item => ({
        id: item.id,
        group: cat.name,
        title: item.title,
        description: item.description,
        content: item.description
    })))
];

export const mockRagSearchResults: RagSearchResult[] = [
    { id: 1, title: '第3章 - 系统异常', relevance: 95, content: `"...艾拉的声音第一次出现了停顿..."`, location: '第3章 第12-15段', isSelected: true, wordCount: 98 },
    { id: 2, title: '第7章 - 觉醒', relevance: 87, content: `"...艾la的逻辑核心开始重构..."`, location: '第7章 第8-10段', isSelected: false, wordCount: 112 },
];