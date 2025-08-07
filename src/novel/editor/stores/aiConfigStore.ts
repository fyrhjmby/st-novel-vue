import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AITask } from '@/novel/editor/types';

type TaskType = AITask['type'];

// 定义每种任务类型的默认提示词模板
const defaultPrompts: Record<TaskType, { name: string, template: string }[]> = {
    '润色': [
        { name: '默认润色提示词', template: '你是一名专业的小说编辑，请根据上下文，对以下“待处理内容”进行润色，使其更具文采和表现力。' },
        { name: '增强创造性提示词', template: '你是一名富有想象力的作家，请跳出常规，用更具创造性和独特风格的语言重写以下“待处理内容”，可以适度偏离原文。' }
    ],
    '续写': [
        { name: '默认续写提示词', template: '你是一名小说家，请根据所有上下文信息，紧接着“待处理内容”的结尾，自然地续写接下来的故事情节。' },
        { name: '增强戏剧性提示词', template: '你是一名顶尖的剧本编剧，请在续写时增加戏剧性冲突或意外转折，让故事更有张力。' }
    ],
    '分析': [
        { name: '默认分析提示词', template: '请作为一个文学评论家，分析以下“待处理内容”的结构、角色动态、潜在主题和写作风格。' },
        { name: '深度结构分析提示词', template: '请从叙事技巧、象征意义和读者情感引导等角度，深度剖析以下“待处理内容”，并提出改进建议。' }
    ],
    '剧情生成': [
        { name: '默认剧情生成提示词', template: '你是一名创意编剧，请根据“待处理内容”中描写的场景或事件，生成一段相关的、有趣的后续剧情大纲。' },
        { name: '生成反转剧情提示词', template: '你是一名擅长制造悬念的编剧，请根据“待处理内容”，构思一个包含意外反转的后续剧情大纲。' }
    ],
};

export const useAIConfigStore = defineStore('aiConfig', () => {
    const taskPromptConfigs = ref<Record<TaskType, { prompts: { name: string, template: string }[], selected: string }>>({
        '润色': { prompts: defaultPrompts['润色'], selected: defaultPrompts['润色'][0].name },
        '续写': { prompts: defaultPrompts['续写'], selected: defaultPrompts['续写'][0].name },
        '分析': { prompts: defaultPrompts['分析'], selected: defaultPrompts['分析'][0].name },
        '剧情生成': { prompts: defaultPrompts['剧情生成'], selected: defaultPrompts['剧情生成'][0].name },
    });

    /**
     * 更新指定任务类型选择的提示词
     * @param taskType 要更新的任务类型
     * @param promptName 选择的提示词名称
     */
    const setSelectedPrompt = (taskType: TaskType, promptName: string) => {
        if (taskPromptConfigs.value[taskType]) {
            taskPromptConfigs.value[taskType].selected = promptName;
        }
    };

    return {
        taskPromptConfigs,
        setSelectedPrompt,
    };
});