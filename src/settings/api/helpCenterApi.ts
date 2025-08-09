// src/settings/api/helpCenterApi.ts

export interface HelpCategory {
    title: string;
    description: string;
    icon: string;
    bgColor: string;
}

const mockHelpCategories: HelpCategory[] = [
    {
        title: '入门指南',
        description: '快速开始使用我们的平台。',
        icon: `<svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-9.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path d="M12 14l9-5-9-5-9 5 9 5z" stroke-opacity=".4"></path></svg>`,
        bgColor: 'bg-blue-100'
    },
    {
        title: '账户与计费',
        description: '管理您的账户、订阅和付款方式。',
        icon: `<svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>`,
        bgColor: 'bg-green-100'
    },
    {
        title: 'API与集成',
        description: '了解如何使用API和集成第三方服务。',
        icon: `<svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>`,
        bgColor: 'bg-purple-100'
    },
];

const mockPopularQuestions: string[] = [
    '如何重置我的密码？',
    '支持哪些付款方式？',
    '我可以取消我的订阅吗？',
    '如何获取我的API密钥？',
    'Token是如何计算和消耗的？',
];

export const fetchHelpData = (): Promise<{ categories: HelpCategory[], questions: string[] }> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                categories: JSON.parse(JSON.stringify(mockHelpCategories)),
                questions: JSON.parse(JSON.stringify(mockPopularQuestions)),
            });
        }, 300);
    });
};