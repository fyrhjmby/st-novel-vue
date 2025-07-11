import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Volume, Chapter } from '@/novel/editor/types';
import { useEditorStore } from './editorStore';
import { useUIStore } from './uiStore';

type DirectoryNode = Volume | Chapter;

export const useDirectoryStore = defineStore('directory', () => {
    const directoryData = ref<Volume[]>([]);
    const _findNodeRecursive = (nodes: DirectoryNode[], nodeId: string): { node: DirectoryNode; parent: Volume | null; siblings: DirectoryNode[] } | null => {
        for (const node of nodes) {
            if (node.id === nodeId) {
                return { node, parent: null, siblings: nodes };
            }
            if (node.type === 'volume' && node.chapters) {
                const chapterResult = node.chapters.find(c => c.id === nodeId);
                if (chapterResult) {
                    return { node: chapterResult, parent: node, siblings: node.chapters };
                }
            }
        }
        return null;
    };


    // --- Actions ---

    /**
     *  从 editorStore 接收目录数据。
     */
    const fetchDirectoryData = (data: Volume[]) => {
        directoryData.value = data;
    };

    const findNodeById = (nodeId: string) => {
        return _findNodeRecursive(directoryData.value, nodeId);
    };

    const updateChapterContent = (nodeId: string, content: string) => {
        const result = findNodeById(nodeId);
        if (result && result.node.type === 'chapter') {
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
    };

    const appendChapterContent = (nodeId: string, contentToAppend: string, isAutoApplied: boolean) => {
        const result = findNodeById(nodeId);
        if (result && result.node.type === 'chapter') {
            const chapter = result.node;
            const paragraphs = contentToAppend.split('\n').map(p => `<p>${p || ' '}</p>`).join('');
            let htmlToAppend = paragraphs;
            if (isAutoApplied) {
                htmlToAppend += `<p class="ai-applied-marker">--- AI生成内容已应用 ---</p>`;
            }
            chapter.content += htmlToAppend;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = chapter.content;
            chapter.wordCount = tempDiv.textContent?.trim().length || 0;
        }
    };

    const addNewVolume = () => {
        const uiStore = useUIStore();
        const newVolume: Volume = {
            id: `vol-${Date.now()}`,
            type: 'volume',
            title: '新建卷',
            content: `<h1>新建卷</h1>`,
            chapters: [],
        };
        directoryData.value.push(newVolume);
        uiStore.setEditingNodeId(newVolume.id);
        uiStore.toggleNodeExpansion(newVolume.id);
    };

    const addChapterToVolume = (volumeId: string) => {
        const volume = directoryData.value.find(v => v.id === volumeId);
        if (volume) {
            const editorStore = useEditorStore();
            const uiStore = useUIStore();
            const newChapter: Chapter = {
                id: `ch-${Date.now()}`,
                type: 'chapter',
                title: '新建章节',
                wordCount: 0,
                content: '<h1>新建章节</h1>',
                status: 'editing'
            };
            volume.chapters.push(newChapter);
            uiStore.toggleNodeExpansion(volume.id);
            editorStore.openTab(newChapter.id);
            uiStore.setEditingNodeId(newChapter.id);
        }
    };

    const renameNode = (nodeId: string, newTitle: string) => {
        const uiStore = useUIStore();
        if (!newTitle.trim()) {
            uiStore.setEditingNodeId(null);
            return;
        }
        const result = findNodeById(nodeId);
        if (result?.node) {
            const trimmedTitle = newTitle.trim();
            result.node.title = trimmedTitle;
            if ('content' in result.node && result.node.content) {
                if (result.node.content.includes('<h1>')) {
                    result.node.content = result.node.content.replace(/<h1[^>]*>.*?<\/h1>/, `<h1>${trimmedTitle}</h1>`);
                } else {
                    result.node.content = `<h1>${trimmedTitle}</h1>` + result.node.content;
                }
            }
        }
        uiStore.setEditingNodeId(null);
    };

    const deleteNode = (nodeId: string) => {
        const result = findNodeById(nodeId);
        if (!result) return;
        if (!window.confirm(`您确定要删除 "${result.node.title}" 吗？此操作无法撤销。`)) return;
        const editorStore = useEditorStore();
        const uiStore = useUIStore();
        if (result.parent && result.node.type === 'chapter') {
            result.parent.chapters = result.parent.chapters.filter(c => c.id !== nodeId);
        } else if (!result.parent && result.node.type === 'volume') {
            directoryData.value = directoryData.value.filter(v => v.id !== nodeId);
        }
        editorStore.closeTab(nodeId);
        if (uiStore.editingNodeId === nodeId) uiStore.setEditingNodeId(null);
    };

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