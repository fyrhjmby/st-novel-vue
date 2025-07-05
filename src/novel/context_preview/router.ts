import type { RouteRecordRaw } from 'vue-router'

export const contextPreviewRoutes: Array<RouteRecordRaw> = [
    {
        path: '/novel/context-preview',
        name: 'NovelContextPreview',
        component: () => import('@/novel/context_preview/views/ContextPreviewView.vue'),
        meta: { title: '上下文预览' }
    }
]