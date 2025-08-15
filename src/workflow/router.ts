import type { RouteRecordRaw } from 'vue-router';
import WorkflowLayout from '@/workflow/layouts/WorkflowLayout.vue';

const mainRoutes: RouteRecordRaw[] = [
    {
        path: 'dashboard',
        name: 'WorkflowDashboard',
        component: () => import('@/workflow/views/Dashboard.vue'),
        meta: { title: '工作流仪表盘' },
    },
    {
        path: 'my-flows',
        name: 'MyWorkflows',
        component: () => import('@/workflow/views/MyWorkflows.vue'),
        meta: { title: '我的工作流' },
    },
    {
        path: 'market',
        name: 'WorkflowMarketplace',
        component: () => import('@/workflow/views/Marketplace.vue'),
        meta: { title: '工作流市场' },
    },
    {
        path: 'history',
        name: 'WorkflowHistory',
        component: () => import('@/workflow/views/History.vue'),
        meta: { title: '运行历史' },
    },
    {
        path: 'schedules',
        name: 'WorkflowSchedules',
        component: () => import('@/workflow/views/Schedules.vue'),
        meta: { title: '调度任务' },
    },
    {
        path: 'trash',
        name: 'WorkflowTrash',
        component: () => import('@/workflow/views/Trash.vue'),
        meta: { title: '回收站' },
    },
    {
        path: 'run/:id',
        name: 'WorkflowRun',
        component: () => import('@/workflow/views/Run.vue'),
        meta: { title: '工作流运行配置' },
        props: true,
    },
    {
        path: 'monitor/:runId',
        name: 'WorkflowMonitor',
        component: () => import('@/workflow/views/Monitor.vue'),
        meta: { title: '工作流运行实时监控' },
        props: true,
    },
];

export const workflowRoutes: Array<RouteRecordRaw> = [
    {
        path: '/workflow',
        component: WorkflowLayout,
        redirect: '/workflow/dashboard',
        children: mainRoutes,
    },
    {
        path: '/workflow/editor/:id',
        name: 'WorkflowEditor',
        component: () => import('@/workflow/editor/EditorView.vue'),
        meta: { title: '可视化工作流编辑器' },
        props: true,
    },
];