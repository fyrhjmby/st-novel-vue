import type { DashboardData } from '@/workflow/types';
import { TrendDirectionEnum } from '@/workflow/types';

export const dashboardApi = {
    fetchDashboardData: (): Promise<DashboardData> => {
        const data: DashboardData = {
            stats: [
                {
                    label: '工作流总数',
                    value: '12',
                    trend: { direction: TrendDirectionEnum.Up, value: '+8%' },
                    iconName: 'flow-arrows',
                    iconColor: 'blue',
                },
                {
                    label: '执行次数 (24h)',
                    value: '156',
                    isRealtime: true,
                    iconName: 'clock',
                    iconColor: 'green',
                    details: {
                        label1: '当前运行',
                        value1: 3,
                        label2: '队列中',
                        value2: 7
                    }
                },
                {
                    label: '平均成功率',
                    value: '98.5%',
                    trend: null,
                    iconName: 'chart-bar',
                    iconColor: 'indigo',
                    progress: 98.5
                },
                {
                    label: '平均执行时间',
                    value: '~12.3s',
                    trend: { direction: TrendDirectionEnum.Down, value: '-15%' },
                    iconName: 'zap',
                    iconColor: 'rose',
                    details: {
                        label1: '最快',
                        value1: '3.2s',
                        label2: '最慢',
                        value2: '45.6s'
                    }
                },
            ],
            quickStartActions: [
                { title: '创建新工作流', description: '从一个空白画布开始构建你的自动化流程。', path: '/workflow/editor/new', iconName: 'plus', iconColor: 'blue'},
                { title: '从模板创建', description: '从市场中选择一个预构建的模板快速启动。', path: '/workflow/market', iconName: 'copy', iconColor: 'indigo'},
                { title: '查看运行历史', description: '跟踪和调试过去所有工作流的执行情况。', path: '/workflow/history', iconName: 'history', iconColor: 'green'},
                { title: '管理全局变量', description: '集中管理和配置您工作流中使用的变量。', path: '/workflow/variables', iconName: 'sliders', iconColor: 'amber'}
            ],
            recentProjects: [
                { title: '社交媒体帖子', details: '执行 23 次', time: '5分钟前', iconName: 'message-circle', iconColor: 'blue' },
                { title: '公司周报摘要', details: '执行 5 次', time: '2小时前', iconName: 'file-text', iconColor: 'green' },
                { title: '市场情绪分析', details: '执行 102 次', time: '8小时前', iconName: 'trending-up', iconColor: 'indigo' },
                { title: '新客户欢迎邮件', details: '执行 18 次', time: '1天前', iconName: 'mail', iconColor: 'amber' }
            ],
        };
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(data);
            }, 300);
        });
    }
};