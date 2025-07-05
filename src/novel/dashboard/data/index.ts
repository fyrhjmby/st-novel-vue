// 文件: src/novel/dashboard/data/index.ts
import type { Novel, NovelCategory } from '@/novel/types';
import type { RecentActivityItem, DeletedItem } from '@/novel/dashboard/types';

export const mockNovels: Novel[] = [
    {
        id: 'novel-1',
        title: '星际漫游者',
        description: '一部关于孤独宇航员在未知星系中寻找回家之路的科幻史诗。',
        cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800',
        status: { text: '编辑中', class: 'bg-green-500/90' },
        tags: [{ text: '科幻', class: 'bg-blue-50 text-blue-700' }, { text: '冒险', class: 'bg-purple-50 text-purple-700' }],
        chapters: 24,
        lastUpdated: '2小时前',
        category: '科幻'
    },
    {
        id: 'novel-2',
        title: '时间之沙',
        description: '当历史可以被改写，一个历史学家必须阻止一个神秘组织抹去关键的历史事件。',
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800',
        status: { text: '待审核', class: 'bg-yellow-500/90' },
        tags: [{ text: '悬疑', class: 'bg-yellow-50 text-yellow-700' }, { text: '科幻', class: 'bg-blue-50 text-blue-700' }],
        chapters: 15,
        lastUpdated: '昨天',
        category: '悬疑'
    },
    {
        id: 'novel-4',
        title: '都市霓虹',
        description: '一个平凡的程序员意外获得读取他人思想的能力，卷入一场巨大的商业阴谋。',
        cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800',
        status: { text: '已发布', class: 'bg-blue-500/90' },
        tags: [{ text: '都市', class: 'bg-pink-50 text-pink-700' }, { text: '异能', class: 'bg-green-50 text-green-700' }],
        chapters: 102,
        lastUpdated: '1周前',
        category: '都市'
    },
    {
        id: 'novel-5',
        title: '红尘一梦',
        description: '穿越回古代，成为一个不受宠的公主，她如何利用现代知识在宫廷斗争中生存。',
        cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800',
        status: { text: '编辑中', class: 'bg-green-500/90' },
        tags: [{ text: '古风', class: 'bg-red-50 text-red-700' }, { text: '言情', class: 'bg-indigo-50 text-indigo-700' }],
        chapters: 56,
        lastUpdated: '5小时前',
        category: '言情'
    }
];

export const mockTrashedItems: DeletedItem[] = [
    {
        id: 'novel-3-deleted',
        name: '深海回响',
        type: '小说',
        icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7H15M9 11H15M9 15H13"/></svg>',
        deletedAt: '2024-05-18T10:00:00Z',
        retentionDays: 27,
        retentionPercent: 90,
    }
];

export const mockRecentItems: RecentActivityItem[] = [
    {
        id: 'activity-1',
        novelId: 'novel-1',
        novelTitle: '星际漫游者',
        novelCover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800',
        editedItemType: 'chapter',
        editedItemName: '第四章：跃迁点',
        editedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        formattedTime: '2小时前'
    },
    {
        id: 'activity-2',
        novelId: 'novel-5',
        novelTitle: '红尘一梦',
        novelCover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800',
        editedItemType: 'character',
        editedItemName: '角色设定 - 凤九',
        editedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        formattedTime: '5小时前'
    },
    {
        id: 'activity-3',
        novelId: 'novel-2',
        novelTitle: '时间之沙',
        novelCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800',
        editedItemType: 'outline',
        editedItemName: '大纲',
        editedAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
        formattedTime: '昨天'
    }
];