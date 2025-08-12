import * as systemSettingsApi from '@/api/systemSettingsApi';
import type { SystemSettings, Theme, SettingItem } from '@/types/systemSettings';

export type { Theme, SettingItem, SystemSettings };

export const fetchThemes = (): Promise<Theme[]> => {
    return systemSettingsApi.fetchThemes();
};

export const fetchSystemSettings = (): Promise<SystemSettings> => {
    return systemSettingsApi.fetchSystemSettings();
};

export const saveSystemSetting = <T extends keyof SystemSettings>(key: T, value: SystemSettings[T]): Promise<boolean> => {
    console.log(`Module API: Forwarding save for ${key}`);
    return systemSettingsApi.saveSystemSetting(key, value);
};