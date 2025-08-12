import { useEditorStore } from '@novel/editor/stores/editorStore';
import { useDerivedContentStore } from '@novel/editor/stores/derivedContentStore';
import { useAIConfigStore } from '@novel/editor/stores/ai/aiConfigStore';
import type { AITask, AITaskType } from '@/novel/editor/types';

/**
 * 创建一个新的AI任务对象。
 * @param taskType AI任务的类型。
 * @param sourceItemId 源文档的ID。
 * @param finalPrompt 可选的，预先构建好的最终提示词。
 * @returns 一个结构完整的AITask对象，如果源项目无效则返回null。
 */
export async function createTask(taskType: AITaskType, sourceItemId: string, finalPrompt?: string): Promise<AITask | null> {
    const editorStore = useEditorStore();
    const derivedContentStore = useDerivedContentStore();
    const aiConfigStore = useAIConfigStore();

    const { node: sourceItem } = editorStore.findItemById(sourceItemId);
    if (!sourceItem || !('content' in sourceItem) || typeof sourceItem.content !== 'string') {
        console.error("AI Task Factory Error: Source item not found or has no content.", sourceItemId);
        return null;
    }

    // --- 核心Bug修复：版本控制 ---
    // 为源对象打上一个时间戳作为版本号
    // 如果已有，则更新它
    (sourceItem as any)._lastModified = Date.now();
    const sourceItemVersion = (sourceItem as any)._lastModified;
    // --- 核心Bug修复结束 ---

    const taskConfigSettings = aiConfigStore.taskConfigs[taskType];
    const baseAIProviderConfig = aiConfigStore.availableAIProviders.find(p => p.id === taskConfigSettings.selectedAIProviderId);

    if (!baseAIProviderConfig) {
        console.error("AI Task Factory Error: Selected AI Provider Config not found.", taskConfigSettings.selectedAIProviderId);
        alert(`未找到ID为 "${taskConfigSettings.selectedAIProviderId}" 的AI配置，请在设置中检查。`);
        return null;
    }

    const finalAIConfig = {
        ...baseAIProviderConfig,
        temperature: taskConfigSettings.temperature,
    };

    let targetItemId: string;
    let taskTitle: string;

    if (taskType === '分析' || taskType === '剧情生成') {
        const newDerivedItem = derivedContentStore.createDerivedItem(sourceItem, taskType);
        if (!newDerivedItem) {
            console.error("AI Task Factory Error: Failed to create derived item shell.");
            return null;
        }
        targetItemId = newDerivedItem.id;
        taskTitle = newDerivedItem.title;
    } else {
        targetItemId = sourceItemId;
        taskTitle = `${taskType}《${sourceItem.title}》`;
    }

    const newTask: AITask = {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: taskTitle,
        type: taskType,
        sourceItemId: sourceItemId,
        targetItemId: targetItemId,
        sourceItemTitle: sourceItem.title,
        sourceItemContent: sourceItem.content,
        sourceItemVersion: sourceItemVersion, // 存储版本快照
        status: 'pending',
        generatedContent: '',
        finalPrompt: finalPrompt,
        createdAt: new Date(),
        aiConfig: finalAIConfig,
    };

    return newTask;
}