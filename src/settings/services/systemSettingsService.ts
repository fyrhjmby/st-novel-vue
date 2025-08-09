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
};// src/settings/stores/systemSettingsStore.ts

import { defineStore } from 'pinia';
import * as service from '@/settings/services/systemSettingsService';
import type { Theme, SettingItem } from '@/settings/api/systemSettingsApi';

interface SystemSettingsState {
    themes: Theme[];
    activeTheme: string;
    zoomLevel: number;
    language: string;
    dateFormat: string;
    notificationSettings: SettingItem[];
    appSettings: SettingItem[];
    isLoading: boolean;
}

export const useSystemSettingsStore = defineStore('system-settings', {
    state: (): SystemSettingsState => ({
        themes: [],
        activeTheme: '',
        zoomLevel: 50,
        language: '',
        dateFormat: '',
        notificationSettings: [],
        appSettings: [],
        isLoading: false,
    }),

    actions: {
        async initializeSettings() {
            if (this.themes.length > 0) return;
            this.isLoading = true;
            try {
                const data = await service.loadInitialData();
                this.themes = data.themes;
                const { settings } = data;
                this.activeTheme = settings.activeTheme;
                this.zoomLevel = settings.zoomLevel;
                this.language = settings.language;
                this.dateFormat = settings.dateFormat;
                this.notificationSettings = settings.notificationSettings;
                this.appSettings = settings.appSettings;
            } catch (error) {
                console.error('Failed to initialize system settings:', error);
            } finally {
                this.isLoading = false;
            }
        },

        async updateTheme(themeName: string) {
            this.activeTheme = themeName;
            await service.saveSetting('activeTheme', themeName);
        },

        // For slider, we might not want to save on every single change event
        updateZoomLevel(level: number) {
            this.zoomLevel = level;
            // In a real app, you might debounce this save call
            // service.saveSetting('zoomLevel', level);
        },

        async updateSetting(type: 'notification' | 'app', title: string, enabled: boolean) {
            const list = type === 'notification' ? this.notificationSettings : this.appSettings;
            const setting = list.find(s => s.title === title);
            if (setting) {
                setting.enabled = enabled;
                // Fire-and-forget the save
                if (type === 'notification') {
                    await service.saveSetting('notificationSettings', this.notificationSettings);
                } else {
                    await service.saveSetting('appSettings', this.appSettings);
                }
            }
        },
    },
});