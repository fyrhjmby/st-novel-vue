import type { RouteRecordRaw } from 'vue-router'

export const editorRoutes: Array<RouteRecordRaw> = [
    {
        path: '/novel/editor',
        component: () => import('@/novel/editor/layouts/NovelEditorLayout.vue'),
        children: [
            {
                // 子路由，当路径为 /novel/editor 时，它会作为默认子路由被匹配
                path: '',
                name: 'NovelEditorWorkspace',
                // 这个子路由负责渲染实际的工作区视图
                component: () => import('@/novel/editor/views/EditorWorkspaceView.vue'),
                meta: { title: '小说编辑器' }
            }
        ]
    }
]