
import { useAITaskStore } from '@novel/editor/stores/ai/aiTaskStore';
import { useUIStore } from '@novel/editor/stores/uiStore';
import { useContextBuilder } from '@novel/editor/composables/useContextBuilder';
import { streamAITask } from '@novel/editor/services/ai/aiService.ts';
import type { AITask } from '@/novel/editor/types';

const { buildContextForTask } = useContextBuilder();

function executeTaskAndStream(task: AITask) {
    const aiTaskStore = useAITaskStore();

    aiTaskStore.updateTaskStatus(task.id, 'processing');

    // 如果任务没有最终提示词，立即构建它
    if (!task.finalPrompt) {
        const contextResult = buildContextForTask(task);
        if (!contextResult || !contextResult.prompt) {
            aiTaskStore.updateTaskError(task.id, '上下文构建失败，无法生成最终提示词。');
            processQueue(); // 继续处理下一个任务
            return;
        }
        task.finalPrompt = contextResult.prompt;
    }

    const promptToUse = task.finalPrompt;

    streamAITask(promptToUse, task.aiConfig, task.type, task.sourceItemTitle, {
        onChunk: (chunk) => {
            aiTaskStore.appendGeneratedContent(task.id, chunk);
        },
        onComplete: () => {
            aiTaskStore.completeTask(task.id);
            processQueue(); // 完成后处理下一个
        },
        onError: (error) => {
            aiTaskStore.updateTaskError(task.id, error);
            processQueue(); // 出错后也处理下一个
        }
    });
}

/**
 * 处理任务队列。检查当前正在执行的任务数是否达到并发上限，
 * 如果没有，则从等待队列中取出任务开始执行。
 */
export function processQueue() {
    const uiStore = useUIStore();
    const aiTaskStore = useAITaskStore();

    const limit = uiStore.uiState.concurrentTaskLimit;
    const processingCount = aiTaskStore.tasks.filter(t => t.status === 'processing').length;

    if (processingCount >= limit) {
        return;
    }

    const canStartCount = limit - processingCount;
    const pendingTasks = aiTaskStore.tasks.filter(t => t.status === 'pending');

    const tasksToStart = pendingTasks.slice(0, canStartCount);

    for (const task of tasksToStart) {
        executeTaskAndStream(task);
    }
}