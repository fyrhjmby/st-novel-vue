
/**
 * AI 任务状态
 * - pending: 等待执行
 * - processing: 正在执行
 * - completed: 已完成，等待应用
 * - completed_with_conflict: 已完成，但源文档已被修改，等待用户处理
 * - applied: 已应用
 * - failed: 执行失败
 */
export type AITaskStatus = 'pending' | 'processing' | 'completed' | 'completed_with_conflict' | 'applied' | 'failed';

/**
 * AI 任务类型 (用户界面显示名称)
 */
export type AITaskType = '润色' | '续写' | '分析' | '剧情生成' | '创作';

/**
 * AI 提供商（模型）配置
 */
export interface AIProviderConfig {
    id: string;
    name: string;
    model: string;
    temperature: number;
    maxTokens: number;
    description: string;
}

/**
 * AI 任务对象
 */
export interface AITask {
    id: string;
    title: string;
    type: AITaskType;
    sourceItemId: string;
    targetItemId: string;
    sourceItemTitle: string;
    sourceItemContent: string;
    sourceItemVersion: number; // 新增：源文档版本快照（使用Date.now()时间戳）
    status: AITaskStatus;
    generatedContent: string;
    finalPrompt?: string;
    error?: string;
    createdAt: Date;
    applyAt?: number; // 新增：用于延迟应用的时间戳
    aiConfig: AIProviderConfig;
}

/**
 * AI 任务执行前的预览数据结构
 */
export interface AITaskPreview {
    type: AITaskType;
    targetItemId: string; // 此处targetItemId即为sourceItemId
    title: string;
}