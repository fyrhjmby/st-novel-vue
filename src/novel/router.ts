import type { RouteRecordRaw } from 'vue-router'

export const novelRoutes: Array<RouteRecordRaw> = [
    {
        path: '/novel',
        component: () => import('@/novel/layouts/NovelDashboardLayout.vue'),
        redirect: '/novel/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'NovelDashboard',
                component: () => import('@/novel/views/NovelDashboard.vue'),
                meta: { title: '我的小说' }
            },
            {
                path: 'recent',
                name: 'NovelRecent',
                component: () => import('@/novel/views/NovelRecent.vue'),
                meta: { title: '最近编辑' }
            },
            {
                path: 'trash',
                name: 'NovelTrash',
                component: () => import('@/novel/views/NovelTrash.vue'),
                meta: { title: '回收站' }
            },
            {
                path: 'import',
                name: 'NovelImport',
                component: () => import('@/novel/views/NovelImport.vue'),
                meta: { title: '导入小说' }
            },
        ]
    },
    {
        path: '/novel/manage',
        component: () => import('@/novel/layouts/NovelManagementLayout.vue'),
        redirect: '/novel/manage/outline',
        children: [
            {
                path: 'outline',
                name: 'NovelOutline',
                component: () => import('@/novel/views/NovelOutline.vue'),
                meta: { title: '大纲视图' }
            },
            {
                path: 'character-settings',
                name: 'NovelCharacterSettings',
                component: () => import('@/novel/views/CharacterSettings.vue'),
                meta: { title: '角色设定' }
            },
            {
                path: 'worldview',
                name: 'NovelWorldview',
                component: () => import('@/novel/views/NovelWorldview.vue'),
                meta: { title: '世界观' }
            },
            {
                path: 'settings',
                name: 'NovelSettings',
                component: () => import('@/novel/views/NovelSettings.vue'),
                meta: { title: '小说设置' }
            },
            {
                path: 'context',
                name: 'NovelContext',
                component: () => import('@/novel/views/NovelContext.vue'),
                meta: { title: '上下文管理' }
            },
            {
                path: 'export',
                name: 'NovelExport',
                component: () => import('@/novel/views/NovelExport.vue'),
                meta: { title: '导出小说' }
            },
            {
                path: 'history',
                name: 'NovelHistory',
                component: () => import('@/novel/views/NovelHistory.vue'),
                meta: { title: '版本历史' }
            },
            {
                path: 'chat',
                name: 'NovelChat',
                component: () => import('@/novel/views/NovelChat.vue'),
                meta: { title: 'AI聊天助手' }
            },
        ]
    },
    {
        path: '/novel/editor',
        name: 'NovelEditor',
        component: () => import('@/novel/views/EditorView.vue'),
        meta: { title: '编辑章节' }
    },
    {
        path: '/novel/read',
        name: 'NovelReader',
        component: () => import('@/novel/views/NovelReaderView.vue'),
        meta: { title: '阅读模式' }
    },
    {
        path: '/novel/context-provider',
        name: 'NovelContextProvider',
        component: () => import('@/novel/views/NovelContextProvider.vue'),
        meta: { title: '上下文预览' }
    }
]