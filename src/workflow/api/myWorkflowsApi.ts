import type { Workflow } from '@/workflow/types';
import { WorkflowStatusEnum } from '@/workflow/types';

const mockWorkflows: Workflow[] = [
    {
        id: 'wf-001',
        title: '社交媒体帖子生成器',
        description: '自动从核心主题生成适用于多平台的帖子内容。',
        tags: ['内容生成', '社交媒体', 'GPT-4'],
        status: WorkflowStatusEnum.Published,
        updated: '2天前'
    },
    {
        id: 'wf-002',
        title: '公司周报摘要',
        description: '上传多个文档，自动提取关键信息生成周报摘要。',
        tags: ['文档处理', '信息提取', 'RAG'],
        status: WorkflowStatusEnum.Draft,
        updated: '5小时前'
    },
    {
        id: 'wf-003',
        title: '市场情绪分析流程',
        description: '监控指定关键词的社媒情绪，并每日发送报告。',
        tags: ['数据分析', '监控', '自动化'],
        status: WorkflowStatusEnum.Published,
        updated: '1周前'
    },
    {
        id: 'wf-004',
        title: '新客户欢迎邮件',
        description: '当有新用户注册时，自动触发个性化欢迎邮件。',
        tags: ['营销', '自动化', 'Email'],
        status: WorkflowStatusEnum.Archived,
        updated: '1个月前'
    },
];

export const myWorkflowsApi = {
    fetchMyWorkflows: (): Promise<Workflow[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(JSON.parse(JSON.stringify(mockWorkflows)));
            }, 500);
        });
    }
};