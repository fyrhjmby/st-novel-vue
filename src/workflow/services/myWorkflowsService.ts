import { myWorkflowsApi } from '@/workflow/api/myWorkflowsApi';
import type { Workflow } from '@/workflow/types';

export const myWorkflowsService = {
    getWorkflows: async (): Promise<Workflow[]> => {
        try {
            const workflows = await myWorkflowsApi.fetchMyWorkflows();
            // 未来可在此处添加业务逻辑，例如数据转换
            return workflows;
        } catch (error) {
            console.error('Failed to get workflows:', error);
            return [];
        }
    }
};