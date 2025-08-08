// 文件: src/novel/editor/composables/useContextBuilder.ts

import { useDirectoryStore } from '@/novel/editor/stores/directoryStore';
import { useContextSettingsStore } from '@/novel/editor/stores/contextSettingsStore';
import { useDerivedContentStore } from '@/novel/editor/stores/derivedContentStore';
import { useAIConfigStore } from '@novel/editor/stores/ai/aiConfigStore.ts';
import { usePromptTemplateStore } from '@/novel/editor/stores/promptTemplateStore';
import type { AITask, ContextBuildResult, Volume, Chapter, DynamicContextSettings } from '@/novel/editor/types';

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
    const promptTemplateStore = usePromptTemplateStore();

    const _getVolumeOutlineHtml = (vol: Volume): string => {
        return `<hr><h3>相关卷大纲: ${vol.title}</h3>${vol.content}`;
    };

    const _getVolumeFullContextHtml = (vol: Volume, settings: DynamicContextSettings): string => {
        let html = `<hr><h3>相关卷: ${vol.title}</h3>${vol.content}`;
        if (settings.includeVolumePlot) {
            const plot = derivedContentStore.plotItems.find(p => p.sourceId === vol.id);
            if (plot) html += `<h4>卷剧情: ${plot.title}</h4>${plot.content}`;
        }
        if (settings.includeVolumeAnalysis) {
            const analysis = derivedContentStore.analysisItems.find(a => a.sourceId === vol.id);
            if (analysis) html += `<h4>卷分析: ${analysis.title}</h4>${analysis.content}`;
        }
        return html;
    };

    const _buildContextForChapterTask = (sourceChapter: Chapter, sourceVolume: Volume): string => {
        const settings = contextSettingsStore.dynamicContextSettings;
        const allVolumes = directoryStore.directoryData;
        let dynamicContextHtml = '';

        const currentVolumeIndex = allVolumes.findIndex(v => v.id === sourceVolume.id);
        const currentChapterIndex = sourceVolume.chapters.findIndex(c => c.id === sourceChapter.id);

        // 规则一：前置卷只包含大纲
        const prevVolStart = Math.max(0, currentVolumeIndex - settings.prevVolumes);
        for (let i = prevVolStart; i < currentVolumeIndex; i++) {
            dynamicContextHtml += _getVolumeOutlineHtml(allVolumes[i]);
        }

        // 规则一：当前卷包含完整信息
        dynamicContextHtml += `<hr><h3>当前卷: ${sourceVolume.title}</h3>${sourceVolume.content}`;
        if (settings.includeVolumePlot) {
            const plot = derivedContentStore.plotItems.find(p => p.sourceId === sourceVolume.id);
            if (plot) dynamicContextHtml += `<h4>卷剧情: ${plot.title}</h4>${plot.content}`;
        }
        if (settings.includeVolumeAnalysis) {
            const analysis = derivedContentStore.analysisItems.find(a => a.sourceId === sourceVolume.id);
            if (analysis) dynamicContextHtml += `<h4>卷分析: ${analysis.title}</h4>${analysis.content}`;
        }

        // 规则一：前置章节、后置章节
        if (currentChapterIndex > -1) {
            const chapters = sourceVolume.chapters;
            const prevChapStart = Math.max(0, currentChapterIndex - settings.prevChapters);
            for (let i = prevChapStart; i < currentChapterIndex; i++) {
                dynamicContextHtml += `<hr><h3>前文章节: ${chapters[i].title}</h3>${chapters[i].content}`;
            }
            const nextChapEnd = Math.min(chapters.length, currentChapterIndex + 1 + settings.nextChapters);
            for (let i = currentChapterIndex + 1; i < nextChapEnd; i++) {
                dynamicContextHtml += `<hr><h3>后续章节: ${chapters[i].title}</h3>${chapters[i].content}`;
            }
        }

        // 规则一：本章的剧情与分析
        if (settings.includeRelatedPlot) {
            derivedContentStore.plotItems.filter(p => p.sourceId === sourceChapter.id).forEach(plot => {
                dynamicContextHtml += `<hr><h3>与本章相关的剧情</h3>${plot.content}`;
            });
        }
        if (settings.includeRelatedAnalysis) {
            derivedContentStore.analysisItems.filter(a => a.sourceId === sourceChapter.id).forEach(analysis => {
                dynamicContextHtml += `<hr><h3>与本章相关的分析</h3>${analysis.content}`;
            });
        }

        // 规则一：后置卷只包含大纲
        const nextVolEnd = Math.min(allVolumes.length, currentVolumeIndex + 1 + settings.nextVolumes);
        for (let i = currentVolumeIndex + 1; i < nextVolEnd; i++) {
            dynamicContextHtml += _getVolumeOutlineHtml(allVolumes[i]);
        }

        return dynamicContextHtml;
    };

    const _buildContextForVolumeTask = (sourceVolume: Volume): string => {
        const settings = contextSettingsStore.dynamicContextSettings;
        const allVolumes = directoryStore.directoryData;
        let dynamicContextHtml = '';
        const currentVolumeIndex = allVolumes.findIndex(v => v.id === sourceVolume.id);

        // 规则二：前置卷
        const prevVolStart = Math.max(0, currentVolumeIndex - settings.prevVolumes);
        for (let i = prevVolStart; i < currentVolumeIndex; i++) {
            dynamicContextHtml += _getVolumeFullContextHtml(allVolumes[i], settings);
        }

        // 规则二：当前卷内容、剧情、分析
        dynamicContextHtml += `<hr><h3>当前卷大纲: ${sourceVolume.title}</h3>${sourceVolume.content}`;
        if (settings.includeVolumePlot) {
            const plot = derivedContentStore.plotItems.find(p => p.sourceId === sourceVolume.id);
            if (plot) dynamicContextHtml += `<h4>卷剧情: ${plot.title}</h4>${plot.content}`;
        }
        if (settings.includeVolumeAnalysis) {
            const analysis = derivedContentStore.analysisItems.find(a => a.sourceId === sourceVolume.id);
            if (analysis) dynamicContextHtml += `<h4>卷分析: ${analysis.title}</h4>${analysis.content}`;
        }

        // 规则二：本卷内的章节剧情与分析
        sourceVolume.chapters.forEach(chapter => {
            let chapterDerivedHtml = '';
            if (settings.includeRelatedPlot) {
                derivedContentStore.plotItems
                    .filter(p => p.sourceId === chapter.id)
                    .forEach(plot => { chapterDerivedHtml += `<h4>剧情: ${plot.title}</h4>${plot.content}`; });
            }
            if (settings.includeRelatedAnalysis) {
                derivedContentStore.analysisItems
                    .filter(a => a.sourceId === chapter.id)
                    .forEach(analysis => { chapterDerivedHtml += `<h4>分析: ${analysis.title}</h4>${analysis.content}`; });
            }
            if (chapterDerivedHtml) {
                dynamicContextHtml += `<hr><h3>章节派生内容 (${chapter.title})</h3>${chapterDerivedHtml}`;
            }
        });

        // 规则二：后置卷
        const nextVolEnd = Math.min(allVolumes.length, currentVolumeIndex + 1 + settings.nextVolumes);
        for (let i = currentVolumeIndex + 1; i < nextVolEnd; i++) {
            dynamicContextHtml += _getVolumeFullContextHtml(allVolumes[i], settings);
        }

        return dynamicContextHtml;
    };

    const buildContextForTask = (task: Pick<AITask, 'type' | 'sourceItemId' | 'sourceItemTitle' | 'sourceItemContent'>): ContextBuildResult | null => {
        const { type: taskType, sourceItemId, sourceItemTitle, sourceItemContent } = task;
        const mainContentText = stripHtml(sourceItemContent);

        let fixedContextHtml = '';
        contextSettingsStore.selectedContextItems.forEach(item => {
            if (item.content) fixedContextHtml += `<hr><h3>相关${item.category}: ${item.group} - ${item.title}</h3>${item.content}`;
        });
        contextSettingsStore.selectedOthersItems.forEach(item => {
            if (item.content) fixedContextHtml += `<hr><h3>相关${item.category}: ${item.title}</h3>${item.content}`;
        });
        if (contextSettingsStore.customContextContent.trim()) {
            fixedContextHtml += `<hr><h3>自定义固定内容</h3><p>${contextSettingsStore.customContextContent.trim().replace(/\n/g, '<br>')}</p>`;
        }
        const fixedContextText = stripHtml(fixedContextHtml);

        let dynamicContextHtml = '';
        const sourceItemResult = directoryStore.findNodeById(sourceItemId);
        if (!sourceItemResult) return null;

        const { node: sourceNode, parent: sourceParent } = sourceItemResult;

        if (sourceNode.type === 'chapter' && sourceParent) {
            dynamicContextHtml = _buildContextForChapterTask(sourceNode, sourceParent);
        } else if (sourceNode.type === 'volume') {
            dynamicContextHtml = _buildContextForVolumeTask(sourceNode);
        }
        const dynamicContextText = stripHtml(dynamicContextHtml);

        const ragContext = contextSettingsStore.isRagEnabled ? '【RAG智能检索功能已开启，将根据任务内容自动查询知识库...】' : 'RAG检索已禁用或未返回任何结果。';
        const taskConfig = aiConfigStore.taskConfigs[taskType];
        const promptNode = promptTemplateStore.findPromptById(taskConfig.selectedPromptId);
        let selectedPromptTemplate = `请为《${sourceItemTitle}》执行“${taskType}”任务。`;
        if (promptNode?.content) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = promptNode.content;
            selectedPromptTemplate = (tempDiv.querySelector('pre')?.textContent || selectedPromptTemplate).replace(/{{sourceItemTitle}}/g, sourceItemTitle);
        }

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