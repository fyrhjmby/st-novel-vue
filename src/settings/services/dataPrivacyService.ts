// src/settings/services/dataPrivacyService.ts

import * as api from '@/settings/api/dataPrivacyApi';
import type { DataCollectionSetting } from '@/settings/api/dataPrivacyApi';

export const loadDataPrivacyPageData = async () => {
    console.log('Service: Loading data privacy page data...');
    return await api.fetchDataPrivacyData();
};

export const saveCollectionSetting = async (setting: DataCollectionSetting) => {
    console.log('Service: Saving collection setting...');
    return await api.saveDataCollectionSetting(setting);
};