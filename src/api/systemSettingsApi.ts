import apiClient from './client';
import type { Theme, SystemSettings } from '@/types/systemSettings';

export const fetchThemes = async (): Promise<Theme[]> => {
    const response = await apiClient.get('/system/themes');
    return response.data;
};

export const fetchSystemSettings = async (): Promise<SystemSettings> => {
    const response = await apiClient.get('/system/settings');
    return response.data;
};

export const saveSystemSetting = async <T extends keyof SystemSettings>(key: T, value: SystemSettings[T]): Promise<boolean> => {
    // 使用 PATCH 请求来更新部分设置
    await apiClient.patch('/system/settings', { [key]: value });
    return true;
};