import type { RunHistoryItem } from '@/workflow/types';
import { RunStatusEnum, TriggerTypeEnum } from '@/workflow/types';

const mockRunHistory: RunHistoryItem[] = [
    {
        id: '#f8a1b3',
        workflowName: '社交媒体帖子生成器',
        trigger: { type: TriggerTypeEnum.Manual },
        startTime: '2024-05-20 10:30',
        duration: '12.5s',
        status: RunStatusEnum.Success,
        primaryAction: '查看详情',
    },
    {
        id: '#e7b2c4',
        workflowName: '公司周报摘要',
        trigger: { type: TriggerTypeEnum.Scheduled },
        startTime: '2024-05-20 09:15',
        duration: '45.2s',
        status: RunStatusEnum.Failure,
        primaryAction: '查看日志',
        secondaryAction: '重试'
    },
    {
        id: '#d6c3d5',
        workflowName: '小说角色生成器',
        trigger: { type: TriggerTypeEnum.API },
        startTime: '2024-05-19 18:45',
        duration: '8.1s',
        status: RunStatusEnum.Success,
        primaryAction: '查看详情',
    },
    {
        id: '#c5d4e6',
        workflowName: '社交媒体帖子生成器',
        trigger: { type: TriggerTypeEnum.Manual },
        startTime: '2024-05-19 14:20',
        duration: '1.2s',
        status: RunStatusEnum.Cancelled,
        primaryAction: '查看详情',
    },
    {
        id: '#b4d5f7',
        workflowName: '数据分析报告',
        trigger: { type: TriggerTypeEnum.Webhook },
        startTime: '2024-05-19 11:30',
        duration: '23.7s',
        status: RunStatusEnum.Running,
        primaryAction: '实时监控',
        secondaryAction: '停止'
    },
];

export const historyApi = {
    fetchRunHistory: (): Promise<RunHistoryItem[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(mockRunHistory);
            }, 400); // Simulate network delay
        });
    },
};