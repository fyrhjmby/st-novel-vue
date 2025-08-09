// src/auth/types/index.ts
// 定义认证模块共享的数据类型

export interface UserCredentials {
    email: string;
    password: string;
}

export interface UserInfo {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    plan: '免费版' | '专业版';
}

export interface RegistrationData extends UserCredentials {
    firstName: string;
    lastName: string;
    termsAccepted: boolean;
}