import * as aiProviderApi from '@novel/editor/api/aiProviderApi';
import type { AIProviderConfig, AITaskType } from '@novel/editor/types';
import { streamAITask as streamAITaskFromApi } from '@novel/editor/api/aiApi';

interface StreamCallbacks {
    onChunk: (chunk: string) => void;
    onComplete: () => void;
    onError: (error: string) => void;
}

/**
 * 从系统设置中获取所有已启用的、可供编辑器使用的AI配置。
 * @returns 返回一个符合编辑器AIProviderConfig格式的数组。
 */
export async function fetchAvailableAIProviders(): Promise<AIProviderConfig[]> {
    try {
        return await aiProviderApi.fetchAIProviders();
    } catch (error) {
        console.error("Failed to fetch available AI providers from API layer:", error);
        return [];
    }
}

/**
 * 通过API层执行一个流式AI任务。
 * @param prompt - 发送给AI的最终提示词。
 * @param config - AI配置，如模型、温度等。
 * @param taskType - 任务的类型 ('润色', '续写' 等).
 * @param sourceItemTitle - 任务源文档的标题.
 * @param callbacks - 用于处理数据流、完成和错误事件的回调对象。
 */
export function streamAITask(
    prompt: string,
    config: AIProviderConfig,
    taskType: AITaskType,
    sourceItemTitle: string,
    callbacks: StreamCallbacks
): void {
    console.log(`[AI Service] Delegating task to API layer. Type: ${taskType}, Title: ${sourceItemTitle}`);
    streamAITaskFromApi(prompt, config, taskType, sourceItemTitle, callbacks);
}