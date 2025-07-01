import type { RouteRecordRaw } from 'vue-router'

export const chatRoutes: Array<RouteRecordRaw> = [
    {
        // 这里的路径将由小说的主路由文件处理
        // 例如，可以挂载在 /novel/chat 下
        path: 'chat',
        name: 'NovelChat',
        component: () => import('@/novel/chat/views/ChatView.vue'),
        meta: { title: 'AI聊天助手' }
    },
]