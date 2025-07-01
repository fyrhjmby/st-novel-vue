import type { RouteRecordRaw } from 'vue-router'

export const dashboardRoutes: Array<RouteRecordRaw> = [
    {
        // 注意：这里的路径是相对于父路由的，父路由将定义为 /novel
        path: 'dashboard',
        name: 'NovelDashboard',
        component: () => import('@/novel/dashboard/views/DashboardView.vue'),
        meta: { title: '我的小说' }
    },
    {
        path: 'recent',
        name: 'NovelRecent',
        component: () => import('@/novel/dashboard/views/RecentView.vue'), // 路径已更新
        meta: { title: '最近编辑' }
    },
    {
        path: 'trash',
        name: 'NovelTrash',
        component: () => import('@/novel/dashboard/views/TrashView.vue'), // 路径已更新
        meta: { title: '回收站' }
    },
    {
        path: 'import',
        name: 'NovelImport',
        component: () => import('@/novel/dashboard/views/ImportView.vue'), // 路径已更新
        meta: { title: '导入小说' }
    },
]