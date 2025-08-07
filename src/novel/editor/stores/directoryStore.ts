// src/novel/editor/stores/directoryStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Volume, Chapter } from '@/novel/editor/types';
import { useEditorStore } from './editorStore';
import { useUIStore } from './uiStore';
import { useDerivedContentStore } from './derivedContentStore';

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

    const fetchDirectoryData = (data: Volume[]) => {
        directoryData.value = data;
    };

    const findNodeById = (nodeId: string) => {
        return _findNodeRecursive(directoryData.value, nodeId);
    };

    const updateChapterContent = (nodeId: string, content: string) => {
        const result = findNodeById(nodeId);
        if (result && (result.node.type === 'chapter' || result.node.type === 'volume')) {
            const item = result.node;
            item.content = content;

            if (item.type === 'chapter') {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                item.wordCount = tempDiv.textContent?.trim().length || 0;
            }

            const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
            const newTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';
            if (newTitle && newTitle !== item.title) {
                item.title = newTitle;
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
                htmlToAppend += `<p style="font-size:0.8em; color: #9ca3af; text-align:center; margin: 1.5em 0;">--- AI生成内容已应用 ---</p>`;
            }
            chapter.content += htmlToAppend;
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = chapter.content;
            chapter.wordCount = tempDiv.textContent?.trim().length || 0;
        }
    };

    const addNewVolume = () => {
        const uiStore = useUIStore();
        const editorStore = useEditorStore();
        const newVolume: Volume = {
            id: `vol-${Date.now()}`,
            type: 'volume',
            title: '新建卷',
            content: `<h1>新建卷</h1>`,
            chapters: [],
        };
        directoryData.value.push(newVolume);
        editorStore.setEditingNodeId(newVolume.id);
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
            editorStore.setEditingNodeId(newChapter.id);
        }
    };

    const renameNode = (nodeId: string, newTitle: string) => {
        const editorStore = useEditorStore();
        if (!newTitle.trim()) {
            editorStore.setEditingNodeId(null);
            return;
        }
        const result = findNodeById(nodeId);
        if (result?.node) {
            const trimmedTitle = newTitle.trim();
            result.node.title = trimmedTitle;
            // 同时更新卷和章节的content
            if (result.node.content) {
                if (result.node.content.includes('<h1>')) {
                    result.node.content = result.node.content.replace(/<h1[^>]*>.*?<\/h1>/, `<h1>${trimmedTitle}</h1>`);
                } else {
                    result.node.content = `<h1>${trimmedTitle}</h1>` + result.node.content;
                }
            }
        }
        editorStore.setEditingNodeId(null);
    };

    const deleteNode = (nodeId: string) => {
        const result = findNodeById(nodeId);
        if (!result) return;

        const editorStore = useEditorStore();
        const derivedContentStore = useDerivedContentStore();

        if (result.node.type === 'chapter') {
            derivedContentStore.deleteDerivedDataForChapter(result.node.id);
        }

        if (result.parent && result.node.type === 'chapter') {
            result.parent.chapters = result.parent.chapters.filter(c => c.id !== nodeId);
        } else if (!result.parent && result.node.type === 'volume') {
            result.node.chapters.forEach(chapter => {
                derivedContentStore.deleteDerivedDataForChapter(chapter.id);
            });
            directoryData.value = directoryData.value.filter(v => v.id !== nodeId);
        }
        editorStore.closeTab(nodeId);
        if (editorStore.editingNodeId === nodeId) editorStore.setEditingNodeId(null);
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