// 文件: ..\src\novel\editor\stores\directoryStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Volume, Chapter } from '@/novel/editor/types';
import { useDerivedContentStore } from './derivedContentStore';
import * as directoryService from '@/novel/editor/services/directoryService';

export const useDirectoryStore = defineStore('directory', () => {
    const directoryData = ref<Volume[]>([]);
    const novelId = ref<string | null>(null);

    async function fetchDirectory(id: string) {
        novelId.value = id;
        try {
            directoryData.value = await directoryService.getDirectoryData(id);
        } catch (error) {
            console.error(`Failed to fetch directory for novel ${id}:`, error);
            directoryData.value = [];
        }
    }

    async function saveDirectory() {
        if (!novelId.value) return;
        await directoryService.saveDirectoryData(novelId.value, directoryData.value);
    }

    const findNodeById = (nodeId: string): { node: Volume | Chapter; parent: Volume | null } | null => {
        for (const volume of directoryData.value) {
            if (volume.id === nodeId) return { node: volume, parent: null };
            for (const chapter of volume.chapters) {
                if (chapter.id === nodeId) return { node: chapter, parent: volume };
            }
        }
        return null;
    };

    const updateChapterContent = (nodeId: string, content: string) => {
        const result = findNodeById(nodeId);
        if (result?.node && 'content' in result.node) {
            result.node.content = content;
            if(result.node.type === 'volume') {
                const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
                if (h1Match && h1Match[1]) result.node.title = h1Match[1].replace(/<[^>]+>/g, '').trim();
            } else {
                const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
                if (h1Match && h1Match[1]) result.node.title = h1Match[1].replace(/<[^>]+>/g, '').trim();
            }
        }
    };

    const appendChapterContent = (nodeId: string, contentToAppend: string, isAutoApplied: boolean) => {
        const result = findNodeById(nodeId);
        if (result && result.node.type === 'chapter') {
            const paragraphs = contentToAppend.split('\n').map(p => `<p>${p || ' '}</p>`).join('');
            let htmlToAppend = paragraphs;
            if(isAutoApplied) {
                htmlToAppend += `<p style="font-size:0.8em; color: #9ca3af; text-align:center; margin: 1.5em 0;">--- AI生成内容已应用 ---</p>`;
            }
            if(!result.node.content) result.node.content = "";
            result.node.content += htmlToAppend;
        }
    };

    const addNewVolume = async (): Promise<Volume | null> => {
        if (!novelId.value) return null;
        try {
            const newVolume = await directoryService.createVolume(novelId.value, { title: '新卷', chapters: [] });
            directoryData.value.push(newVolume);
            return newVolume;
        } catch (error) {
            console.error('Failed to add new volume:', error);
            return null;
        }
    };

    const addChapterToVolume = async (volumeId: string): Promise<Chapter | null> => {
        const volume = directoryData.value.find(v => v.id === volumeId);
        if (volume) {
            try {
                const newChapter = await directoryService.createChapter(volume.id, { title: '新章节' });
                volume.chapters.push(newChapter);
                return newChapter;
            } catch (error) {
                console.error('Failed to add new chapter:', error);
                return null;
            }
        }
        return null;
    };

    const renameNode = (nodeId: string, newTitle: string) => {
        const trimmedTitle = newTitle.trim();
        if (!trimmedTitle) return;

        const result = findNodeById(nodeId);
        if (result?.node) {
            result.node.title = trimmedTitle;
            const derivedContentStore = useDerivedContentStore();
            derivedContentStore.updateTitlesForSource(nodeId, trimmedTitle);
        }
    };

    const deleteNode = async (nodeId: string): Promise<boolean> => {
        const derivedContentStore = useDerivedContentStore();

        const result = findNodeById(nodeId);
        if (!result) return false;

        try {
            if (result.node.type === 'volume') {
                await directoryService.deleteVolume(nodeId);
                // 使用 filter 替换整个数组以确保响应性
                directoryData.value = directoryData.value.filter(v => v.id !== nodeId);

                // 删除关联的派生内容
                const chapterIds = result.node.chapters.map(c => c.id);
                for (const chapId of chapterIds) {
                    await derivedContentStore.deleteDerivedDataForSource(chapId);
                }
                await derivedContentStore.deleteDerivedDataForSource(nodeId);

            } else if (result.node.type === 'chapter' && result.parent) {
                await directoryService.deleteChapter(nodeId);
                // 使用 filter 替换子数组以确保响应性
                result.parent.chapters = result.parent.chapters.filter(c => c.id !== nodeId);
                await derivedContentStore.deleteDerivedDataForSource(nodeId);
            }
            return true;
        } catch (error) {
            console.error(`Failed to delete node ${nodeId}:`, error);
            // 你可能需要在这里添加一些逻辑来重新获取数据以同步状态
            if(novelId.value) await fetchDirectory(novelId.value);
            return false;
        }
    };

    return {
        directoryData,
        fetchDirectory,
        saveDirectory,
        findNodeById,
        updateChapterContent,
        appendChapterContent,
        addNewVolume,
        addChapterToVolume,
        renameNode,
        deleteNode,
    };
});