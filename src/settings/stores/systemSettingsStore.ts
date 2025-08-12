// 文件: ..\src/settings/stores/systemSettingsStore.ts

import { defineStore } from 'pinia';
import * as service from '@/settings/services/systemSettingsService';
import type { Theme, SettingItem, SystemSettings } from '@/types/systemSettings';

// The state should directly mirror the SystemSettings type for consistency
interface SystemSettingsState extends SystemSettings {
    themes: Theme[];
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
                const { themes, settings } = await service.loadInitialData();
                this.themes = themes;
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

        async saveSetting<T extends keyof SystemSettings>(key: T, value: SystemSettings[T]) {
            // Optimistically update the state
            (this as any)[key] = value;
            try {
                await service.saveSetting(key, value);
            } catch (error) {
                console.error(`Failed to save setting ${key}:`, error);
                // Optionally revert the change here if the API call fails
                // await this.initializeSettings(); // or some other rollback logic
            }
        },

        async updateTheme(themeName: string) {
            await this.saveSetting('activeTheme', themeName);
        },

        updateZoomLevel(level: number) {
            this.zoomLevel = level;
        },

        async saveZoomLevel() {
            await this.saveSetting('zoomLevel', this.zoomLevel);
        },

        async updateToggleSetting(type: 'notification' | 'app', title: string, enabled: boolean) {
            const listKey = type === 'notification' ? 'notificationSettings' : 'appSettings';
            const list = this[listKey];
            const setting = list.find(s => s.title === title);

            if (setting) {
                setting.enabled = enabled;
                // Save the entire updated array
                await this.saveSetting(listKey, [...list]);
            }
        },
    },
});