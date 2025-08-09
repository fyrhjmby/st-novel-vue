// 文件: src/novel/editor/composables/useContextBuilder.ts

import { useDirectoryStore } from '@/novel/editor/stores/directoryStore';
import { useContextSettingsStore } from '@/novel/editor/stores/contextSettingsStore';
import { useDerivedContentStore } from '@/novel/editor/stores/derivedContentStore';
import { useReferenceStore } from '@/novel/editor/stores/referenceStore';
import { useAIConfigStore } from '@novel/editor/stores/ai/aiConfigStore.ts';
import { usePromptTemplateStore } from '@/novel/editor/stores/promptTemplateStore';
import type { AITask, ContextBuildResult, Volume, Chapter, DynamicContextSettings, ReferenceContextSettings, TreeNode } from '@/novel/editor/types';

const stripHtml = (html: string) => {
    if (typeof document === 'undefined') return html;
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

const _findDerivedItemsRecursive = (nodes: TreeNode[], sourceId: string): TreeNode[] => {
    let results: TreeNode[] = [];
    for (const node of nodes) {
        if (node.originalData?.sourceId === sourceId) {
            results.push(node);
        }
        if (node.children) {
            results = [...results, ..._findDerivedItemsRecursive(node.children, sourceId)];
        }
    }
    return results;
}

export function useContextBuilder() {
    const directoryStore = useDirectoryStore();
    const contextSettingsStore = useContextSettingsStore();
    const derivedContentStore = useDerivedContentStore();
    const referenceStore = useReferenceStore();
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

        const prevVolStart = Math.max(0, currentVolumeIndex - settings.prevVolumes);
        for (let i = prevVolStart; i < currentVolumeIndex; i++) {
            dynamicContextHtml += _getVolumeOutlineHtml(allVolumes[i]);
        }

        dynamicContextHtml += `<hr><h3>当前卷: ${sourceVolume.title}</h3>${sourceVolume.content}`;
        if (settings.includeVolumePlot) {
            const plot = derivedContentStore.plotItems.find(p => p.sourceId === sourceVolume.id);
            if (plot) dynamicContextHtml += `<h4>卷剧情: ${plot.title}</h4>${plot.content}`;
        }
        if (settings.includeVolumeAnalysis) {
            const analysis = derivedContentStore.analysisItems.find(a => a.sourceId === sourceVolume.id);
            if (analysis) dynamicContextHtml += `<h4>卷分析: ${analysis.title}</h4>${analysis.content}`;
        }

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

        const prevVolStart = Math.max(0, currentVolumeIndex - settings.prevVolumes);
        for (let i = prevVolStart; i < currentVolumeIndex; i++) {
            dynamicContextHtml += _getVolumeFullContextHtml(allVolumes[i], settings);
        }

        dynamicContextHtml += `<hr><h3>当前卷大纲: ${sourceVolume.title}</h3>${sourceVolume.content}`;
        if (settings.includeVolumePlot) {
            const plot = derivedContentStore.plotItems.find(p => p.sourceId === sourceVolume.id);
            if (plot) dynamicContextHtml += `<h4>卷剧情: ${plot.title}</h4>${plot.content}`;
        }
        if (settings.includeVolumeAnalysis) {
            const analysis = derivedContentStore.analysisItems.find(a => a.sourceId === sourceVolume.id);
            if (analysis) dynamicContextHtml += `<h4>卷分析: ${analysis.title}</h4>${analysis.content}`;
        }

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

        const nextVolEnd = Math.min(allVolumes.length, currentVolumeIndex + 1 + settings.nextVolumes);
        for (let i = currentVolumeIndex + 1; i < nextVolEnd; i++) {
            dynamicContextHtml += _getVolumeFullContextHtml(allVolumes[i], settings);
        }

        return dynamicContextHtml;
    };

    const _buildReferenceContextHtmlByIndex = (sourceNode: Chapter | Volume, vIndex: number, cIndex: number | null, settings: ReferenceContextSettings): string => {
        if (!referenceStore.referenceData.length || vIndex < 0) return '';

        let referenceContextHtml = '';

        for (const refBook of referenceStore.referenceData) {
            const directoryRoot = refBook.children?.find(c => c.id.startsWith('ref-dir-'));
            if (!directoryRoot) continue;

            const refVolumeNode = directoryRoot.children?.[vIndex];
            if (!refVolumeNode) continue;

            let matchingNode: TreeNode | null = null;
            let matchingParent: TreeNode | null = null;

            if (sourceNode.type === 'volume') {
                matchingNode = refVolumeNode;
            } else if (sourceNode.type === 'chapter' && cIndex !== null && cIndex >= 0) {
                matchingNode = refVolumeNode.children?.[cIndex] ?? null;
                matchingParent = refVolumeNode;
            }

            if (matchingNode) {
                referenceContextHtml += `<hr><h3>参考书籍《${refBook.title}》中的匹配内容: ${matchingNode.title}</h3>`;

                if (settings.includeContent && 'content' in matchingNode && matchingNode.content) {
                    referenceContextHtml += `<h4>正文</h4>${matchingNode.content}`;
                }

                if (settings.includeVolumeInfo && matchingParent && matchingParent.type.endsWith('volume') && 'content' in matchingParent && matchingParent.content) {
                    referenceContextHtml += `<h4>所属卷信息</h4>${matchingParent.content}`;
                }

                if (settings.includePlot) {
                    const plotRoot = refBook.children?.find(c => c.id.startsWith('ref-plot-'));
                    if (plotRoot) {
                        const plotItems = _findDerivedItemsRecursive(plotRoot.children || [], matchingNode.id);
                        if (plotItems.length > 0) {
                            referenceContextHtml += `<h4>相关剧情</h4>` + plotItems.map(p => 'content' in p ? p.content : '').join('<hr>');
                        }
                    }
                }
                if (settings.includeAnalysis) {
                    const analysisRoot = refBook.children?.find(c => c.id.startsWith('ref-analysis-'));
                    if (analysisRoot) {
                        const analysisItems = _findDerivedItemsRecursive(analysisRoot.children || [], matchingNode.id);
                        if (analysisItems.length > 0) {
                            referenceContextHtml += `<h4>相关分析</h4>` + analysisItems.map(a => 'content' in a ? a.content : '').join('<hr>');
                        }
                    }
                }
            }
        }
        return referenceContextHtml;
    }

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

        let referenceContextHtml = '';
        if ((sourceNode.type === 'chapter' && sourceParent) || sourceNode.type === 'volume') {
            const vIndex = directoryStore.directoryData.findIndex(v => v.id === (sourceParent?.id || sourceNode.id));
            const cIndex = sourceNode.type === 'chapter' && sourceParent ? sourceParent.chapters.findIndex(c => c.id === sourceNode.id) : null;
            referenceContextHtml = _buildReferenceContextHtmlByIndex(sourceNode, vIndex, cIndex, contextSettingsStore.referenceContextSettings);
        }
        const referenceContextText = stripHtml(referenceContextHtml);

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

# 参考书籍上下文
${referenceContextText.trim() || '无'}

# RAG检索信息
${ragContext.trim() || '无'}

# 待处理内容
${mainContentText.trim() || '无'}

--------
请严格按照任务提示词的要求开始执行：`;

        return {
            fixed: fixedContextHtml.trim(),
            dynamic: dynamicContextHtml.trim(),
            reference: referenceContextHtml.trim(),
            rag: ragContext,
            prompt: prompt,
            stats: {
                fixedCharCount: fixedContextText.trim().length,
                dynamicCharCount: dynamicContextText.trim().length,
                referenceCharCount: referenceContextText.trim().length,
                ragCharCount: ragContext.trim().length,
                promptCharCount: prompt.trim().length
            }
        };
    };

    return { buildContextForTask };
}