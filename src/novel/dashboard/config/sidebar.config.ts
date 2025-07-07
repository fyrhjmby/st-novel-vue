
export interface NavItem {
    name: string;
    path: string;
    icon: string;
}

export const mainNavItems: NavItem[] = [
    {
        name: '我的小说',
        path: '/novel/dashboard',
        icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7H15M9 11H15M9 15H13"/></svg>`
    },
    {
        name: '最近编辑',
        path: '/novel/recent',
        icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6V12L16 16"/></svg>`
    },
    {
        name: '回收站',
        path: '/novel/trash',
        icon: `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 6h18M5 6V20a2 2 0 002 2h10a2 2 0 002-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>`
    },
    {
        name: '导出小说',
        path: '/novel/export',
        icon: `<svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>`
    }
];