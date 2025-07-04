import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Volume, Chapter } from '@/novel/editor/types';
import { useEditorStore } from './editorStore'; // Will be used for UI state coordination

type DirectoryNode = Volume | Chapter;

export const useDirectoryStore = defineStore('directory', () => {
    // --- State ---
    const directoryData = ref<Volume[]>([]);

    // --- Private Helpers ---

    /**
     * 递归查找节点。
     * @param nodes - 要搜索的节点数组。
     * @param nodeId - 目标节点ID。
     * @returns 包含找到的节点、其父节点和同级节点的对​​象，如果未找到则返回null。
     */
    const _findNodeRecursive = (nodes: DirectoryNode[], nodeId: string): { node: DirectoryNode; parent: Volume | null; siblings: DirectoryNode[] } | null => {
        for (const node of nodes) {
            if (node.id === nodeId) {
                // 在顶层（卷）中找到
                return { node, parent: null, siblings: nodes };
            }
            if (node.type === 'volume' && node.chapters) {
                for (const chapter of node.chapters) {
                    if (chapter.id === nodeId) {
                        // 在章节中找到
                        return { node: chapter, parent: node, siblings: node.chapters };
                    }
                }
            }
        }
        return null;
    };


    // --- Actions ---

    /**
     * 根据ID查找目录中的节点（卷或章节）。
     * @param nodeId - 目标节点ID。
     */
    const findNodeById = (nodeId: string) => {
        return _findNodeRecursive(directoryData.value, nodeId);
    };

    /**
     * 获取并设置小说的目录数据。
     */
    const fetchDirectoryData = (data: Volume[]) => {
        directoryData.value = data;
    };

    /**
     * 更新指定ID的章节内容，并同步标题和字数。
     * @param nodeId - 目标章节ID。
     * @param content - 新的内容。
     */
    const updateChapterContent = (nodeId: string, content: string) => {
        const result = findNodeById(nodeId);
        if (result && result.node.type === 'chapter') {
            const chapter = result.node;
            chapter.content = content;
            chapter.wordCount = content.replace(/<[^>]+>/g, '').length;

            const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
            const newTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';
            if (newTitle && newTitle !== chapter.title) {
                chapter.title = newTitle;
            }
        }
    };

    /**
     * 向指定章节追加内容。
     * @param nodeId - 目标章节ID。
     * @param contentToAppend - 要追加的内容。
     * @param isAutoApplied - 是否为AI自动应用。
     */
    const appendChapterContent = (nodeId: string, contentToAppend: string, isAutoApplied: boolean) => {
        const result = findNodeById(nodeId);
        if (result && result.node.type === 'chapter') {
            const chapter = result.node;
            let htmlToAppend = `<p>${contentToAppend.replace(/\n/g, '<br>')}</p>`;
            if (isAutoApplied) {
                htmlToAppend += `<p>{ai操作已经应用}</p>`;
            }
            chapter.content += htmlToAppend;
            chapter.wordCount = chapter.content.replace(/<[^>]+>/g, '').length;
        }
    };

    /**
     * 添加一个新卷。
     */
    const addNewVolume = () => {
        const newVolume: Volume = {
            id: `vol-${Date.now()}`,
            type: 'volume',
            title: '新建卷',
            content: `<h1>新建卷</h1>`,
            chapters: [],
        };
        directoryData.value.push(newVolume);

        const editorStore = useEditorStore();
        editorStore.setEditingNodeId(newVolume.id);
        editorStore.toggleNodeExpansion(newVolume.id);
    };

    /**
     * 向指定卷添加一个新章节。
     * @param volumeId - 目标卷ID。
     */
    const addChapterToVolume = (volumeId: string) => {
        const volume = directoryData.value.find(v => v.id === volumeId);
        if (volume) {
            const newChapter: Chapter = {
                id: `ch-${Date.now()}`,
                type: 'chapter',
                title: '新建章节',
                wordCount: 0,
                content: '<h1>新建章节</h1>',
                status: 'planned'
            };
            volume.chapters.push(newChapter);

            const editorStore = useEditorStore();
            editorStore.toggleNodeExpansion(volume.id);
            editorStore.setActiveItem(newChapter.id);
            editorStore.setEditingNodeId(newChapter.id);
        }
    };

    /**
     * 重命名一个节点（卷或章节）。
     * @param nodeId - 目标节点ID。
     * @param newTitle - 新标题。
     */
    const renameNode = (nodeId: string, newTitle: string) => {
        const editorStore = useEditorStore();
        if (!newTitle.trim()) {
            editorStore.setEditingNodeId(null);
            return;
        }

        const result = findNodeById(nodeId);
        if (result?.node) {
            result.node.title = newTitle.trim();
            if (result.node.content) {
                result.node.content = result.node.content.replace(/<h1[^>]*>.*?<\/h1>/, `<h1>${newTitle.trim()}</h1>`);
            }
        }
        editorStore.setEditingNodeId(null);
    };

    /**
     * 删除一个节点（卷或章节）。
     * @param nodeId - 目标节点ID。
     */
    const deleteNode = (nodeId: string) => {
        const result = findNodeById(nodeId);
        if (!result) return;

        if (!window.confirm(`您确定要删除 "${result.node.title}" 吗？此操作无法撤销。`)) return;

        if (result.node.type === 'volume') {
            directoryData.value = directoryData.value.filter(v => v.id !== nodeId);
        } else if (result.node.type === 'chapter' && result.parent) {
            result.parent.chapters = result.parent.chapters.filter(c => c.id !== nodeId);
        }

        const editorStore = useEditorStore();
        if (editorStore.activeItemId === nodeId) editorStore.setActiveItem(null);
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