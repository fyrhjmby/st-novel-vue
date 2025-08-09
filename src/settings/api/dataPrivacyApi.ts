// src/settings/api/dataPrivacyApi.ts

export interface DataCollectionSetting {
    title: string;
    description: string;
    enabled: boolean;
}

export interface DataUsageItem {
    title: string;
    tag: string;
    tagClass: string;
    includes: string;
    purpose: string;
}

export interface DataPermission {
    title: string;
    description: string;
    action: string;
    icon: string;
    containerClass: string;
    iconBgClass: string;
    descClass: string;
    buttonClass: string;
}

const mockDataCollectionSettings: DataCollectionSetting[] = [
    { title: '对话历史', description: '保存您与AI的对话记录以提供更好的服务', enabled: true },
    { title: '使用分析', description: '收集匿名使用数据以改进产品体验', enabled: true },
    { title: '性能监控', description: '收集性能数据以优化系统响应速度', enabled: false },
    { title: '错误报告', description: '自动发送错误报告帮助我们修复问题', enabled: true },
];

const mockDataUsage: DataUsageItem[] = [
    { title: '个人信息', tag: '加密存储', tagClass: 'bg-green-100 text-green-700', includes: '包括：姓名、邮箱、电话号码', purpose: '用途：账户管理、身份验证、客户支持' },
    { title: '对话数据', tag: '端到端加密', tagClass: 'bg-green-100 text-green-700', includes: '包括：对话内容、上传文件、生成结果', purpose: '用途：提供AI服务、改进模型、个性化体验' },
    { title: '使用数据', tag: '匿名化处理', tagClass: 'bg-blue-100 text-blue-700', includes: '包括：功能使用频率、响应时间、错误日志', purpose: '用途：产品改进、性能优化、问题诊断' },
];

const mockDataPermissions: DataPermission[] = [
    { title: '导出数据', description: '下载您的所有个人数据副本', action: '立即导出', icon: `<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/></svg>`, containerClass: 'border border-gray-200 hover:border-gray-300', iconBgClass: 'bg-blue-100', descClass: 'text-[#6B7280]', buttonClass: 'text-[#3B82F6]' },
    { title: '数据迁移', description: '将数据转移到其他服务', action: '开始迁移', icon: `<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>`, containerClass: 'border border-gray-200 hover:border-gray-300', iconBgClass: 'bg-green-100', descClass: 'text-[#6B7280]', buttonClass: 'text-[#3B82F6]' },
    { title: '暂停收集', description: '临时停止数据收集活动', action: '暂停收集', icon: `<svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`, containerClass: 'border border-gray-200 hover:border-gray-300', iconBgClass: 'bg-yellow-100', descClass: 'text-[#6B7280]', buttonClass: 'text-[#3B82F6]' },
    { title: '删除数据', description: '永久删除所有数据', action: '请求删除', icon: `<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>`, containerClass: 'border border-red-200 hover:border-red-300 bg-red-50', iconBgClass: 'bg-red-100', descClass: 'text-red-600', buttonClass: 'text-red-600' },
];

const mockPromises: string[] = [
    '不会出售您的个人数据',
    '仅在必要时与服务提供商共享数据',
    '所有第三方必须遵守我们的隐私标准',
    '您可以随时撤销数据共享许可',
];


export const fetchDataPrivacyData = (): Promise<{
    collectionSettings: DataCollectionSetting[],
    usage: DataUsageItem[],
    permissions: DataPermission[],
    promises: string[]
}> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                collectionSettings: JSON.parse(JSON.stringify(mockDataCollectionSettings)),
                usage: JSON.parse(JSON.stringify(mockDataUsage)),
                permissions: JSON.parse(JSON.stringify(mockDataPermissions)),
                promises: JSON.parse(JSON.stringify(mockPromises)),
            });
        }, 300);
    });
};

export const saveDataCollectionSetting = (setting: DataCollectionSetting): Promise<boolean> => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('API: Saving data collection setting', setting);
            const index = mockDataCollectionSettings.findIndex(s => s.title === setting.title);
            if (index !== -1) {
                mockDataCollectionSettings[index] = setting;
            }
            resolve(true);
        }, 200);
    });
};