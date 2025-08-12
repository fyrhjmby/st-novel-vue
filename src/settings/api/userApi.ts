import * as userApi from '@/api/userApi';
import type { User } from '@/auth/types';

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

export const fetchUserSettings = (): Promise<{user: User, notifications: NotificationSetting[], securitySettings: SecuritySetting[], proPlanFeatures: string[]}> => {
    return userApi.fetchUserSettings();
};

export const saveUserSettings = (settings: {
    user: User;
    notifications: NotificationSetting[];
}): Promise<boolean> => {
    return userApi.saveUserSettings(settings);
};