import type { MonitorData } from '@/workflow/types';
import { NodeStatusEnum } from '@/workflow/types';

const mockMonitorData: MonitorData = {
    runInfo: {
        id: '#RUN-f8a1b3',
        workflowName: '社交媒体帖子生成器',
        status: '运行中',
        progress: 45,
    },
    nodes: [
        { id: 'start', top: 80, left: 80, status: NodeStatusEnum.Completed, title: '开始', iconName: 'play-circle', iconColor: 'green', details: '输入: "AI在创意写作中的应用"' },
        { id: 'llm', top: 220, left: 390, status: NodeStatusEnum.Running, title: '大语言模型', iconName: 'cpu', iconColor: 'blue', details: { label: 'Token使用', value: '342 / 850', progress: 40 } },
        { id: 'end', top: 360, left: 690, status: NodeStatusEnum.Waiting, title: '结束', iconName: 'flag', iconColor: 'red', details: '等待中' },
    ],
    performance: {
        cpu: '23%',
        memory: '156MB',
        tokens: '342 / 850',
        time: '00:03:21',
    },
    initialLogs: [
        { time: '10:30:01', type: 'success', message: '工作流启动' },
        { time: '10:30:01', type: 'success', message: '节点 [开始] 执行完毕 (0.1s)' },
        { time: '10:30:02', type: 'info', message: '节点 [大语言模型] 开始执行...' },
        { time: '10:30:03', type: 'info', message: '向 GPT-4-Turbo 发送请求' },
    ],
    outputPreview: {
        content: '🤖 AI正在创造魔法... 想象一下，当作家遇到创作瓶颈时，AI就像一位永不疲倦的灵感缪斯',
        words: 42,
        limit: 280,
        status: '生成中...'
    }
};

export const monitorApi = {
    fetchMonitorData: (): Promise<MonitorData> => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(JSON.parse(JSON.stringify(mockMonitorData)));
            }, 400);
        });
    },
};