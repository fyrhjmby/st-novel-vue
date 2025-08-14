import type { RunPageData } from '@/workflow/types';

const mockRunData: RunPageData = {
    presets: [
        { id: 'p1', name: '推特营销', description: '适合产品推广', active: true },
        { id: 'p2', name: '个人分享', description: '日常动态更新', active: false },
        { id: 'p3', name: '新闻快讯', description: '时事热点评论', active: false },
    ],
    recentParams: [
        {
            id: 'r1',
            title: 'AI在教育领域的应用',
            details: '推特 • 专业语调 • 2小时前'
        }
    ],
    initialFormData: {
        topic: '人工智能在创意写作中的应用',
        platform: '推特 (默认)',
        tone: '专业',
        includeHashtags: true,
        includeEmojis: true,
        includeCTA: false,
    }
};

export const runApi = {
    fetchRunPageData: (): Promise<RunPageData> => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(JSON.parse(JSON.stringify(mockRunData)));
            }, 300); // Simulate network delay
        });
    },
};