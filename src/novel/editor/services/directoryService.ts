// src/novel/editor/services/directoryService.ts
import type { Volume, Chapter } from '@/novel/editor/types';

type DirectoryNode = Volume | Chapter;

function _findNodeRecursive(nodes: DirectoryNode[], nodeId: string): { node: DirectoryNode; parent: Volume | null; siblings: DirectoryNode[] } | null {
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
}

export function findNodeById(nodes: Volume[], nodeId: string) {
    return _findNodeRecursive(nodes, nodeId);
}

export function createVolume(): Volume {
    return {
        id: `vol-${Date.now()}`,
        type: 'volume',
        title: '新建卷',
        content: `<h1>新建卷</h1>`,
        chapters: [],
    };
}

export function createChapter(): Chapter {
    return {
        id: `ch-${Date.now()}`,
        type: 'chapter',
        title: '新建章节',
        wordCount: 0,
        content: '<h1>新建章节</h1>',
        status: 'editing'
    };
}

export function updateNodeContent(node: Volume | Chapter, content: string) {
    node.content = content;
    (node as any)._lastModified = Date.now(); // Update version timestamp

    if (node.type === 'chapter') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        node.wordCount = tempDiv.textContent?.trim().length || 0;
    }

    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/);
    const newTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : '';
    if (newTitle && newTitle !== node.title) {
        node.title = newTitle;
    }
}

export function appendChapterContent(chapter: Chapter, contentToAppend: string, isAutoApplied: boolean) {
    const paragraphs = contentToAppend.split('\n').map(p => `<p>${p || ' '}</p>`).join('');
    let htmlToAppend = paragraphs;
    if (isAutoApplied) {
        htmlToAppend += `<p style="font-size:0.8em; color: #9ca3af; text-align:center; margin: 1.5em 0;">--- AI生成内容已应用 ---</p>`;
    }
    chapter.content += htmlToAppend;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = chapter.content;
    chapter.wordCount = tempDiv.textContent?.trim().length || 0;
    (chapter as any)._lastModified = Date.now(); // Update version timestamp
}

export function renameNode(node: DirectoryNode, newTitle: string) {
    if (!newTitle.trim()) {
        return;
    }
    const trimmedTitle = newTitle.trim();
    node.title = trimmedTitle;
    if (node.content) {
        if (node.content.includes('<h1>')) {
            node.content = node.content.replace(/<h1[^>]*>.*?<\/h1>/, `<h1>${trimmedTitle}</h1>`);
        } else {
            node.content = `<h1>${trimmedTitle}</h1>` + node.content;
        }
    }
    (node as any)._lastModified = Date.now(); // Update version timestamp on rename
}

export function deleteNode(nodes: Volume[], nodeId: string): boolean {
    const result = findNodeById(nodes, nodeId);
    if (!result) return false;

    if (result.parent && result.node.type === 'chapter') {
        const index = result.parent.chapters.findIndex(c => c.id === nodeId);
        if (index > -1) {
            result.parent.chapters.splice(index, 1);
            return true;
        }
    } else if (!result.parent && result.node.type === 'volume') {
        const index = nodes.findIndex(v => v.id === nodeId);
        if (index > -1) {
            nodes.splice(index, 1);
            return true;
        }
    }
    return false;
}