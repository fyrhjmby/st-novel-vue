import type { RouteRecordRaw } from 'vue-router'

export const managementRoutes: Array<RouteRecordRaw> = [
    {
        path: 'character-settings',
        name: 'NovelCharacterSettings',
        component: () => import('@/novel/management/views/CharacterSettingsView.vue'),
        meta: { title: '角色设定' }
    },
    {
        path: 'worldview',
        name: 'NovelWorldview',
        component: () => import('@/novel/management/views/WorldviewView.vue'),
        meta: { title: '世界观' }
    },
    {
        path: 'settings',
        name: 'NovelSettings',
        component: () => import('@/novel/management/views/SettingsView.vue'),
        meta: { title: '小说设置' }
    },
    {
        path: 'context',
        name: 'NovelContext',
        component: () => import('@/novel/management/views/ContextView.vue'),
        meta: { title: '上下文管理' }
    },
    {
        path: 'export',
        name: 'NovelExport',
        component: () => import('@/novel/management/views/ExportView.vue'),
        meta: { title: '导出小说' }
    },
]