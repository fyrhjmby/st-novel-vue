// src/settings/api/systemSettingsApi.ts

export interface Theme {
    name: string;
    previewClass: string;
}

export interface SettingItem {
    title: string;
    description: string;
    enabled: boolean;
}

export interface SystemSettings {
    activeTheme: string;
    zoomLevel: number;
    language: string;
    dateFormat: string;
    notificationSettings: SettingItem[];
    appSettings: SettingItem[];
}

const mockThemes: Theme[] = [
    { name: '浅色', previewClass: 'bg-white border border-gray-200' },
    { name: '深色', previewClass: 'bg-gray-800 border border-gray-700' },
    { name: '跟随系统', previewClass: 'bg-gradient-to-tr from-white to-gray-800 border border-gray-400' },
];

const mockInitialSettings: SystemSettings = {
    activeTheme: '浅色',
    zoomLevel: 50,
    language: '简体中文',
    dateFormat: 'YYYY-MM-DD',
    notificationSettings: [
        { title: '产品更新', description: '获取关于新功能和改进的通知', enabled: true },
        { title: '使用提醒', description: '接近配额限制时收到提醒', enabled: true },
        { title: '安全警报', description: '异常登录或API使用时立即通知', enabled: true },
        { title: '营销邮件', description: '接收产品推荐和优惠信息', enabled: false },
    ],
    appSettings: [
        { title: '自动保存对话', description: '自动保存所有对话历史', enabled: true },
        { title: '快捷键启用', description: '使用键盘快捷键提高效率', enabled: true },
        { title: '开发者模式', description: '显示高级选项和调试信息', enabled: false },
    ]
};

export const fetchThemes = (): Promise<Theme[]> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(JSON.parse(JSON.stringify(mockThemes))), 200);
    });
};

export const fetchSystemSettings = (): Promise<SystemSettings> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(JSON.parse(JSON.stringify(mockInitialSettings))), 300);
    });
};

export const saveSystemSetting = <T extends keyof SystemSettings>(key: T, value: SystemSettings[T]): Promise<boolean> => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(`API: Saving System Setting -> ${key}:`, value);
            mockInitialSettings[key] = value;
            resolve(true);
        }, 150);
    });
};