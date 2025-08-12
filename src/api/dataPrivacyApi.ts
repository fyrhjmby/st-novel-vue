// src/api/dataPrivacyApi.ts
import apiClient from './client';
import type { DataCollectionSetting, DataUsageItem, DataPermission } from '@/types/dataPrivacy';

export const fetchDataPrivacyData = async (): Promise<{
    collectionSettings: DataCollectionSetting[],
    usage: DataUsageItem[],
    permissions: DataPermission[],
    promises: string[]
}> => {
    const response = await apiClient.get('/privacy/settings');
    return response.data;
};

export const saveDataCollectionSetting = async (setting: DataCollectionSetting): Promise<boolean> => {
    // 使用 PUT 或 PATCH 来更新单个设置项
    await apiClient.put('/privacy/collection-settings', setting);
    return true;
};