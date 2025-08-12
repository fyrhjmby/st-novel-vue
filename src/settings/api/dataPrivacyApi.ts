import * as dataPrivacyApi from '@/api/dataPrivacyApi';
import type { DataCollectionSetting, DataUsageItem, DataPermission } from '@/types/dataPrivacy';

export type { DataCollectionSetting, DataUsageItem, DataPermission };

export const fetchDataPrivacyData = (): Promise<{
    collectionSettings: DataCollectionSetting[],
    usage: DataUsageItem[],
    permissions: DataPermission[],
    promises: string[]
}> => {
    return dataPrivacyApi.fetchDataPrivacyData();
};

export const saveDataCollectionSetting = (setting: DataCollectionSetting): Promise<boolean> => {
    return dataPrivacyApi.saveDataCollectionSetting(setting);
};