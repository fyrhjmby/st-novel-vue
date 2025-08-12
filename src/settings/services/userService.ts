import * as userApi from '@/settings/api/userApi';
import type { User } from '@/types/auth';
import type { NotificationSetting } from '@/settings/api/userApi';

export const loadUserSettings = async () => {
    console.log('Service: Loading all user settings...');
    return await userApi.fetchUserSettings();
};

export const saveChanges = async (settings: {
    user: User;
    notifications: NotificationSetting[];
}) => {
    console.log('Service: Saving user settings...');
    return await userApi.saveUserSettings(settings);
};