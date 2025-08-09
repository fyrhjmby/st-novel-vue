// src/api/client.ts
// 创建一个集中的、带认证拦截器的 API 客户端

import axios from 'axios';
import { useAuthStore } from '@/auth/store/auth.store';

const apiClient = axios.create({
    // 如果你的 API 有一个基础 URL，可以在这里配置
    // baseURL: 'https://api.yourapp.com/v1',
});

// 请求拦截器
apiClient.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (token) {
            // 在每个需要认证的请求头中添加 Bearer Token
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;