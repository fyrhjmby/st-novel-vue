import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { settingsRoutes } from '@/settings/router'
import { novelRoutes } from "@novel/router.ts";
import { promptRoutes } from "@/prompt/router";
import {workflowRoutes} from "@workflow/router.ts";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        component: DefaultLayout,
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('@/home.vue'),
                meta: { title: '工作台' },
            },
        ],
    },
    ...novelRoutes,
    ...promptRoutes,
    ...workflowRoutes,
    {
        path: '/settings',
        component: () => import('@/settings/layouts/SettingsLayout.vue'),
        redirect: '/settings/user',
        children: settingsRoutes,
    },
    {
        path: '/vip',
        name: 'VipPlan',
        component: () => import('@/settings/views/Vip.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    },
})

export default router