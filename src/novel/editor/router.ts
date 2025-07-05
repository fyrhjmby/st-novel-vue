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
    }
]