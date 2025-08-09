// src/settings/api/usageLogsApi.ts

export interface UsageStat {
    label: string;
    value: string;
    icon: string;
    progressColor: string;
    progressWidth: string;
    trend: string;
    trendColor: string;
}

export interface ApiLog {
    id: number;
    timestamp: string;
    endpoint: string;
    model: string;
    tokens: string;
    status: string;
    statusClass: string;
    duration: string;
}

export interface ChartDataPoint {
    label: string;
    requests: number;
    tokens: number;
}

export interface FetchParams {
    period: '日' | '周' | '月';
    model: string;
    status: string;
    page: number;
    limit: number;
}

const mockStats: Record<'日'|'周'|'月', UsageStat[]> = {
    '月': [
        { label: '总请求数', value: '12,564', icon: `<svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>`, progressColor: 'bg-blue-500', progressWidth: '75%', trend: '+8.2%', trendColor: 'text-green-600' },
        { label: 'Token 消耗', value: '856K', icon: `<svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>`, progressColor: 'bg-purple-500', progressWidth: '85.6%', trend: '85.6%', trendColor: 'text-[#6B7280]' },
        { label: '平均响应时间', value: '1.2s', icon: `<svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`, progressColor: 'bg-green-500', progressWidth: '25%', trend: '优秀', trendColor: 'text-green-600' },
        { label: '错误率', value: '0.8%', icon: `<svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`, progressColor: 'bg-red-500', progressWidth: '8%', trend: '-0.2%', trendColor: 'text-red-600' },
    ],
    '周': [
        { label: '总请求数', value: '3,102', icon: `<svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>`, progressColor: 'bg-blue-500', progressWidth: '80%', trend: '+5.1%', trendColor: 'text-green-600' },
        { label: 'Token 消耗', value: '210K', icon: `<svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>`, progressColor: 'bg-purple-500', progressWidth: '90%', trend: '21.0%', trendColor: 'text-[#6B7280]' },
        { label: '平均响应时间', value: '1.1s', icon: `<svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`, progressColor: 'bg-green-500', progressWidth: '20%', trend: '优秀', trendColor: 'text-green-600' },
        { label: '错误率', value: '0.5%', icon: `<svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`, progressColor: 'bg-red-500', progressWidth: '5%', trend: '+0.1%', trendColor: 'text-red-600' },
    ],
    '日': [
        { label: '总请求数', value: '450', icon: `<svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>`, progressColor: 'bg-blue-500', progressWidth: '60%', trend: '-2.0%', trendColor: 'text-red-600' },
        { label: 'Token 消耗', value: '35K', icon: `<svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>`, progressColor: 'bg-purple-500', progressWidth: '70%', trend: '3.5%', trendColor: 'text-[#6B7280]' },
        { label: '平均响应时间', value: '1.3s', icon: `<svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`, progressColor: 'bg-green-500', progressWidth: '30%', trend: '良好', trendColor: 'text-yellow-600' },
        { label: '错误率', value: '1.2%', icon: `<svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`, progressColor: 'bg-red-500', progressWidth: '12%', trend: '+0.4%', trendColor: 'text-red-600' },
    ]
};

const mockChartData: Record<'日'|'周'|'月', ChartDataPoint[]> = {
    '月': [
        { label: '第1周', requests: 2800, tokens: 200 },
        { label: '第2周', requests: 3102, tokens: 210 },
        { label: '第3周', requests: 3500, tokens: 230 },
        { label: '第4周', requests: 3162, tokens: 216 },
    ],
    '周': [
        { label: '周一', requests: 420, tokens: 28 },
        { label: '周二', requests: 480, tokens: 32 },
        { label: '周三', requests: 510, tokens: 35 },
        { label: '周四', requests: 450, tokens: 30 },
        { label: '周五', requests: 610, tokens: 42 },
        { label: '周六', requests: 330, tokens: 22 },
        { label: '周日', requests: 302, tokens: 21 },
    ],
    '日': [
        { label: '0-4h', requests: 50, tokens: 4 },
        { label: '4-8h', requests: 30, tokens: 2 },
        { label: '8-12h', requests: 150, tokens: 12 },
        { label: '12-16h', requests: 120, tokens: 10 },
        { label: '16-20h', requests: 80, tokens: 6 },
        { label: '20-24h', requests: 20, tokens: 1 },
    ]
};

const mockLogs: ApiLog[] = [
    { id: 1, timestamp: '2024-06-18 10:32:05', endpoint: '/v1/chat/completions', model: 'gpt-4-turbo', tokens: '1,245', status: '成功', statusClass: 'bg-green-100 text-green-700', duration: '1.25s' },
    { id: 2, timestamp: '2024-06-18 10:31:50', endpoint: '/v1/chat/completions', model: 'claude-3-opus', tokens: '2,105', status: '成功', statusClass: 'bg-green-100 text-green-700', duration: '2.01s' },
    { id: 3, timestamp: '2024-06-18 10:30:12', endpoint: '/v1/chat/completions', model: 'gpt-4-turbo', tokens: '0', status: '失败', statusClass: 'bg-red-100 text-red-700', duration: '0.05s' },
    { id: 4, timestamp: '2024-06-18 09:55:41', endpoint: '/v1/chat/completions', model: 'gpt-4-turbo', tokens: '3,012', status: '成功', statusClass: 'bg-green-100 text-green-700', duration: '1.88s' },
    { id: 5, timestamp: '2024-06-18 09:40:22', endpoint: '/v1/chat/completions', model: 'claude-3-opus', tokens: '550', status: '成功', statusClass: 'bg-green-100 text-green-700', duration: '1.50s' },
    { id: 6, timestamp: '2024-06-18 09:30:00', endpoint: '/v1/chat/completions', model: 'gemini-pro', tokens: '1,800', status: '成功', statusClass: 'bg-green-100 text-green-700', duration: '1.32s' },
];


export const fetchUsageData = (params: FetchParams): Promise<{
    stats: UsageStat[],
    logs: ApiLog[],
    chartData: ChartDataPoint[],
    totalLogs: number,
    totalPages: number
}> => {
    return new Promise(resolve => {
        setTimeout(() => {
            let filteredLogs = [...mockLogs];

            if (params.model !== '所有模型') {
                const modelKey = params.model.toLowerCase();
                filteredLogs = filteredLogs.filter(log => log.model.toLowerCase().includes(modelKey));
            }

            if (params.status !== '所有状态') {
                filteredLogs = filteredLogs.filter(log => log.status === params.status);
            }

            const totalLogs = filteredLogs.length;
            const totalPages = Math.ceil(totalLogs / params.limit);

            const paginatedLogs = filteredLogs.slice(
                (params.page - 1) * params.limit,
                params.page * params.limit
            );

            resolve({
                stats: JSON.parse(JSON.stringify(mockStats[params.period])),
                logs: JSON.parse(JSON.stringify(paginatedLogs)),
                chartData: JSON.parse(JSON.stringify(mockChartData[params.period])),
                totalLogs,
                totalPages
            });
        }, 400);
    });
};