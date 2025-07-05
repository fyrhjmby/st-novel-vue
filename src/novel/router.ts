import type { RouteRecordRaw } from 'vue-router'
import { dashboardRoutes } from './dashboard/router'
import { managementRoutes } from './management/router'
import { chatRoutes } from './chat/router'
import { editorRoutes } from './editor/router'
import { contextPreviewRoutes } from './context_preview/router'

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
        // 修改：重定向到角色设定页面
        redirect: '/novel/manage/character-settings',
        children: [
            ...managementRoutes
        ]
    },
    // 编辑器模块的路由保持独立顶级注册
    ...editorRoutes,

    // 将聊天路由作为顶级模块进行注册
    ...chatRoutes,

    // 注册新的上下文预览模块路由
    ...contextPreviewRoutes,

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
    }
]