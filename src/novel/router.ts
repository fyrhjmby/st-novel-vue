import type { RouteRecordRaw } from 'vue-router'
import { dashboardRoutes } from './dashboard/router'
import { managementRoutes } from './management/router'
import { chatRoutes } from './chat/router'

export const novelRoutes: Array<RouteRecordRaw> = [
    {
        path: '/novel',
        component: () => import('@/novel/layouts/NovelDashboardLayout.vue'),
        redirect: '/novel/dashboard',
        // Dashboard 模块的路由
        children: [
            ...dashboardRoutes
        ]
    },
    {
        path: '/novel/manage',
        component: () => import('@/novel/layouts/NovelManagementLayout.vue'),
        redirect: '/novel/manage/outline',
        // Management 和 Chat 模块的路由都挂载在这个布局下
        children: [
            ...managementRoutes,
            ...chatRoutes
        ]
    },
    {
        path: '/novel/editor',
        name: 'NovelEditor',
        component: () => import('@novel/management/views/editor/EditorView.vue'),
        meta: { title: '编辑章节' }
    },
    {
        path: '/novel/read',
        name: 'NovelReader',
        component: () => import('@/novel/management/views/ReaderView.vue'),
        meta: { title: '阅读模式' }
    },
    {
        path: '/novel/context-provider',
        name: 'NovelContextProvider',
        component: () => import('@/novel/management/views/ContextProviderView.vue'),
        meta: { title: '上下文预览' }
    }
]