// 文件: src/novel/editor/composables/useAITaskExecutor.ts

import { useAITaskStore } from '@novel/editor/stores/ai/aiTaskStore.ts';
import { useContextSettingsStore } from '@/novel/editor/stores/contextSettingsStore';
import { useContextPreviewStore } from '@/novel/editor/stores/contextPreviewStore';
import type { AITaskType, EditorItem } from '@/novel/editor/types';

/**
 * AI 任务的源信息, 从核心 EditorItem 类型派生
 */
type TaskSource = Pick<EditorItem, 'id' | 'title'>;

/**
 * 提供一个统一的函数来执行 AI 任务。
 * 它会自动处理是否需要显示预览窗口的逻辑。
 */
export function useAITaskExecutor() {
    const aiTaskStore = useAITaskStore();
    const contextSettingsStore = useContextSettingsStore();
    const contextPreviewStore = useContextPreviewStore();

    /**
     * 执行 AI 任务。
     * @param taskType 要执行的任务类型 ('续写', '润色' 等)
     * @param source 任务的源对象，必须包含 id 和 title
     */
    const executeAITask = (taskType: AITaskType, source: TaskSource) => {
        if (!source || !source.id) {
            console.error("无法执行AI任务：缺少源信息。");
            return;
        }

        // 根据 context settings store 的状态，决定是直接开始任务还是显示预览
        if (contextSettingsStore.needsPreview) {
            contextPreviewStore.show({
                type: taskType,
                targetItemId: source.id,
                title: source.title,
            });
        } else {
            aiTaskStore.startTask(taskType, source.id);
        }
    };

    return { executeAITask };
}