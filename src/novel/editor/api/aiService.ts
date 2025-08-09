// ..\src\novel\editor\api\aiService.ts
import type { AIProviderConfig } from '@/novel/editor/types';

interface StreamCallbacks {
    onChunk: (chunk: string) => void;
    onComplete: () => void;
    onError: (error: string) => void;
}

/**
 * 模拟一个流式AI任务API。
 * 这个函数接收一个提示词，然后通过回调函数逐字地将这个提示词返回，
 * 以模拟一个接收到什么就返回什么的 "echo" 服务器。
 * @param prompt - 发送给AI的最终提示词。
 * @param config - AI配置，如模型、温度等。
 * @param callbacks - 用于处理数据流、完成和错误事件的回调对象。
 */
export function streamAITask(prompt: string, config: AIProviderConfig, callbacks: StreamCallbacks): void {
    console.log(`[AI Service] Streaming task with config:`, config);
    const { onChunk, onComplete, onError } = callbacks;
    const words = prompt.split('');
    let wordIndex = 0;
    const willFail = Math.random() < 0.1; // 10%的几率模拟失败

    const intervalId = setInterval(() => {
        // 模拟流式输出
        if (wordIndex < words.length) {
            onChunk(words[wordIndex]);
            wordIndex++;
            // 模拟中途失败
            if (willFail && wordIndex > words.length / 2) {
                clearInterval(intervalId);
                onError('模拟网络错误，请重试。');
                return;
            }
        } else {
            // 流式结束
            clearInterval(intervalId);
            onComplete();
        }
    }, 20); // 调整流式速度
}