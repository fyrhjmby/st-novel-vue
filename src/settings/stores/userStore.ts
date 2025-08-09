// src/settings/stores/userStore.ts

import { defineStore } from 'pinia';
import * as userService from '@/settings/services/userService';
import type { BasicInfo, NotificationSetting, SecuritySetting } from '@/settings/api/userApi';
import { toRaw } from 'vue';

interface UserState {
    basicInfo: BasicInfo[];
    notifications: NotificationSetting[];
    securitySettings: SecuritySetting[];
    proPlanFeatures: string[];
    isLoading: boolean;
    isSaving: boolean;
    // Store original state to detect changes
    originalBasicInfo: string;
    originalNotifications: string;
}

export const useUserStore = defineStore('user-settings', {
    state: (): UserState => ({
        basicInfo: [],
        notifications: [],
        securitySettings: [],
        proPlanFeatures: [],
        isLoading: false,
        isSaving: false,
        originalBasicInfo: '[]',
        originalNotifications: '[]',
    }),

    getters: {
        hasChanges(state): boolean {
            const currentBasicInfo = JSON.stringify(toRaw(state.basicInfo));
            const currentNotifications = JSON.stringify(toRaw(state.notifications));
            return currentBasicInfo !== state.originalBasicInfo || currentNotifications !== state.originalNotifications;
        }
    },

    actions: {
        async initializeSettings() {
            if (this.basicInfo.length > 0) return;
            this.isLoading = true;
            try {
                const data = await userService.loadUserSettings();
                this.basicInfo = data.basicInfo;
                this.notifications = data.notifications;
                this.securitySettings = data.securitySettings;
                this.proPlanFeatures = data.proPlanFeatures;

                // Set original state after fetching
                this.originalBasicInfo = JSON.stringify(toRaw(this.basicInfo));
                this.originalNotifications = JSON.stringify(toRaw(this.notifications));
            } catch (error) {
                console.error('Failed to initialize user settings:', error);
            } finally {
                this.isLoading = false;
            }
        },

        async saveSettings() {
            if (!this.hasChanges) return;
            this.isSaving = true;
            try {
                await userService.saveChanges({
                    basicInfo: toRaw(this.basicInfo),
                    notifications: toRaw(this.notifications)
                });
                // Update original state upon successful save
                this.originalBasicInfo = JSON.stringify(toRaw(this.basicInfo));
                this.originalNotifications = JSON.stringify(toRaw(this.notifications));
                console.log("Store: Settings saved successfully!");
            } catch (error) {
                console.error('Failed to save user settings:', error);
            } finally {
                this.isSaving = false;
            }
        },

        resetChanges() {
            this.basicInfo = JSON.parse(this.originalBasicInfo);
            this.notifications = JSON.parse(this.originalNotifications);
        },

        updateNotification(notificationId: number, enabled: boolean) {
            const notification = this.notifications.find(n => n.id === notificationId);
            if (notification) {
                notification.enabled = enabled;
            }
        }
    }
});