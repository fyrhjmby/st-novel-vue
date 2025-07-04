import type { RouteRecordRaw } from 'vue-router'
import { dashboardRoutes } from './dashboard/router'
import { managementRoutes } from './management/router'
import { chatRoutes } from './chat/router'
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
    {
        // 管理模块保持独立，因为它使用不同的布局
        path: '/novel/manage',
        component: () => import('@/novel/layouts/NovelManagementLayout.vue'),
        redirect: '/novel/manage/outline',
        children: [
            ...managementRoutes
        ]
    },
    // 编辑器模块的路由保持独立顶级注册
    ...editorRoutes,

    // 将聊天路由作为顶级模块进行注册
    ...chatRoutes,

    // 其他独立页面路由
    {
        path: '/novel/read',
        name: 'NovelReader',
        component: () => import('@novel/editor/views/ReaderView.vue'),
        meta: { title: '阅读模式' }
    },
    {
        path: '/novel/history',
        component: () => import('@novel/editor/layouts/NovelHistoryLayout.vue'),
        children: [
            {
                path: '',
                name: 'NovelHistory',
                component: () => import('@novel/editor/views/HistoryView.vue'),
                meta: { title: '版本历史' }
            }
        ]
    },
    {
        path: '/novel/context-provider',
        name: 'NovelContextProvider',
        component: () => import('@/novel/management/views/ContextProviderView.vue'),
        meta: { title: '上下文预览' }
    }
]