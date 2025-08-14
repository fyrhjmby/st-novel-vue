import { defineStore } from 'pinia';
import { ref } from 'vue';
import { monitorService } from '@/workflow/services/monitorService';
import type { MonitorData, MonitorLog, MonitorNode, MonitorOutputPreview, MonitorPerformance } from '@/workflow/types';

let logInterval: number | undefined;

const sampleLogs: Omit<MonitorLog, 'time'>[] = [
    { type: 'debug', message: 'API请求详情: {"model": "gpt-4-turbo", "temperature": 0.7}', isBlock: true, blockContent: '{\n"model": "gpt-4-turbo",\n"temperature": 0.7,\n"max_tokens": 1000\n}'},
    { type: 'info', message: '正在生成内容...' },
    { type: 'info', message: '接收到流式数据块 #1' },
    { type: 'info', message: '接收到流式数据块 #2' },
    { type: 'success', message: '节点 [大语言模型] 执行完毕 (3.1s)' },
    { type: 'info', message: '节点 [结束] 开始执行...' },
    { type: 'success', message: '工作流执行成功' },
];
let logCounter = 0;

export const useMonitorStore = defineStore('monitor', () => {
    const isLoading = ref(false);
    const runInfo = ref<MonitorData['runInfo']>({ id: '', workflowName: '', status: '', progress: 0 });
    const nodes = ref<MonitorNode[]>([]);
    const performance = ref<Partial<MonitorPerformance>>({});
    const logs = ref<MonitorLog[]>([]);
    const outputPreview = ref<Partial<MonitorOutputPreview>>({});

    const loadInitialData = async () => {
        isLoading.value = true;
        try {
            const data = await monitorService.getMonitorData();
            if (data) {
                runInfo.value = data.runInfo;
                nodes.value = data.nodes;
                performance.value = data.performance;
                logs.value = data.initialLogs;
                outputPreview.value = data.outputPreview;
            }
        } catch (error) {
            console.error('Error loading monitor data:', error);
        } finally {
            isLoading.value = false;
        }
    };

    const startLogUpdates = () => {
        stopLogUpdates(); // Ensure no multiple intervals running
        logInterval = window.setInterval(() => {
            if (logCounter < sampleLogs.length) {
                const now = new Date();
                const newLog: MonitorLog = {
                    ...sampleLogs[logCounter],
                    time: now.toLocaleTimeString('en-GB'),
                };
                logs.value.push(newLog);
                logCounter++;
            } else {
                stopLogUpdates();
            }
        }, 2000);
    };

    const stopLogUpdates = () => {
        if (logInterval) {
            clearInterval(logInterval);
            logInterval = undefined;
        }
    };

    const reset = () => {
        stopLogUpdates();
        logCounter = 0;
        logs.value = [];
    }

    return {
        isLoading,
        runInfo,
        nodes,
        performance,
        logs,
        outputPreview,
        loadInitialData,
        startLogUpdates,
        stopLogUpdates,
        reset,
    };
});