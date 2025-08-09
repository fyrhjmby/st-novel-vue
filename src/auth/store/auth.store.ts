// src/auth/store/auth.store.ts
// 使用 Pinia 管理认证状态

import { defineStore } from 'pinia';
import type { UserInfo } from '@/auth/types';

interface AuthState {
    user: UserInfo | null;
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
        setAuth(user: UserInfo, token: string) {
            this.user = user;
            this.token = token;
            this.isAuthenticated = true;
            this.error = null;
            localStorage.setItem('authToken', token);
        },

        setUser(user: UserInfo) {
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