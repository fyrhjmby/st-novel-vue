import type { RouteRecordRaw } from 'vue-router'

export const editorRoutes: Array<RouteRecordRaw> = [
    {
        path: '/novel/editor',
        component: () => import('@/novel/editor/layouts/NovelEditorLayout.vue'),
        children: [
            {
                path: '',
                name: 'NovelEditorWorkspace',
                component: () => import('@/novel/editor/views/EditorWorkspaceView.vue'),
                meta: { title: '小说编辑器' }
            }
        ]
    },
    {
        path: '/novel/read',
        name: 'NovelReader',
        component: () => import('@/novel/editor/views/ReaderView.vue'),
        meta: { title: '阅读模式' }
    },
    {
        path: '/novel/history',
        component: () => import('@/novel/editor/layouts/NovelHistoryLayout.vue'),
        children: [
            {
                path: '',
                name: 'NovelHistory',
                component: () => import('@/novel/editor/views/HistoryView.vue'),
                meta: { title: '版本历史' }
            }
        ]
    }
]