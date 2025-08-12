// src/api/authApi.ts
import apiClient from './client';
import type { LoginCredentials, User, RegistrationData } from '@/types/auth';

export const login = async (credentials: LoginCredentials): Promise<{ user: User, token: string }> => {
    const response = await apiClient.post('/auth/login', credentials);
    // 假设后端在登录成功后返回 { user: User, token: string }
    return response.data;
};

export const register = async (data: RegistrationData): Promise<{ user: User, token: string }> => {
    const response = await apiClient.post('/auth/register', data);
    // 假设后端在注册成功后返回 { user: User, token: string }
    return response.data;
};