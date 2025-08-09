import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { TreeNode, ItemNode, AITaskType, PromptItemNode } from '@novel/editor/types';
import { getIconByNodeType } from '@novel/editor/utils/iconUtils';
import { promptService } from '@/novel/editor/services/promptService';
import { useAIConfigStore } from './ai/aiConfigStore';

const defaultSelectedPromptIds: Record<AITaskType, string> = {
    '润色': 'prompt-polish-default',
    '续写': 'prompt-continue-default',
    '分析': 'prompt-analyze-default',
    '剧情生成': 'prompt-plot-default',
    '创作': 'prompt-create-default',
};

export const usePromptTemplateStore = defineStore('promptTemplate', () => {
    // State: Use a simple ref, not a computed property, for the main data tree.
    const promptTree = ref<TreeNode[]>([]);

    /**
     * Action to initialize the prompt tree if it's empty.
     * This should be called once when the editor loads.
     */
    function initialize() {
        if (promptTree.value.length === 0) {
            promptTree.value = promptService.buildInitialTree();
        }
    }

    const getPromptsForTask = (taskType: AITaskType): ItemNode[] => {
        const group = promptTree.value[0]?.children?.find(g => (g as any).originalData.taskType === taskType);
        return (group?.children as ItemNode[] || []);
    };

    function findPromptById(promptId: string): { prompt: PromptItemNode, group: TreeNode } | null {
        if (!promptTree.value[0]?.children) return null;
        for (const group of promptTree.value[0].children) {
            const prompt = group.children?.find(p => p.id === promptId);
            if(prompt) return { prompt: prompt as PromptItemNode, group };
        }
        return null;
    }

    function addPrompt(groupId: string, title: string, template: string): PromptItemNode | null {
        const group = promptTree.value[0]?.children?.find(g => g.id === groupId);
        if (!group || !group.children) return null;

        const taskType = group.originalData.taskType;
        const newNode: PromptItemNode = {
            id: `prompt-custom-${Date.now()}`,
            title: title,
            type: 'prompt_item',
            icon: getIconByNodeType('prompt_item'),
            content: `<pre>${template}</pre>`,
            originalData: { taskType },
        };
        group.children.push(newNode);
        return newNode;
    }

    function renamePrompt(promptId: string, newTitle: string) {
        const result = findPromptById(promptId);
        if (result && newTitle.trim()) {
            result.prompt.title = newTitle.trim();
        }
    }

    function deletePrompt(promptId: string): boolean {
        const aiConfigStore = useAIConfigStore();
        const result = findPromptById(promptId);
        if (!result) return false;

        const { prompt, group } = result;
        const taskType = prompt.originalData.taskType;

        if (group && group.children) {
            const index = group.children.findIndex(p => p.id === promptId);
            if (index > -1) {
                group.children.splice(index, 1);

                if (aiConfigStore.taskConfigs[taskType].selectedPromptId === promptId) {
                    aiConfigStore.setSelectedPromptId(taskType, defaultSelectedPromptIds[taskType]);
                }
                return true;
            }
        }
        return false;
    }

    function updatePromptContent(promptId: string, newContent: string) {
        const result = findPromptById(promptId);
        if (result) {
            result.prompt.content = newContent;
        }
    }

    return {
        promptTree,
        initialize,
        getPromptsForTask,
        findPromptById: (id: string) => findPromptById(id)?.prompt || null,
        addPrompt,
        renamePrompt,
        deletePrompt,
        updatePromptContent,
    };
});