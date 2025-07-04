export type AITaskStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'applied';

export interface AITask {
    id: string;
    title: string;
    type: '润色' | '续写' | '分析';
    targetItemId: string;
    status: AITaskStatus;
    originalContent: string;
    generatedContent: string;
    error?: string;
    createdAt: Date;
}