// src/settings/services/userService.ts

import * as userApi from '@/settings/api/userApi';
import type { BasicInfo, NotificationSetting } from '@/settings/api/userApi';

export const loadUserSettings = async () => {
    console.log('Service: Loading all user settings...');
    const [basicInfo, notifications, securitySettings, proPlanFeatures] = await Promise.all([
        userApi.fetchBasicInfo(),
        userApi.fetchNotifications(),
        userApi.fetchSecuritySettings(),
        userApi.fetchProPlanFeatures(),
    ]);

    return { basicInfo, notifications, securitySettings, proPlanFeatures };
};

export const saveChanges = async (settings: {
    basicInfo: BasicInfo[];
    notifications: NotificationSetting[];
}) => {
    console.log('Service: Saving user settings...');
    return await userApi.saveUserSettings(settings);
};