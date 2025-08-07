import { useDirectoryStore } from '@/novel/editor/stores/directoryStore';
import { useContextSettingsStore } from '@/novel/editor/stores/contextSettingsStore';
import { useDerivedContentStore } from '@/novel/editor/stores/derivedContentStore';
import { useAIConfigStore } from '@/novel/editor/stores/aiConfigStore';
import type { AITask, ContextBuildResult, EditorItem } from '@/novel/editor/types';

const stripHtml = (html: string) => {
    if (typeof document === 'undefined') return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

export function useContextBuilder() {
    const directoryStore = useDirectoryStore();
    const contextSettingsStore = useContextSettingsStore();
    const derivedContentStore = useDerivedContentStore();
    const aiConfigStore = useAIConfigStore();

    const buildContextForTask = (task: Pick<AITask, 'type' | 'sourceItemId' | 'sourceItemTitle' | 'sourceItemContent'>): ContextBuildResult | null => {
        const { type: taskType, sourceItemId, sourceItemTitle, sourceItemContent } = task;

        // **核心修正**: 直接使用任务快照中的内容作为“待处理内容”
        const mainContentText = stripHtml(sourceItemContent);

        // --- Build Fixed Context ---
        let fixedContextHtml = '';
        contextSettingsStore.selectedContextItems.forEach(item => {
            if (item.content) {
                fixedContextHtml += `<hr><h3>相关设定: ${item.group} - ${item.title}</h3>${item.content}`;
            }
        });
        if (contextSettingsStore.customContextContent.trim()) {
            fixedContextHtml += `<hr><h3>自定义固定内容</h3><p>${contextSettingsStore.customContextContent.trim().replace(/\n/g, '<br>')}</p>`;
        }
        const fixedContextText = stripHtml(fixedContextHtml);

        // --- Build Dynamic Context ---
        // 动态上下文依然需要通过sourceItemId实时查找其在目录中的位置
        let dynamicContextHtml = '';
        const sourceItemResult = directoryStore.findNodeById(sourceItemId);

        if (sourceItemResult && sourceItemResult.node.type === 'chapter') {
            const { parent: volume, siblings: chapters, node } = sourceItemResult;
            const chapterIndex = chapters.findIndex(c => c.id === sourceItemId);

            if (volume && chapterIndex > -1) {
                const prevStart = Math.max(0, chapterIndex - contextSettingsStore.dynamicContextSettings.prevChapters);
                for (let i = prevStart; i < chapterIndex; i++) {
                    const prevChapter = chapters[i] as EditorItem;
                    if ('content' in prevChapter && prevChapter.content) {
                        dynamicContextHtml += `<hr><h3>前文章节: ${prevChapter.title}</h3>${prevChapter.content}`;
                    }
                }

                const nextEnd = Math.min(chapters.length, chapterIndex + 1 + contextSettingsStore.dynamicContextSettings.nextChapters);
                for (let i = chapterIndex + 1; i < nextEnd; i++) {
                    const nextChapter = chapters[i] as EditorItem;
                    if ('content' in nextChapter && nextChapter.content) {
                        dynamicContextHtml += `<hr><h3>后续章节内容: ${nextChapter.title}</h3>${nextChapter.content}`;
                    }
                }

                if (contextSettingsStore.dynamicContextSettings.includeRelatedPlot) {
                    const relatedPlots = derivedContentStore.plotItems.filter(p => p.sourceChapterId === sourceItemId);
                    if(relatedPlots.length > 0) {
                        dynamicContextHtml += `<hr><h3>与本章相关的剧情</h3>`;
                        relatedPlots.forEach(plot => { dynamicContextHtml += plot.content; });
                    }
                }
                if (contextSettingsStore.dynamicContextSettings.includeRelatedAnalysis) {
                    const relatedAnalyses = derivedContentStore.analysisItems.filter(a => a.sourceChapterId === sourceItemId);
                    if(relatedAnalyses.length > 0) {
                        dynamicContextHtml += `<hr><h3>与本章相关的分析</h3>`;
                        relatedAnalyses.forEach(analysis => { dynamicContextHtml += analysis.content; });
                    }
                }
            }
        }
        const dynamicContextText = stripHtml(dynamicContextHtml);

        // --- Build RAG & Final Prompt ---
        const ragContext = contextSettingsStore.isRagEnabled ? '【RAG智能检索功能已开启，将根据任务内容自动查询知识库...】' : 'RAG检索已禁用或未返回任何结果。';
        const taskConfig = aiConfigStore.taskPromptConfigs[taskType];
        const selectedPromptTemplate = taskConfig.prompts.find(p => p.name === taskConfig.selected)?.template || `请为《${sourceItemTitle}》执行“${taskType}”任务。`;

        const prompt = `[任务提示词]
${selectedPromptTemplate}

--------
[附加上下文]

# 固定上下文
${fixedContextText.trim() || '无'}

# 动态上下文
${dynamicContextText.trim() || '无'}

# RAG检索信息
${ragContext.trim() || '无'}

# 待处理内容
${mainContentText.trim() || '无'}

--------
请严格按照任务提示词的要求开始执行：`;

        return {
            fixed: fixedContextHtml.trim(),
            dynamic: dynamicContextHtml.trim(),
            rag: ragContext,
            prompt: prompt,
            stats: {
                fixedCharCount: fixedContextText.trim().length,
                dynamicCharCount: dynamicContextText.trim().length,
                ragCharCount: ragContext.trim().length,
                promptCharCount: prompt.trim().length
            }
        };
    };

    return { buildContextForTask };
}