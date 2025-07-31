// 文件: src/novel/editor/stores/derivedContentStore.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PlotAnalysisItem } from '@/novel/editor/types';
import { useDirectoryStore } from './directoryStore';

export const useDerivedContentStore = defineStore('derivedContent', () => {
    const plotData = ref<Map<string, PlotAnalysisItem>>(new Map());
    const analysisData = ref<Map<string, PlotAnalysisItem>>(new Map());

    /**
     * 确保为指定章节创建派生内容项（如果不存在）。
     * @param itemId - 派生内容的ID，格式为 `plot_{chapterId}` 或 `analysis_{chapterId}`
     */
    function ensureDerivedItemExists(itemId: string) {
        const [type, sourceChapterId] = itemId.split(/_(.+)/);
        if (!type || !sourceChapterId) return;

        const dataMap = type === 'plot' ? plotData.value : analysisData.value;
        if (dataMap.has(sourceChapterId)) return;

        const directoryStore = useDirectoryStore();
        const chapterResult = directoryStore.findNodeById(sourceChapterId);
        if (!chapterResult || chapterResult.node.type !== 'chapter') return;

        const chapter = chapterResult.node;
        const suffix = type === 'plot' ? ' 剧情' : ' 分析';
        const newItem: PlotAnalysisItem = {
            id: itemId,
            sourceChapterId: sourceChapterId,
            title: `${chapter.title}${suffix}`,
            content: `<h1>${chapter.title}${suffix}</h1><p>AI正在生成内容，请稍候...</p>`
        };
        dataMap.set(sourceChapterId, newItem);
    }

    /**
     * 根据ID从派生地图中查找内容。
     * @param nodeId - 派生内容的ID
     */
    function findItemFromDerivedMaps(nodeId: string): PlotAnalysisItem | null {
        const [type, sourceChapterId] = nodeId.split(/_(.+)/);
        if (!type || !sourceChapterId) return null;

        const dataMap = type === 'plot' ? plotData.value : (type === 'analysis' ? analysisData.value : null);
        return dataMap?.get(sourceChapterId) ?? null;
    }

    /**
     * 更新派生内容。
     * @param nodeId - 派生内容的ID
     * @param content - 新的HTML内容
     */
    function updateNodeContent(nodeId: string, content: string) {
        const derivedItem = findItemFromDerivedMaps(nodeId);
        if (derivedItem) {
            derivedItem.content = content;
            const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
            const newTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : derivedItem.title;
            if (newTitle) {
                derivedItem.title = newTitle;
            }
        }
    }

    /**
     * 向派生内容追加内容。
     * @param nodeId - 派生内容的ID
     * @param contentToAppend - 要追加的原始文本
     * @param isAutoApplied - 是否为自动应用
     */
    function appendNodeContent(nodeId: string, contentToAppend: string, isAutoApplied: boolean) {
        const derivedItem = findItemFromDerivedMaps(nodeId);
        if (derivedItem) {
            const paragraphs = contentToAppend.split('\n').map(p => `<p>${p || ' '}</p>`).join('');
            let htmlToAppend = paragraphs;
            if (isAutoApplied) {
                htmlToAppend += `<p style="font-size:0.8em; color: #9ca3af; text-align:center; margin: 1.5em 0;">--- AI生成内容已应用 ---</p>`;
            }
            if (!derivedItem.content) derivedItem.content = "";
            derivedItem.content += htmlToAppend;
        }
    }

    /**
     * 删除与指定章节ID关联的所有派生数据。
     * @param chapterId - 源章节的ID
     */
    function deleteDerivedDataForChapter(chapterId: string) {
        plotData.value.delete(chapterId);
        analysisData.value.delete(chapterId);
    }


    return {
        plotData,
        analysisData,
        ensureDerivedItemExists,
        findItemFromDerivedMaps,
        updateNodeContent,
        appendNodeContent,
        deleteDerivedDataForChapter,
    };
});