import type { RouteRecordRaw } from 'vue-router'

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