import type { RouteRecordRaw } from 'vue-router';

export const authRoutes: Array<RouteRecordRaw> = [
    {
        path: '/auth',
        component: () => import('@/auth/layouts/AuthLayout.vue'),
        redirect: '/auth/login',
        children: [
            {
                path: 'welcome',
                name: 'Welcome',
                component: () => import('@/auth/views/Welcome.vue'),
                meta: { title: '欢迎' },
            },
            {
                path: 'login',
                name: 'Login',
                component: () => import('@/auth/views/Login.vue'),
                meta: { title: '登录' },
            },
            {
                path: 'register',
                name: 'Register',
                component: () => import('@/auth/views/Register.vue'),
                meta: { title: '注册' },
            },
            {
                path: 'forgot-password',
                name: 'ForgotPassword',
                component: () => import('@/auth/views/ForgotPassword.vue'),
                meta: { title: '忘记密码' },
            },
        ],
    },
];