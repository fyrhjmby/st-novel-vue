// =
// 文件: ..\src\novel\router.ts
//

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
        ]
    },
    // 小说管理页面 (除编辑器外)
    {
        path: '/novel/manage/:id',
        component: () => import('@/novel/layouts/NovelManagementLayout.vue'),
        redirect: to => `/novel/manage/${to.params.id}/outline`,
        children: [
            // 注意：'editor' 路径已完全移除
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
            }
        ]
    },
    // 小说编辑器专属路由，使用新的 EditorView
    {
        path: '/novel/editor/:id?',
        name: 'NovelEditor',
        // 入口指向新的、独立的编辑器视图
        component: () => import('@/novel/views/EditorView.vue'),
        meta: { title: '编辑章节' }
    }
]