import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { settingsRoutes } from '@/settings/router'
import { novelRoutes } from "@novel/router.ts";
import { promptRoutes } from "@/prompt/router";
import { workflowRoutes } from "@workflow/router.ts";
import { authRoutes } from "@/auth/router";
import { useAuthStore } from "@/auth/store/auth.store";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home',
    },
    ...authRoutes,
    {
        path: '/home',
        component: DefaultLayout,
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('@/home.vue'),
                meta: { title: '工作台', requiresAuth: true },
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
        meta: { requiresAuth: true }, // 保护整个 settings 模块
    },
    {
        path: '/vip',
        name: 'VipPlan',
        component: () => import('@/settings/views/Vip.vue'),
        meta: { requiresAuth: true },
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

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAuthRoute = to.path.startsWith('/auth');

    if (requiresAuth && !authStore.isLoggedIn) {
        // 如果路由需要认证但用户未登录，重定向到登录页
        next({ name: 'Login', query: { redirect: to.fullPath } });
    } else if (isAuthRoute && authStore.isLoggedIn) {
        // 如果用户已登录，但访问的是认证页面（登录/注册），重定向到主页
        next({ name: 'home' });
    } else {
        // 其他情况，正常放行
        next();
    }
});

export default router