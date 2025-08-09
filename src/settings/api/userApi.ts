// src/settings/api/userApi.ts

export interface BasicInfo {
    label: string;
    value: string;
    editable: boolean;
    fullWidth?: boolean;
    type?: 'text' | 'textarea';
}

export interface NotificationSetting {
    id: number;
    title: string;
    description: string;
    enabled: boolean;
}

export interface SecuritySetting {
    title:string;
    status: string;
    statusClass: string;
    action: string;
}

const mockBasicInfo: BasicInfo[] = [
    { label: '用户名', value: 'zhangxiaoming', editable: false, type: 'text' },
    { label: '昵称', value: '张小明', editable: true, type: 'text' },
    { label: '电子邮箱', value: 'xiaoming@example.com', editable: true, type: 'text' },
    { label: '手机号码', value: '+86 138****8888', editable: true, type: 'text' },
    { label: '所在地区', value: '中国大陆', editable: true, type: 'text' },
    { label: '时区', value: 'UTC+8 北京时间', editable: true, type: 'text' },
    { label: '个人简介', value: '热爱技术，专注于AI和机器学习领域。对新技术充满好奇，享受解决复杂问题的过程。', editable: true, fullWidth: true, type: 'textarea' },
];

const mockNotifications: NotificationSetting[] = [
    { id: 1, title: '邮件通知', description: '接收产品更新和重要通知', enabled: true },
    { id: 2, title: '短信通知', description: '账户安全相关的短信提醒', enabled: false },
    { id: 3, title: '营销推送', description: '优惠活动和新功能推荐', enabled: false },
    { id: 4, title: '浏览器通知', description: '在浏览器中接收实时通知', enabled: true },
];

const mockSecuritySettings: SecuritySetting[] = [
    { title: '修改密码', status: '上次修改：2024年3月15日', statusClass: 'text-[#9CA3AF]', action: '修改' },
    { title: '双重验证 (2FA)', status: '未启用', statusClass: 'text-red-500', action: '启用' },
    { title: '登录设备', status: '当前有 3 个活跃设备', statusClass: 'text-[#9CA3AF]', action: '管理' },
    { title: '登录历史', status: '查看最近的登录活动', statusClass: 'text-[#9CA3AF]', action: '查看' },
];

const mockProPlanFeatures: string[] = [
    '每月 50万 tokens',
    'GPT-4 & Claude 3 访问权限',
    '优先响应 & 技术支持'
];

export const fetchBasicInfo = (): Promise<BasicInfo[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(mockBasicInfo)));
        }, 300);
    });
};

export const fetchNotifications = (): Promise<NotificationSetting[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(mockNotifications)));
        }, 400);
    });
};

export const fetchSecuritySettings = (): Promise<SecuritySetting[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(mockSecuritySettings)));
        }, 500);
    });
};

export const fetchProPlanFeatures = (): Promise<string[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(JSON.parse(JSON.stringify(mockProPlanFeatures)));
        }, 200);
    });
};

export const saveUserSettings = (settings: {
    basicInfo: BasicInfo[];
    notifications: NotificationSetting[];
}): Promise<boolean> => {
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('API: Saving User Settings...', settings);

            // Simulate saving basic info by updating the mock data
            settings.basicInfo.forEach(newInfo => {
                const existingInfo = mockBasicInfo.find(i => i.label === newInfo.label);
                if (existingInfo) {
                    existingInfo.value = newInfo.value;
                }
            });

            // Simulate saving notifications by updating the mock data
            settings.notifications.forEach(newNotification => {
                const existingNotification = mockNotifications.find(n => n.id === newNotification.id);
                if (existingNotification) {
                    existingNotification.enabled = newNotification.enabled;
                }
            });

            resolve(true);
        }, 600);
    });
};