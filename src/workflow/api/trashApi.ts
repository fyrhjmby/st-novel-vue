import type { DeletedItem } from '@/workflow/types';
import { DeletedItemTypeEnum } from '@/workflow/types';

const mockDeletedItems: DeletedItem[] = [
    {
        id: 'del-01',
        name: '旧的市场分析报告流程',
        type: DeletedItemTypeEnum.Workflow,
        deletedDate: '2024-05-18 14:30',
        daysLeft: 27,
    },
    {
        id: 'del-02',
        name: '每日灵感推送（已停用）',
        type: DeletedItemTypeEnum.Schedule,
        deletedDate: '2024-05-20 09:00',
        daysLeft: 29,
    },
    {
        id: 'del-03',
        name: '测试变量',
        type: DeletedItemTypeEnum.Variable,
        deletedDate: '2024-05-21 11:15',
        daysLeft: 30,
    }
];

export const trashApi = {
    fetchDeletedItems: (): Promise<DeletedItem[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(mockDeletedItems);
            }, 400); // Simulate network delay
        });
    },
};