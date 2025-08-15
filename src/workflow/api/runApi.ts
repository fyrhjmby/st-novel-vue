import type { RunPageData } from '@/workflow/types';

// Mock database of workflow titles
const workflowTitles: Record<string, string> = {
    'wf-001': '社交媒体帖子生成器',
    'wf-002': '公司周报摘要',
    'wf-003': '市场情绪分析流程',
    'wf-004': '新客户欢迎邮件',
};

const mockRunData: Omit<RunPageData, 'workflowId' | 'workflowName'> = {
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
    fetchRunPageData: (id: string): Promise<RunPageData> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const response: RunPageData = {
                    workflowId: id,
                    workflowName: workflowTitles[id] || '未知工作流',
                    ...JSON.parse(JSON.stringify(mockRunData))
                };
                resolve(response);
            }, 300); // Simulate network delay
        });
    },
};