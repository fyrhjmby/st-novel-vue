import apiClient from './client';
import type { User } from '@/types/auth';
import type { NotificationSetting, SecuritySetting } from '@/types/user';

export const fetchCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get('/users/me');
    return response.data;
};

export const fetchUserSettings = async (): Promise<{user: User, notifications: NotificationSetting[], securitySettings: SecuritySetting[], proPlanFeatures: string[]}> => {
    const response = await apiClient.get('/users/settings');
    return response.data;
};

export const saveUserSettings = async (settings: {
    user: User;
    notifications: NotificationSetting[];
}): Promise<boolean> => {
    await apiClient.put('/users/settings', settings);
    return true;
};