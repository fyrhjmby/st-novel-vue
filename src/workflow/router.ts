
import type { RouteRecordRaw } from 'vue-router';
import WorkflowLayout from '@/workflow/layouts/WorkflowLayout.vue';

export const workflowRoutes: Array<RouteRecordRaw> = [
    {
        path: '/workflow',
        component: WorkflowLayout,
        redirect: '/workflow/dashboard',
        children: [
            // === 工作流管理 ===
            {
                path: 'dashboard',
                name: 'WorkflowDashboard',
                component: () => import('@/workflow/views/Dashboard.vue'),
                meta: { title: '工作流仪表盘' },
            },
            {
                path: 'my-flows',
                name: 'MyWorkflows',
                // 从占位符更新为实际组件
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

            // === 配置 ===
            {
                path: 'connectors',
                name: 'WorkflowConnectors',
                // 从占位符更新为实际组件
                component: () => import('@/workflow/views/Connectors.vue'),
                meta: { title: '连接器' },
            },
            {
                path: 'variables',
                name: 'WorkflowVariables',
                // 从占位符更新为实际组件
                component: () => import('@/workflow/views/Variables.vue'),
                meta: { title: '变量库' },
            },
            {
                path: 'schedules',
                name: 'WorkflowSchedules',
                // 从占位符更新为实际组件
                component: () => import('@/workflow/views/Schedules.vue'),
                meta: { title: '调度任务' },
            },
            {
                path: 'trash',
                name: 'WorkflowTrash',
                // 从占位符更新为实际组件
                component: () => import('@/workflow/views/Trash.vue'),
                meta: { title: '回收站' },
            },

            // === 动态/功能性页面 ===
            {
                path: 'editor/:id',
                name: 'WorkflowEditor',
                component: () => import('@/workflow/views/Editor.vue'),
                meta: { title: '可视化工作流编辑器' },
                props: true,
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
        ],
    },
];