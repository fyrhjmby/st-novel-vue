import axios from 'axios';
import { useAuthStore } from '@/auth/store/auth.store';

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
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

// 响应拦截器
apiClient.interceptors.response.use(
    (response) => {
        // 如果后端返回的 code 不为 0，则视为错误
        if (response.data.code !== 0) {
            return Promise.reject(new Error(response.data.msg || 'Error'));
        }
        // 直接返回 data 字段，简化上层调用
        response.data = response.data.data;
        return response;
    },
    (error) => {
        // 处理网络错误等
        return Promise.reject(error);
    }
);


export default apiClient;