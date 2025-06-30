// src/settings/router.ts
import type { RouteRecordRaw } from 'vue-router'

export const settingsRoutes: Array<RouteRecordRaw> = [
    {
        path: 'user', // 对应 /settings/user
        name: 'UserSettings',
        component: () => import('@/settings/views/UserSettings.vue'),
    },
    {
        path: 'api', // 对应 /settings/api
        name: 'ApiManagement',
        component: () => import('@/settings/views/ApiManagement.vue'),
    },
    {
        path: 'usage-logs', // 对应 /settings/usage-logs
        name: 'UsageLogs',
        component: () => import('@/settings/views/UsageLogs.vue'),
    },
    {
        path: 'system', // 对应 /settings/system
        name: 'SystemSettings',
        component: () => import('@/settings/views/SystemSettings.vue'),
    },
    {
        path: 'data-privacy', // 对应 /settings/data-privacy
        name: 'DataPrivacy',
        component: () => import('@/settings/views/DataPrivacy.vue'),
    },
    {
        path: 'help',
        name: 'HelpCenter',
        component: () => import('@/settings/views/HelpCenter.vue'),
    }
]