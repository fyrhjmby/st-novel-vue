import { useRouter } from 'vue-router';
import * as api from '@/auth/api';
import { useAuthStore } from '@/auth/store/auth.store';
import type { LoginCredentials, RegistrationData } from '@/types/auth';

export function useAuthService() {
    const store = useAuthStore();
    const router = useRouter();

    const handleLogin = async (credentials: LoginCredentials) => {
        store.setLoading(true);
        store.setError(null);
        try {
            const { user, token } = await api.login(credentials);
            store.setAuth(user, token);
            await router.push(router.currentRoute.value.query.redirect as string || '/home');
        } catch (error: any) {
            store.setError(error.message || '登录失败，请稍后重试');
            throw error;
        } finally {
            store.setLoading(false);
        }
    };

    const handleRegister = async (data: RegistrationData) => {
        store.setLoading(true);
        store.setError(null);
        try {
            const { user, token } = await api.register(data);
            store.setAuth(user, token);
            await router.push('/home');
        } catch (error: any) {
            store.setError(error.message || '注册失败，请稍后重试');
            throw error;
        } finally {
            store.setLoading(false);
        }
    };

    const handleLogout = () => {
        store.clearAuth();
        router.push('/auth/login');
    };

    const initializeAuth = async () => {
        if (store.token && !store.user) {
            try {
                const user = await api.fetchCurrentUser();
                store.setUser(user);
            } catch (e) {
                // Token 无效或已过期，清理状态并强制登出
                store.clearAuth();
                console.error('Authentication initialization failed, clearing token.');
            }
        }
    };

    return {
        handleLogin,
        handleRegister,
        handleLogout,
        initializeAuth,
    };
}