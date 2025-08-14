import type { Schedule } from '@/workflow/types';

const mockSchedules: Schedule[] = [
    {
        id: 'sched-01',
        status: 'enabled',
        workflowName: '公司周报摘要',
        workflowId: 'wf-002',
        schedule: {
            cron: '0 9 * * 1',
            description: '每周一上午9点',
        },
        nextRun: '2024-05-27 09:00:00',
    },
    {
        id: 'sched-02',
        status: 'enabled',
        workflowName: '市场情绪分析流程',
        workflowId: 'wf-003',
        schedule: {
            cron: '0 */4 * * *',
            description: '每4小时一次',
        },
        nextRun: '2024-05-21 16:00:00',
    },
    {
        id: 'sched-03',
        status: 'disabled',
        workflowName: '社交媒体帖子生成器',
        workflowId: 'wf-001',
        schedule: {
            cron: '0 18 * * *',
            description: '每天下午6点',
        },
        nextRun: 'N/A',
    },
    {
        id: 'sched-04',
        status: 'enabled',
        workflowName: '数据备份',
        workflowId: 'wf-005',
        schedule: {
            cron: '0 2 1 * *',
            description: '每月1号凌晨2点',
        },
        nextRun: '2024-06-01 02:00:00',
    },
];

export const schedulesApi = {
    fetchSchedules: (): Promise<Schedule[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(mockSchedules);
            }, 400); // Simulate network delay
        });
    },
};