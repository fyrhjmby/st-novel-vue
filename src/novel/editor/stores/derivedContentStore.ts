// 文件: src/novel/editor/stores/derivedContentStore.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PlotAnalysisItem, AITaskType, EditorItem } from '@/novel/editor/types';

export const useDerivedContentStore = defineStore('derivedContent', () => {
    const plotItems = ref<PlotAnalysisItem[]>([]);
    const analysisItems = ref<PlotAnalysisItem[]>([]);

    /**
     * 为指定源（章节或卷）创建一个新的派生内容项（占位符）。
     * @param sourceNode - 源节点对象 (章节或卷)
     * @param taskType - 任务类型 ('分析' 或 '剧情生成')
     * @returns 新创建的派生内容项
     */
    function createDerivedItem(sourceNode: EditorItem, taskType: AITaskType): PlotAnalysisItem | null {
        if (taskType !== '分析' && taskType !== '剧情生成') return null;
        if (sourceNode.type !== 'chapter' && sourceNode.type !== 'volume') return null;


        const now = new Date();
        const timestamp = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

        const derivedType: PlotAnalysisItem['type'] = taskType === '分析' ? 'analysis' : 'plot';
        const titleSuffix = taskType;
        const titlePrefix = sourceNode.type === 'volume' ? '卷' : '';

        const newItem: PlotAnalysisItem = {
            id: `${derivedType}_${now.getTime()}`, // 使用时间戳保证ID唯一
            type: derivedType,
            sourceId: sourceNode.id,
            title: `《${titlePrefix}${sourceNode.title}》${titleSuffix} - ${timestamp}`,
            content: `<h1>《${titlePrefix}${sourceNode.title}》${titleSuffix} - ${timestamp}</h1><p>AI正在生成内容，请稍候...</p>`
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
        createDerivedItem,
        findItemById,
        updateNodeContent,
        appendNodeContent,
        deleteDerivedDataForSource,
    };
});