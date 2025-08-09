import type { Prompt, Feature, Example } from '@/prompt/types/prompt';

const communicationMasterFeatures: Feature[] = [
    { title: '话术转换', description: '将直白表达转为委婉得体的沟通方式', icon: `<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>`, bgClass: 'bg-blue-50', iconBgClass: 'bg-blue-100' },
    { title: '场景适配', description: '根据不同场合提供最合适的表达建议', icon: `<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`, bgClass: 'bg-green-50', iconBgClass: 'bg-green-100' },
    { title: '多种风格', description: '提供正式、友好、幽默等多种沟通风格', icon: `<svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>`, bgClass: 'bg-purple-50', iconBgClass: 'bg-purple-100' },
    { title: '即时优化', description: '快速生成多个优化版本供选择', icon: `<svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`, bgClass: 'bg-yellow-50', iconBgClass: 'bg-yellow-100' }
];

const communicationMasterExamples: Example[] = [
    { tag: '职场汇报', original: '"项目搞砸了，预算超了50%，时间也延期了。"', optimized: '"关于XX项目，我需要向您汇报一些挑战。目前项目遇到了一些预料之外的困难，导致预算超出原计划50%，交付时间也需要相应调整。我已经准备了详细的问题分析和解决方案..."', borderColorClass: 'border-blue-500', tagBgClass: 'text-blue-600 bg-blue-100' },
    { tag: '拒绝请求', original: '"不行，这个需求太离谱了，做不了。"', optimized: '"感谢您的信任。我仔细评估了这个需求，考虑到目前的资源限制和技术可行性，恐怕短期内难以实现。不过，我有一个替代方案可能会帮助您达到类似的效果..."', borderColorClass: 'border-green-500', tagBgClass: 'text-green-600 bg-green-100' }
];

// 模拟数据库
const mockPrompts: Prompt[] = [
    {
        id: '1',
        title: '高情商沟通大师',
        description: '将任何直白、生硬的表达，转化为礼貌、得体且不失分寸的话术。',
        icon: `<svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>`,
        iconBgClass: 'bg-blue-50',
        tag: '沟通交流',
        tagClass: 'text-[#10B981] bg-green-50',
        likes: 1800,
        views: 12300,
        usage: 12300,
        author: '李欣然',
        authorAvatarClass: 'bg-gradient-to-br from-indigo-100 to-purple-100',
        status: '公开',
        updated: '更新于 3天前',
        isHot: false,
        isFavorite: false,
        features: communicationMasterFeatures,
        examples: communicationMasterExamples,
    },
    {
        id: '2',
        title: '爆款文案生成器',
        description: '根据产品特点和目标用户，生成引人注目的营销文案。',
        icon: `<svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L13.196 5.196z"/></svg>`,
        iconBgClass: 'bg-purple-50',
        tag: '写作',
        tagClass: 'text-[#3B82F6] bg-blue-50',
        likes: 2300,
        views: 18500,
        author: '王小美',
        authorAvatarClass: 'bg-gradient-to-br from-pink-100 to-rose-100',
        status: '公开',
        isFavorite: true,
    },
    {
        id: '3',
        title: '代码优化助手',
        description: '分析代码并提供性能优化、可读性改进的建议。',
        icon: `<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>`,
        iconBgClass: 'bg-green-50',
        tag: '编程',
        tagClass: 'text-[#EF4444] bg-red-50',
        likes: 956,
        views: 7200,
        author: '张程序',
        authorAvatarClass: 'bg-gradient-to-br from-blue-100 to-cyan-100',
        status: '公开',
        isFavorite: true,
    },
    {
        id: '4',
        title: '周报生成器',
        description: '根据本周工作要点，自动生成结构清晰、重点突出的周报。',
        icon: `<svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>`,
        iconBgClass: 'bg-purple-50',
        tag: '文案写作',
        tagClass: 'text-[#2563EB] bg-blue-100',
        status: '私有',
        likes: 0,
        views: 1200,
        usage: 856,
        author: '李欣然',
        authorAvatarClass: 'bg-gradient-to-br from-indigo-100 to-purple-100',
        updated: '更新于 1周前',
        isHot: false,
        isFavorite: false,
    },
    {
        id: '5',
        title: '旅游行程规划',
        description: '根据目的地、预算和偏好，生成详细的旅游行程安排。',
        icon: `<svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
        iconBgClass: 'bg-yellow-50',
        tag: '生活娱乐',
        tagClass: 'text-[#F59E0B] bg-yellow-100',
        status: '公开',
        likes: 3200,
        views: 28700,
        usage: 28700,
        author: '旅行家小赵',
        authorAvatarClass: 'bg-gradient-to-br from-green-100 to-lime-100',
        updated: '更新于 2周前',
        isHot: true,
        isFavorite: false,
    }
];

// 模拟网络延迟
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getPrompts = async (): Promise<Prompt[]> => {
    await simulateDelay(300);
    return JSON.parse(JSON.stringify(mockPrompts));
};

export const getPrompt = async (id: string): Promise<Prompt | undefined> => {
    await simulateDelay(200);
    return JSON.parse(JSON.stringify(mockPrompts.find(p => p.id === id)));
};

export const createPrompt = async (promptData: Omit<Prompt, 'id'>): Promise<Prompt> => {
    await simulateDelay(400);
    const newPrompt: Prompt = {
        id: String(Date.now()),
        ...promptData,
        likes: 0,
        views: 0,
        usage: 0,
        isHot: false,
        isFavorite: false,
    };
    mockPrompts.push(newPrompt);
    return JSON.parse(JSON.stringify(newPrompt));
};

export const updatePrompt = async (id: string, updates: Partial<Prompt>): Promise<Prompt | undefined> => {
    await simulateDelay(400);
    const index = mockPrompts.findIndex(p => p.id === id);
    if (index !== -1) {
        mockPrompts[index] = { ...mockPrompts[index], ...updates };
        return JSON.parse(JSON.stringify(mockPrompts[index]));
    }
    return undefined;
};

export const deletePrompt = async (id: string): Promise<boolean> => {
    await simulateDelay(500);
    const index = mockPrompts.findIndex(p => p.id === id);
    if (index !== -1) {
        mockPrompts.splice(index, 1);
        return true;
    }
    return false;
};