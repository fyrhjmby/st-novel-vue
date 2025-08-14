import type { DashboardData } from '@/workflow/types';
import { TrendDirectionEnum, WorkflowStatusEnum } from '@/workflow/types';

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
                    chart: ['40%', '60%', '45%', '80%', '70%', '100%']
                },
                {
                    label: '执行次数',
                    value: '156',
                    valueSubtext: '/ 24h',
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
                { title: '创建工作流', iconName: 'plus', iconColor: 'blue'},
                { title: '导入工作流', iconName: 'upload-cloud', iconColor: 'green'},
                { title: '复制模板', iconName: 'copy', iconColor: 'indigo'},
                { title: '管理变量', iconName: 'sliders', iconColor: 'amber'}
            ],
            recentProjects: [
                { title: '社交媒体帖子', details: '执行 23 次', time: '5分钟前', iconName: 'message-circle', iconColor: 'blue' },
                { title: '公司周报摘要', details: '执行 5 次', time: '2小时前', iconName: 'file-text', iconColor: 'green' },
                { title: '市场情绪分析', details: '执行 102 次', time: '8小时前', iconName: 'trending-up', iconColor: 'indigo' },
                { title: '新客户欢迎邮件', details: '执行 18 次', time: '1天前', iconName: 'mail', iconColor: 'amber' }
            ],
            allWorkflows: [
                {
                    id: 'wf-001',
                    title: '社交媒体帖子生成器',
                    description: '从核心主题生成多平台帖子内容。',
                    tags: ['内容生成', '社交媒体'],
                    status: WorkflowStatusEnum.Published,
                    updated: '2天前',
                    usage: '2.1k 次',
                    successRate: '99%'
                },
                {
                    id: 'wf-003',
                    title: '市场情绪分析流程',
                    description: '监控关键词的社媒情绪并发送报告。',
                    tags: ['数据分析', '自动化'],
                    status: WorkflowStatusEnum.Published,
                    updated: '1周前',
                    usage: '5.8k 次',
                    successRate: '97%'
                },
                {
                    id: 'wf-002',
                    title: '公司周报摘要',
                    description: '上传文档，自动提取关键信息。',
                    tags: ['文档处理', 'RAG'],
                    status: WorkflowStatusEnum.Draft,
                    updated: '5小时前',
                    usage: '5 次',
                    successRate: '100%'
                }
            ]
        };
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(data);
            }, 300);
        });
    }
};