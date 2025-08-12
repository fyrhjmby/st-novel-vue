import { defineStore } from 'pinia';
import type { User } from '@/types/auth';
interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        token: localStorage.getItem('authToken') || null,
        isAuthenticated: !!localStorage.getItem('authToken'),
        isLoading: false,
        error: null,
    }),

    getters: {
        isLoggedIn: (state): boolean => state.isAuthenticated,
    },

    actions: {
        setAuth(user: User, token: string) {
            this.user = user;
            this.token = token;
            this.isAuthenticated = true;
            this.error = null;
            localStorage.setItem('authToken', token);
            // 将 token 设置到 apiClient 的默认头部，以便后续请求使用
            // 注意：拦截器已经处理了此逻辑，这里是双重保障或用于非拦截器场景
        },

        setUser(user: User) {
            this.user = user;
        },

        clearAuth() {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
            this.error = null;
            localStorage.removeItem('authToken');
        },

        setLoading(loading: boolean) {
            this.isLoading = loading;
        },

        setError(error: string | null) {
            this.error = error;
        },
    },
});