// 文件: src/novel/editor/stores/derivedContentStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PlotAnalysisItem, AITaskType, EditorItem } from '@/novel/editor/types';

const formatContentForEditor = (title: string, rawContent: string): string => {
    const body = rawContent.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p}</p>`).join('');
    return `<h1>${title}</h1>${body}`;
};

export const useDerivedContentStore = defineStore('derivedContent', () => {
    const plotItems = ref<PlotAnalysisItem[]>([]);
    const analysisItems = ref<PlotAnalysisItem[]>([]);

    /**
     * 从项目数据中获取派生内容。
     * @param plotData - 项目中存储的剧情数据
     * @param analysisData - 项目中存储的分析数据
     */
    function fetchDerivedData(plotData: PlotAnalysisItem[], analysisData: PlotAnalysisItem[]) {
        plotItems.value = plotData;
        analysisItems.value = analysisData;
    }

    /**
     * 根据已完成的AI任务，创建并添加一个新的、内容完整的派生内容项。
     * @param sourceNode - 源节点对象 (章节或卷)
     * @param taskType - 任务类型 ('分析' 或 '剧情生成')
     * @param generatedContent - AI生成的原始文本内容
     * @returns 新创建的派生内容项
     */
    function createAndAddDerivedItem(sourceNode: EditorItem, taskType: AITaskType, generatedContent: string): PlotAnalysisItem | null {
        if (taskType !== '分析' && taskType !== '剧情生成') return null;
        if (sourceNode.type !== 'chapter' && sourceNode.type !== 'volume') return null;

        const now = new Date();
        const timestamp = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

        const derivedType: PlotAnalysisItem['type'] = taskType === '分析' ? 'analysis' : 'plot';
        const titlePrefix = sourceNode.type === 'volume' ? '卷' : '';
        const finalTitle = `《${titlePrefix}${sourceNode.title}》${taskType} - ${timestamp}`;

        const finalContent = formatContentForEditor(finalTitle, generatedContent);

        const newItem: PlotAnalysisItem = {
            id: `${derivedType}_${now.getTime()}`,
            type: derivedType,
            sourceId: sourceNode.id,
            title: finalTitle,
            content: finalContent
        };

        if (derivedType === 'analysis') {
            analysisItems.value.unshift(newItem);
        } else {
            plotItems.value.unshift(newItem);
        }

        return newItem;
    }

    /**
     * 根据ID从所有派生项中查找。
     * @param nodeId - 派生内容的ID
     */
    function findItemById(nodeId: string): PlotAnalysisItem | null {
        return [...plotItems.value, ...analysisItems.value].find(item => item.id === nodeId) || null;
    }

    /**
     * 更新派生内容。
     * @param nodeId - 派生内容的ID
     * @param content - 新的HTML内容
     */
    function updateNodeContent(nodeId: string, content: string) {
        const derivedItem = findItemById(nodeId);
        if (derivedItem) {
            derivedItem.content = content;
        }
    }

    /**
     * (此函数不再用于派生内容，但为保持接口一致性而保留)
     * 向派生内容追加内容。
     * @param nodeId - 派生内容的ID
     * @param contentToAppend - 要追加的原始文本
     */
    function appendNodeContent(nodeId: string, contentToAppend: string) {
        const derivedItem = findItemById(nodeId);
        if (derivedItem) {
            const paragraphs = contentToAppend.split('\n').map(p => `<p>${p || ' '}</p>`).join('');
            if (!derivedItem.content) derivedItem.content = "";
            derivedItem.content += paragraphs;
        }
    }

    /**
     * 删除与指定源ID关联的所有派生数据。
     * @param sourceId - 源的ID
     */
    function deleteDerivedDataForSource(sourceId: string) {
        plotItems.value = plotItems.value.filter(item => item.sourceId !== sourceId);
        analysisItems.value = analysisItems.value.filter(item => item.sourceId !== sourceId);
    }


    return {
        plotItems,
        analysisItems,
        fetchDerivedData,
        createAndAddDerivedItem,
        findItemById,
        updateNodeContent,
        appendNodeContent,
        deleteDerivedDataForSource,
    };
});