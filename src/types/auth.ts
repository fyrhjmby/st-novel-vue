/**
 * 用户登录凭证
 */
export interface LoginCredentials {
    email: string;
    password: string;
}

/**
 * 全局统一的用户信息结构
 */
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    plan: '免费版' | '专业版';
    phone?: string;
    region?: string;
    timezone?: string;
    bio?: string;
}

/**
 * 用户注册时所需的数据
 */
export interface RegistrationData extends LoginCredentials {
    firstName: string;
    lastName: string;
    termsAccepted: boolean;
}