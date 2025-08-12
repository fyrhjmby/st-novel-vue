import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/settings/stores/userStore';

export const settingsRoutes: Array<RouteRecordRaw> = [
    {
        path: 'user',
        name: 'UserSettings',
        component: () => import('@/settings/views/UserSettings.vue'),
    },
    {
        path: 'api',
        name: 'ApiManagement',
        component: () => import('@/settings/views/ApiManagement.vue'),
    },
    {
        path: 'usage-logs',
        name: 'UsageLogs',
        component: () => import('@/settings/views/UsageLogs.vue'),
    },
    {
        path: 'system',
        name: 'SystemSettings',
        component: () => import('@/settings/views/SystemSettings.vue'),
    },
    {
        path: 'data-privacy',
        name: 'DataPrivacy',
        component: () => import('@/settings/views/DataPrivacy.vue'),
    },
    {
        path: 'help',
        name: 'HelpCenter',
        component: () => import('@/settings/views/HelpCenter.vue'),
    }
]

// Top-level wrapper for all settings routes with a beforeEnter guard
export const protectedSettingsRoutes: RouteRecordRaw = {
    path: '/settings',
    component: () => import('@/settings/layouts/SettingsLayout.vue'),
    redirect: '/settings/user',
    meta: { requiresAuth: true }, // Protect the entire settings module
    // This guard ensures that data is loaded before any settings component is rendered.
    beforeEnter: async (to, from, next) => {
        const userStore = useUserStore();
        // Check if the user data is already loaded.
        if (!userStore.user) {
            try {
                // Wait for the asynchronous data initialization to complete.
                await userStore.initializeSettings();
            } catch (error) {
                console.error("Failed to initialize user settings before entering route:", error);
                // Optionally, redirect to an error page or home
                // next({ name: 'home' });
                // return;
            }
        }
        // Proceed with navigation once data is ready.
        next();
    },
    children: settingsRoutes,
};