import type { RouteRecordRaw } from 'vue-router'

export const chatRoutes: Array<RouteRecordRaw> = [
    {
        path: '/novel/chat',
        component: () => import('@/novel/layouts/NovelChatLayout.vue'),
        children: [
            {
                path: '',
                name: 'NovelChat',
                component: () => import('@/novel/chat/views/ChatView.vue'),
                meta: { title: 'AI聊天助手' }
            }
        ]
    },
]