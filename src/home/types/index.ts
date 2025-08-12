// src/home/types/index.ts
// 定义 Home 模块（工作台仪表盘）相关的数据类型

export interface Stat {
    label: string;
    value: string;
    trend: string;
    trendClass: string;
    icon: string;
}

export interface QuickStartAction {
    title: string;
    description: string;
    icon: string;
    iconBgClass: string;
}

export interface RecentProject {
    title: string;
    details: string;
    status: '编辑中' | '暂停';
    bgClass: string;
}