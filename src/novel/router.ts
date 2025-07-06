import type { RouteRecordRaw } from 'vue-router'
import { dashboardRoutes } from './dashboard/router'
import { editorRoutes } from './editor/router'

export const novelRoutes: Array<RouteRecordRaw> = [
    {
        path: '/novel',
        component: () => import('@/novel/layouts/NovelDashboardLayout.vue'),
        redirect: '/novel/dashboard',
        children: [
            ...dashboardRoutes
        ]
    },
    ...editorRoutes,
]