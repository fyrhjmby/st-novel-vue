// 文件: ..\src\novel\editor\api\aiApi.ts
import { useAuthStore } from '@/auth/store/auth.store';
import type { AIProviderConfig, AITaskType } from '@novel/editor/types';

export const streamAITask = async (
    prompt: string,
    config: AIProviderConfig,
    taskType: AITaskType,
    sourceItemTitle: string,
    callbacks: {
        onChunk: (chunk: string) => void;
        onComplete: () => void;
        onError: (error: string) => void;
    }
): Promise<void> => {
    const { onChunk, onComplete, onError } = callbacks;
    let reader: ReadableStreamDefaultReader<string> | undefined;

    try {
        const authStore = useAuthStore();
        const token = authStore.token;
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/ai/tasks/stream', {
            method: 'POST',
            headers,
            body: JSON.stringify({ prompt, config, taskType, sourceItemTitle })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        if (!response.body) throw new Error('Response body is null.');

        reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += value;
            let boundaryIndex;
            while ((boundaryIndex = buffer.indexOf('\n\n')) >= 0) {
                const messageBlock = buffer.substring(0, boundaryIndex);
                buffer = buffer.substring(boundaryIndex + 2);

                if (messageBlock) {
                    const eventData = messageBlock.split('\n')
                        .find(line => line.startsWith('data:'))
                        ?.substring(5).trim();

                    if (eventData) {
                        try {
                            const parsedData = JSON.parse(eventData);
                            if (parsedData.event === 'chunk' && parsedData.content) onChunk(parsedData.content);
                            else if (parsedData.event === 'done') { onComplete(); return; }
                            else if (parsedData.event === 'error') { onError(parsedData.error || 'Unknown error'); return; }
                        } catch (e) { console.error("Failed to parse SSE data JSON:", eventData, e); }
                    }
                }
            }
        }
        onComplete();
    } catch (error) {
        onError(error instanceof Error ? error.message : 'An unknown streaming error occurred.');
    } finally {
        if (reader && !reader.closed) reader.cancel();
    }
};