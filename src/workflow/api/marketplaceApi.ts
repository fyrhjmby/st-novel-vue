import type { MarketplaceData } from '@/workflow/types';

const mockMarketplaceData: MarketplaceData = {
    popularTags: [
        { name: '内容生成', color: 'blue' },
        { name: '数据处理', color: 'green' },
        { name: '自动化营销', color: 'purple' },
        { name: 'API集成', color: 'amber' },
        { name: '图像处理', color: 'rose' },
    ],
    workflowTemplates: [
        {
            title: '会议纪要生成器',
            author: '官方',
            rating: '4.8',
            reviews: '234',
            description: '上传会议录音或文字记录，自动生成结构化、带要点的会议纪要。',
            usage: '2.1k',
            iconName: 'file-text',
            iconColor: 'blue',
        },
        {
            title: '市场研究分析师',
            author: '官方',
            rating: '4.7',
            reviews: '189',
            description: '输入行业或产品，自动抓取网络信息，生成SWOT分析报告。',
            usage: '1.8k',
            iconName: 'search',
            iconColor: 'green',
        },
        {
            title: '短视频脚本创作',
            author: '社区',
            rating: '4.6',
            reviews: '156',
            description: '只需一个创意点，即可自动生成包含场景、对话和动作的完整短视频脚本。',
            usage: '972',
            iconName: 'video',
            iconColor: 'rose',
        },
        {
            title: '客服对话优化器',
            author: '企业版',
            rating: '4.9',
            reviews: '512',
            description: '分析客服对话记录，提供改进建议，生成标准化回复模板。',
            usage: '3.5k',
            iconName: 'message-square',
            iconColor: 'indigo',
        },
    ],
};

export const marketplaceApi = {
    fetchMarketplaceData: (): Promise<MarketplaceData> => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(mockMarketplaceData);
            }, 500); // Simulate network delay
        });
    },
};