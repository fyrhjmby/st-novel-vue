export interface UsageStat {
    label: string;
    value: string;
    trend: string;
}

export interface ApiLog {
    id: number;
    timestamp: string;
    endpoint: string;
    model: string;
    tokens: string;
    status: '成功' | '失败';
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