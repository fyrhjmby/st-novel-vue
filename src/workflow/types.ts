// Enums for semantic states, types, and directions
export enum WorkflowStatusEnum {
    Published = 'published',
    Draft = 'draft',
    Archived = 'archived',
}

export enum RunStatusEnum {
    Success = 'success',
    Failure = 'failure',
    Running = 'running',
    Cancelled = 'cancelled',
}

export enum TriggerTypeEnum {
    Manual = 'manual',
    Scheduled = 'scheduled',
    API = 'api',
    Webhook = 'webhook',
}

export enum TrendDirectionEnum {
    Up = 'up',
    Down = 'down',
    None = 'none',
}

export enum NodeStatusEnum {
    Completed = 'completed',
    Running = 'running',
    Waiting = 'waiting',
}

export enum DeletedItemTypeEnum {
    Workflow = 'workflow',
    Schedule = 'schedule',
    Variable = 'variable',
}

// --- MyWorkflows ---
export interface Workflow {
    id: string;
    title: string;
    description: string;
    tags: string[];
    status: WorkflowStatusEnum;
    updated: string;
    usage?: string;
    successRate?: string;
}

// --- Dashboard ---
export interface DashboardStat {
    label: string;
    value: string;
    valueSubtext?: string;
    trend?: {
        direction: TrendDirectionEnum;
        value: string;
    } | null;
    isRealtime?: boolean;
    iconName: string;
    iconColor: string; // e.g., 'blue', 'green'
    chart?: string[]; // Represents percentage heights '40%'
    progress?: number;
    details?: {
        label1: string;
        value1: string | number;
        label2: string;
        value2: string | number;
    };
}

export interface QuickStartAction {
    title: string;
    description: string;
    path: string;
    iconName: string;
    iconColor: string;
}

export interface RecentProject {
    title: string;
    details: string;
    time: string;
    iconName: string;
    iconColor: string;
}

export interface DashboardData {
    stats: DashboardStat[];
    quickStartActions: QuickStartAction[];
    recentProjects: RecentProject[];
    allWorkflows?: Workflow[];
}

// --- History ---
export interface RunHistoryItem {
    id: string;
    workflowName: string;
    trigger: {
        type: TriggerTypeEnum;
    };
    startTime: string;
    duration: string;
    status: RunStatusEnum;
    primaryAction: string;
    secondaryAction?: string;
}

// --- Marketplace ---
export interface MarketplaceTag {
    name: string;
    color: string; // 'blue', 'green', etc.
}

export interface WorkflowTemplate {
    title: string;
    author: string;
    rating: string;
    reviews: string;
    description: string;
    usage: string;
    iconName: string;
    iconColor: string;
}

export interface MarketplaceData {
    popularTags: MarketplaceTag[];
    workflowTemplates: WorkflowTemplate[];
}

// --- Monitor ---
export interface MonitorNode {
    id: string;
    top: number;
    left: number;
    status: NodeStatusEnum;
    title: string;
    iconName: string;
    iconColor: string;
    details: string | {
        label: string;
        value: string;
        progress: number;
    };
}

export interface MonitorPerformance {
    cpu: string;
    memory: string;
    tokens: string;
    time: string;
}

export interface MonitorLog {
    time: string;
    type: 'success' | 'info' | 'error' | 'debug';
    message: string;
    isBlock?: boolean;
    blockContent?: string;
}

export interface MonitorOutputPreview {
    content: string;
    words: number;
    limit: number;
    status: string;
}

export interface MonitorData {
    runInfo: {
        id: string;
        workflowName: string;
        status: string;
        progress: number;
    };
    nodes: MonitorNode[];
    performance: MonitorPerformance;
    initialLogs: MonitorLog[];
    outputPreview: MonitorOutputPreview;
}


// --- Run ---
export interface RunPreset {
    id: string;
    name: string;
    description: string;
    active: boolean;
}

export interface RunRecentParam {
    id: string;
    title: string;
    details: string;
}

export interface RunFormData {
    topic: string;
    platform: string;
    tone: string;
    includeHashtags: boolean;
    includeEmojis: boolean;
    includeCTA: boolean;
}

interface RunPageDataBase {
    presets: RunPreset[];
    recentParams: RunRecentParam[];
    initialFormData: RunFormData;
}

export interface RunPageData extends RunPageDataBase {
    workflowId: string;
    workflowName: string;
}


// --- Schedules ---
export interface Schedule {
    id: string;
    status: 'enabled' | 'disabled';
    workflowName: string;
    workflowId: string;
    schedule: {
        cron: string;
        description: string;
    };
    nextRun: string;
}

// --- Trash ---
export interface DeletedItem {
    id: string;
    name: string;
    type: DeletedItemTypeEnum;
    deletedDate: string;
    daysLeft: number;
}