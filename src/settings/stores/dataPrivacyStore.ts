// src/settings/stores/dataPrivacyStore.ts

import { defineStore } from 'pinia';
import * as service from '@/settings/services/dataPrivacyService';
import type { DataCollectionSetting, DataUsageItem, DataPermission } from '@/settings/api/dataPrivacyApi';

interface DataPrivacyState {
    dataCollectionSettings: DataCollectionSetting[];
    dataUsage: DataUsageItem[];
    dataPermissions: DataPermission[];
    promises: string[];
    isLoading: boolean;
}

export const useDataPrivacyStore = defineStore('data-privacy', {
    state: (): DataPrivacyState => ({
        dataCollectionSettings: [],
        dataUsage: [],
        dataPermissions: [],
        promises: [],
        isLoading: false,
    }),

    actions: {
        async initializeData() {
            if (this.dataCollectionSettings.length > 0) return; // Avoid refetching
            this.isLoading = true;
            try {
                const data = await service.loadDataPrivacyPageData();
                this.dataCollectionSettings = data.collectionSettings;
                this.dataUsage = data.usage;
                this.dataPermissions = data.permissions;
                this.promises = data.promises;
            } catch (error) {
                console.error('Failed to initialize data privacy data:', error);
            } finally {
                this.isLoading = false;
            }
        },

        async updateCollectionSetting(title: string, enabled: boolean) {
            const setting = this.dataCollectionSettings.find(s => s.title === title);
            if (setting) {
                setting.enabled = enabled;
                try {
                    // Fire-and-forget save operation
                    await service.saveCollectionSetting(setting);
                    console.log(`Store: Setting '${title}' updated and saved.`);
                } catch (error) {
                    console.error(`Failed to save setting '${title}':`, error);
                    // Optionally revert the change in UI
                    setting.enabled = !enabled;
                }
            }
        },
    },
});