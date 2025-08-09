import type { TreeNode, AITaskType } from '@novel/editor/types';
import { getIconByNodeType } from '@novel/editor/utils/iconUtils';

const DEFAULT_PROMPTS: Record<AITaskType, { id: string, name: string, template: string }[]> = {
    '润色': [
        { id: 'prompt-polish-default', name: '默认润色', template: '你是一名专业的小说编辑，请根据上下文，对以下“待处理内容”进行润色，使其更具文采和表现力。' },
        { id: 'prompt-polish-creative', name: '增强创造性', template: '你是一名富有想象力的作家，请跳出常规，用更具创造性和独特风格的语言重写以下“待处理内容”，可以适度偏离原文。' }
    ],
    '续写': [
        { id: 'prompt-continue-default', name: '默认续写', template: '你是一名小说家，请根据所有上下文信息，紧接着“待处理内容”的结尾，自然地续写接下来的故事情节。' },
        { id: 'prompt-continue-dramatic', name: '增强戏剧性', template: '你是一名顶尖的剧本编剧，请在续写时增加戏剧性冲突或意外转折，让故事更有张力。' }
    ],
    '分析': [
        { id: 'prompt-analyze-default', name: '默认分析', template: '请作为一个文学评论家，分析以下“待处理内容”的结构、角色动态、潜在主题和写作风格。' },
        { id: 'prompt-analyze-deep', name: '深度结构分析', template: '请从叙事技巧、象征意义和读者情感引导等角度，深度剖析以下“待处理内容”，并提出改进建议。' }
    ],
    '剧情生成': [
        { id: 'prompt-plot-default', name: '默认剧情生成', template: '你是一名创意编剧，请根据“待处理内容”中描写的场景或事件，生成一段相关的、有趣的后续剧情大纲。' },
        { id: 'prompt-plot-twist', name: '生成反转剧情', template: '你是一名擅长制造悬念的编剧，请根据“待处理内容”，构思一个包含意外反转的后续剧情大纲。' }
    ],
    '创作': [
        { id: 'prompt-create-default', name: '默认创作', template: '你是一位小说家，请根据“动态上下文”（其中可能包含剧情大纲和分析）以及“固定上下文”，为标题为《{{sourceItemTitle}}》的章节创作完整的正文内容。“待处理内容”是旧版或草稿，可作为参考，但你的主要任务是生成全新的、完整的章节。' },
    ],
};

class PromptService {

    public buildInitialTree(): TreeNode[] {
        const root: TreeNode = {
            id: 'prompt-root',
            title: '提示词模板',
            type: 'prompt_root',
            icon: getIconByNodeType('prompt_root'),
            children: (Object.keys(DEFAULT_PROMPTS) as AITaskType[]).map(taskType => {
                const groupNode: TreeNode = {
                    id: `prompt-group-${taskType}`,
                    title: `${taskType}提示词`,
                    type: 'prompt_group',
                    icon: getIconByNodeType(taskType),
                    isReadOnly: true,
                    originalData: { taskType },
                    children: DEFAULT_PROMPTS[taskType].map(prompt => ({
                        id: prompt.id,
                        title: prompt.name,
                        type: 'prompt_item',
                        icon: getIconByNodeType('prompt_item'),
                        content: `<pre>${prompt.template}</pre>`,
                        originalData: { taskType },
                    }))
                };
                return groupNode;
            })
        };
        return [root];
    }
}

export const promptService = new PromptService();