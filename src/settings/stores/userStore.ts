// src/settings/stores/userStore.ts

import { defineStore } from 'pinia';
import * as userService from '@/settings/services/userService';
import type { User } from '@/auth/types';
import type { NotificationSetting, SecuritySetting } from '@/settings/api/userApi';

interface UserState {
    user: User | null;
    notifications: NotificationSetting[];
    securitySettings: SecuritySetting[];
    proPlanFeatures: string[];
    isLoading: boolean;
    isSaving: boolean;
    // Store original state to detect changes
    originalUser: string;
    originalNotifications: string;
}

export const useUserStore = defineStore('user-settings', {
    state: (): UserState => ({
        user: null,
        notifications: [],
        securitySettings: [],
        proPlanFeatures: [],
        isLoading: false,
        isSaving: false,
        originalUser: '{}',
        originalNotifications: '[]',
    }),

    getters: {
        hasChanges(state): boolean {
            if (!state.user) return false;
            const currentUser = JSON.stringify(state.user);
            const currentNotifications = JSON.stringify(state.notifications);
            return currentUser !== state.originalUser || currentNotifications !== state.originalNotifications;
        }
    },

    actions: {
        async initializeSettings() {
            if (this.user) return;
            this.isLoading = true;
            try {
                const data = await userService.loadUserSettings();
                this.user = data.user;
                this.notifications = data.notifications;
                this.securitySettings = data.securitySettings;
                this.proPlanFeatures = data.proPlanFeatures;

                // Set original state after fetching
                this.originalUser = JSON.stringify(this.user);
                this.originalNotifications = JSON.stringify(this.notifications);
            } catch (error) {
                console.error('Failed to initialize user settings:', error);
            } finally {
                this.isLoading = false;
            }
        },

        async saveSettings() {
            if (!this.hasChanges || !this.user) return;
            this.isSaving = true;
            try {
                await userService.saveChanges({
                    user: this.user,
                    notifications: this.notifications
                });
                // Update original state upon successful save
                this.originalUser = JSON.stringify(this.user);
                this.originalNotifications = JSON.stringify(this.notifications);
                console.log("Store: Settings saved successfully!");
            } catch (error) {
                console.error('Failed to save user settings:', error);
            } finally {
                this.isSaving = false;
            }
        },

        resetChanges() {
            this.user = JSON.parse(this.originalUser);
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