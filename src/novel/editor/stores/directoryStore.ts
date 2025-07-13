import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Volume, Chapter } from '../types';

type DirectoryNode = Volume | Chapter;

export const useDirectoryStore = defineStore('novel-directory', () => {
    const directoryData = ref<Volume[]>([]);

    function findNodeById(nodeId: string): { node: DirectoryNode; parent: Volume | null } | null {
        for (const volume of directoryData.value) {
            if (volume.id === nodeId) {
                return { node: volume, parent: null };
            }
            const chapter = volume.chapters.find(c => c.id === nodeId);
            if (chapter) {
                return { node: chapter, parent: volume };
            }
        }
        return null;
    }

    function fetchDirectoryData(data: Volume[]) {
        directoryData.value = data;
    }

    function updateChapterContent(nodeId: string, content: string) {
        const result = findNodeById(nodeId);
        if (result?.node.type === 'chapter') {
            const chapter = result.node;
            chapter.content = content;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            chapter.wordCount = tempDiv.textContent?.trim().length || 0;
            const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
            const newTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';
            if (newTitle && newTitle !== chapter.title) {
                chapter.title = newTitle;
            }
        }
    }

    function appendChapterContent(nodeId: string, contentToAppend: string) {
        const result = findNodeById(nodeId);
        if (result?.node.type === 'chapter') {
            const chapter = result.node;
            const paragraphs = contentToAppend.split('\n').map(p => `<p>${p || ' '}</p>`).join('');
            chapter.content += paragraphs;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = chapter.content;
            chapter.wordCount = tempDiv.textContent?.trim().length || 0;
        }
    }

    function addNewVolume(): Volume {
        const newVolume: Volume = {
            id: `vol-${Date.now()}`,
            type: 'volume',
            title: '新建卷',
            content: `<h1>新建卷</h1>`,
            chapters: [],
        };
        directoryData.value.push(newVolume);
        return newVolume;
    }

    function addChapterToVolume(volumeId: string): Chapter | null {
        const volume = directoryData.value.find(v => v.id === volumeId);
        if (volume) {
            const newChapter: Chapter = {
                id: `ch-${Date.now()}`,
                type: 'chapter',
                title: '新建章节',
                wordCount: 0,
                content: '<h1>新建章节</h1>',
                status: 'editing'
            };
            volume.chapters.push(newChapter);
            return newChapter;
        }
        return null;
    }

    function renameNode(nodeId: string, newTitle: string) {
        const result = findNodeById(nodeId);
        if (result?.node) {
            const trimmedTitle = newTitle.trim();
            if(!trimmedTitle) return;
            result.node.title = trimmedTitle;
            if ('content' in result.node && result.node.content?.includes('<h1>')) {
                result.node.content = result.node.content.replace(/<h1[^>]*>.*?<\/h1>/, `<h1>${trimmedTitle}</h1>`);
            }
        }
    }

    function deleteNode(nodeId: string) {
        const result = findNodeById(nodeId);
        if (!result) return;
        if (!window.confirm(`您确定要删除 "${result.node.title}" 吗？此操作无法撤销。`)) return;

        if (result.parent && result.node.type === 'chapter') {
            result.parent.chapters = result.parent.chapters.filter(c => c.id !== nodeId);
        } else if (!result.parent && result.node.type === 'volume') {
            directoryData.value = directoryData.value.filter(v => v.id !== nodeId);
        }
    }

    return {
        directoryData,
        fetchDirectoryData,
        findNodeById,
        updateChapterContent,
        appendChapterContent,
        addNewVolume,
        addChapterToVolume,
        renameNode,
        deleteNode,
    };
});