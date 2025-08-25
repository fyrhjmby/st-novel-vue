// 文件: ..\src\novel\editor\stores\derivedContentStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PlotAnalysisItem, AITaskType, EditorItem } from '@/novel/editor/types';
import * as derivedContentService from '@/novel/editor/services/derivedContentService';

const formatContentForEditor = (title: string, rawContent: string): string => {
    const body = rawContent.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p}</p>`).join('');
    return `<h1>${title}</h1>${body}`;
};

export const useDerivedContentStore = defineStore('derivedContent', () => {
    const plotItems = ref<PlotAnalysisItem[]>([]);
    const analysisItems = ref<PlotAnalysisItem[]>([]);
    const novelId = ref<string | null>(null);

    function _setDerivedData(items: PlotAnalysisItem[]) {
        plotItems.value = items.filter(item => item.type === 'plot');
        analysisItems.value = items.filter(item => item.type === 'analysis');
    }

    async function fetchDerivedContent(id: string) {
        novelId.value = id;
        try {
            const allItems = await derivedContentService.getDerivedItemsForNovel(id);
            _setDerivedData(allItems);
        } catch (error) {
            console.error("Failed to fetch derived content:", error);
            _setDerivedData([]);
        }
    }

    async function saveDerivedContent() {
        const allItems = [...plotItems.value, ...analysisItems.value];
        const updatePromises = allItems.map(item =>
            derivedContentService.updateDerivedItem(item.id, {
                title: item.title,
                content: item.content,
                sourceId: item.sourceId
            })
        );
        await Promise.all(updatePromises);
    }

    function getDerivedItemsForSource(sourceId: string, type: 'plot' | 'analysis'): PlotAnalysisItem[] {
        const sourceArray = type === 'plot' ? plotItems.value : analysisItems.value;
        return sourceArray.filter(item => item.sourceId === sourceId);
    }

    async function createAndAddDerivedItem(sourceNode: EditorItem, taskType: AITaskType, generatedContent: string): Promise<PlotAnalysisItem | null> {
        if (!novelId.value || (taskType !== '分析' && taskType !== '剧情生成') || (sourceNode.type !== 'chapter' && sourceNode.type !== 'volume')) {
            return null;
        }

        const derivedType = taskType === '分析' ? 'analysis' : 'plot';
        const newItem = await createManualDerivedItem(sourceNode, derivedType, generatedContent, true);
        return newItem;
    }

    async function createManualDerivedItem(sourceNode: EditorItem, derivedType: 'plot' | 'analysis', content: string = '', isFromAI: boolean = false): Promise<PlotAnalysisItem | null> {
        if (!novelId.value || (sourceNode.type !== 'chapter' && sourceNode.type !== 'volume')) return null;

        const now = new Date();
        const timestamp = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        const typeName = derivedType === 'plot' ? '剧情' : '分析';
        const titlePrefix = sourceNode.type === 'volume' ? '卷' : '';

        const finalTitle = isFromAI
            ? `《${titlePrefix}${sourceNode.title}》${typeName} - ${timestamp} (AI)`
            : `《${titlePrefix}${sourceNode.title}》${typeName} - ${timestamp}`;

        const finalContent = content
            ? formatContentForEditor(finalTitle, content)
            : `<h1>${finalTitle}</h1><p>请在这里编写${typeName}内容...</p>`;

        const itemData: Omit<PlotAnalysisItem, 'id'> = {
            type: derivedType,
            sourceId: sourceNode.id,
            title: finalTitle,
            content: finalContent
        };

        const newItem = await derivedContentService.createDerivedItem(itemData);

        const targetArray = derivedType === 'plot' ? plotItems : analysisItems;
        targetArray.value.unshift(newItem);

        return newItem;
    }

    function findItemById(nodeId: string): PlotAnalysisItem | null {
        return [...plotItems.value, ...analysisItems.value].find(item => item.id === nodeId) || null;
    }

    function updateNodeContent(nodeId: string, content: string) {
        const item = findItemById(nodeId);
        if (item) {
            item.content = content;
            const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
            const newTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';
            if (newTitle && newTitle !== item.title) {
                item.title = newTitle;
            }
        }
    }

    async function deleteDerivedItem(itemId: string): Promise<boolean> {
        try {
            await derivedContentService.deleteDerivedItem(itemId);
            let index = plotItems.value.findIndex(i => i.id === itemId);
            if (index > -1) plotItems.value.splice(index, 1);

            index = analysisItems.value.findIndex(i => i.id === itemId);
            if (index > -1) analysisItems.value.splice(index, 1);
            return true;
        } catch (error) {
            console.error('Failed to delete derived item:', error);
            return false;
        }
    }

    async function deleteDerivedDataForSource(sourceId: string) {
        const itemsToDelete = [
            ...plotItems.value.filter(item => item.sourceId === sourceId),
            ...analysisItems.value.filter(item => item.sourceId === sourceId)
        ];

        const deletePromises = itemsToDelete.map(item => deleteDerivedItem(item.id));
        await Promise.all(deletePromises);
    }

    function updateTitlesForSource(sourceId: string, newSourceTitle: string) {
        const itemsToUpdate = [
            ...plotItems.value.filter(item => item.sourceId === sourceId),
            ...analysisItems.value.filter(item => item.sourceId === sourceId)
        ];

        itemsToUpdate.forEach(item => {
            // Regex to find the part of the title to replace, e.g., "《...》"
            const oldTitlePattern = /《(.*?)》/;
            const match = item.title.match(oldTitlePattern);

            if (match) {
                const titlePrefix = item.sourceId.startsWith('vol-') ? '卷' : '';
                const newTitlePart = `《${titlePrefix}${newSourceTitle}》`;
                const newTitle = item.title.replace(oldTitlePattern, newTitlePart);

                item.title = newTitle;
                if (item.content.includes('<h1>')) {
                    item.content = item.content.replace(/<h1[^>]*>.*?<\/h1>/, `<h1>${newTitle}</h1>`);
                }
            }
        });
    }

    return {
        plotItems,
        analysisItems,
        fetchDerivedContent,
        saveDerivedContent,
        getDerivedItemsForSource,
        createAndAddDerivedItem,
        createManualDerivedItem,
        findItemById,
        updateNodeContent,
        deleteDerivedItem,
        deleteDerivedDataForSource,
        updateTitlesForSource,
    };
});