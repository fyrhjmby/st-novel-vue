// src/auth/api/index.ts
// 模拟与后端 API 的交互，使用集中的 apiClient

import apiClient from '@/api/client';
import type { UserCredentials, UserInfo, RegistrationData } from '@/auth/types';

// 模拟用户数据库
const mockUser: UserInfo = {
    id: '1',
    name: 'Administrator',
    email: 'admin@example.com',
    avatar: '/path/to/avatar.png',
    plan: '专业版',
};

// 模拟登录请求
export const login = (credentials: UserCredentials): Promise<{ user: UserInfo, token: string }> => {
    console.log('API: Attempting login with', credentials);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (credentials.email === 'admin@example.com' && credentials.password === '123456') {
                resolve({
                    user: mockUser,
                    token: 'mock-jwt-token-for-admin-123456',
                });
            } else {
                reject(new Error('邮箱或密码错误'));
            }
        }, 1000);
    });
};

// 模拟注册请求
export const register = (data: RegistrationData): Promise<{ user: UserInfo, token: string }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newUser: UserInfo = {
                id: '2',
                email: data.email,
                name: `${data.firstName} ${data.lastName}`,
                plan: '免费版',
            };
            resolve({
                user: newUser,
                token: `mock-jwt-token-for-${data.email}`,
            });
        }, 1000);
    });
};

// 模拟获取当前用户信息 (受保护的端点)
export const fetchCurrentUser = (): Promise<UserInfo> => {
    return new Promise((resolve, reject) => {
        // apiClient 自动添加了请求头，我们在这里模拟后端验证
        const token = apiClient.defaults.headers.common['Authorization'] || apiClient.defaults.headers['Authorization'];

        setTimeout(() => {
            if (token && typeof token === 'string' && token.includes('mock-jwt-token')) {
                resolve(mockUser);
            } else {
                reject(new Error('无效或过期的 Token'));
            }
        }, 500);
    });
}