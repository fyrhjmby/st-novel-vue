import type { RouteRecordRaw } from 'vue-router'

export const promptRoutes: Array<RouteRecordRaw> = [
    {
        path: '/prompt',
        component: () => import('@/prompt/layouts/PromptRootLayout.vue'),
        redirect: '/prompt/market',
        children: [
            {
                path: 'market',
                name: 'prompt-market',
                component: () => import('@/prompt/views/PromptMarket.vue'),
                meta: { title: '提示词市场' }
            },
            {
                path: 'favorites',
                name: 'prompt-favorites',
                component: () => import('@/prompt/views/MyFavorites.vue'),
                meta: { title: '我的收藏' }
            },
            {
                path: 'my',
                name: 'prompt-my',
                component: () => import('@/prompt/views/MyPrompts.vue'),
                meta: { title: '我的提示词' }
            },
            {
                path: 'statistics',
                name: 'prompt-statistics',
                component: () => import('@/prompt/views/UsageStatistics.vue'),
                meta: { title: '使用统计' }
            },
            {
                path: 'editor',
                name: 'prompt-editor-new',
                component: () => import('@/prompt/views/PromptEditor.vue'),
                meta: { title: '新建提示词' }
            },
            {
                path: 'editor/:id',
                name: 'prompt-editor-edit',
                component: () => import('@/prompt/views/PromptEditor.vue'),
                meta: { title: '编辑提示词' }
            },
            {
                path: 'market/:id',
                name: 'prompt-detail',
                component: () => import('@/prompt/views/PromptDetail.vue'),
                meta: { title: '提示词详情' }
            },
        ]
    }
];