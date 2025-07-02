import type { RouteRecordRaw } from 'vue-router'

export const chatRoutes: Array<RouteRecordRaw> = [
    {

        path: 'chat',
        name: 'NovelChat',
        component: () => import('@/novel/chat/views/ChatView.vue'),
        meta: { title: 'AI聊天助手' }
    },
]