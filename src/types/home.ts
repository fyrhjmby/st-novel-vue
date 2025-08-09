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