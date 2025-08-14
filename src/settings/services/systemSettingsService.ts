// src/settings/services/systemSettingsService.ts

import * as api from '@/settings/api/systemSettingsApi';
import type { SystemSettings } from '@/settings/api/systemSettingsApi';

export const loadInitialData = async () => {
    console.log('Service: Loading initial system settings data...');
    const [themes, settings] = await Promise.all([
        api.fetchThemes(),
        api.fetchSystemSettings(),
    ]);
    return { themes, settings };
};

export const saveSetting = async <T extends keyof SystemSettings>(key: T, value: SystemSettings[T]) => {
    console.log('Service: Saving setting...');
    return await api.saveSystemSetting(key, value);
};