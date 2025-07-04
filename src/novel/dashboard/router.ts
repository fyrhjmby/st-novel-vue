import type { RouteRecordRaw } from 'vue-router'

export const dashboardRoutes: Array<RouteRecordRaw> = [
    {
        path: 'dashboard',
        name: 'NovelDashboard',
        component: () => import('@/novel/dashboard/views/DashboardView.vue'),
        meta: { title: '我的小说' }
    },
    {
        path: 'recent',
        name: 'NovelRecent',
        component: () => import('@/novel/dashboard/views/RecentView.vue'),
        meta: { title: '最近编辑' }
    },
    {
        path: 'trash',
        name: 'NovelTrash',
        component: () => import('@/novel/dashboard/views/TrashView.vue'),
        meta: { title: '回收站' }
    },
    {
        path: 'import',
        name: 'NovelImport',
        component: () => import('@/novel/dashboard/views/ImportView.vue'),
        meta: { title: '导入小说' }
    },
    {
        path: 'new',
        name: 'NovelNew',
        component: () => import('@/novel/dashboard/views/NewNovelView.vue'),
        meta: { title: '新建小说' }
    },
]