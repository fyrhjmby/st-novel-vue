import type { Stat, QuickStartAction, RecentProject } from '@/home/types';

const statsData: Stat[] = [
    { label: '作品总数', value: '24', trend: '+12%', trendClass: 'text-[#10B981] bg-green-50', icon: `<svg class="w-5 h-5 text-[#4B5563]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7H15M9 11H15M9 15H13"/></svg>` },
    { label: '总字数', value: '128.5k', trend: '+8%', trendClass: 'text-[#10B981] bg-green-50', icon: `<svg class="w-5 h-5 text-[#4B5563]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 20L12 10"/><path d="M18 20L18 4"/><path d="M6 20L6 16"/></svg>` },
    { label: 'AI 使用次数', value: '856', trend: '进行中', trendClass: 'text-[#3B82F6] bg-blue-50', icon: `<svg class="w-5 h-5 text-[#4B5563]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6V12L16 16"/></svg>` },
    { label: '获得赞赏', value: '342', trend: '+24', trendClass: 'text-[#10B981] bg-green-50', icon: `<svg class="w-5 h-5 text-[#4B5563]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.84 4.61C20.3 4.07 19.5 3.87 18.75 4.12L5.23 8.62C4.34 8.91 3.75 9.76 3.75 10.72C3.75 11.68 4.34 12.53 5.23 12.82L10.5 14.53L12.21 19.8C12.5 20.69 13.35 21.28 14.31 21.28C15.27 21.28 16.12 20.69 16.41 19.8L20.91 6.28C21.16 5.53 20.96 4.73 20.42 4.19L20.84 4.61Z"/></svg>` },
];

const quickStartActionsData: QuickStartAction[] = [
    { title: '创建新作品', description: '开始全新的创作之旅', icon: `<svg class="text-white" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5V19M5 12H19"/></svg>`, iconBgClass: 'bg-[#4B5563]' },
    { title: 'AI 助手', description: '智能创作伴侣', icon: `<svg class="text-[#4B5563]" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/></svg>`, iconBgClass: 'bg-[#F3F4F6]' },
    { title: '导入文档', description: '继续未完成的创作', icon: `<svg class="text-[#4B5563]" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24"><path d="M7 18C4.5 18 3 16.5 3 14C3 11.5 5 10 7 10C7.3 10 7.5 10 7.8 10.1C8.5 7.2 11 5 14 5C17.3 5 20 7.7 20 11C20 11.3 20 11.7 19.9 12C21.1 12.5 22 13.6 22 15C22 16.9 20.4 18.5 18.5 18.5"/><path d="M12 13V21M15 16L12 13L9 16"/></svg>`, iconBgClass: 'bg-[#F3F4F6]' }
];

const recentProjectsData: RecentProject[] = [
    { title: '星际漫游者', details: '科幻冒险 · 24章 · 2小时前', status: '编辑中', bgClass: 'bg-gradient-to-br from-indigo-100 to-purple-100' },
    { title: '月光下的约定', details: '现代言情 · 18章 · 昨天', status: '暂停', bgClass: 'bg-gradient-to-br from-pink-100 to-rose-100' }
];

export const fetchMockDashboardData = async () => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200));
    return Promise.resolve({
        stats: statsData,
        quickStartActions: quickStartActionsData,
        recentProjects: recentProjectsData,
    });
};