import type { NoteItem } from '@/novel/editor/types';

class NoteService {

    /**
     * 创建一个新的笔记对象
     * @param title - 笔记的初始标题
     * @param content - 笔记的初始内容（纯文本）
     * @returns 一个完整的 NoteItem 对象
     */
    public createNote(title: string, content: string = ''): NoteItem {
        return {
            id: `note-${Date.now()}`,
            type: 'note',
            title: title,
            content: `<h1>${title}</h1><p>${content}</p>`,
            timestamp: new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
    }

    /**
     * 根据新的HTML内容更新笔记对象，并同步标题
     * @param note - 要更新的原始笔记对象
     * @param newContent - 新的HTML内容
     * @returns 一个被更新后的新笔记对象副本
     */
    public updateNoteWithNewContent(note: NoteItem, newContent: string): NoteItem {
        const updatedNote = { ...note, content: newContent };

        const h1Match = newContent.match(/<h1[^>]*>(.*?)<\/h1>/);
        const newTitle = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : note.title;

        if (newTitle) {
            updatedNote.title = newTitle;
        }

        return updatedNote;
    }

    /**
     * 将文本内容附加到现有笔记内容的末尾
     * @param originalContent - 原始HTML内容
     * @param contentToAppend - 要附加的纯文本内容
     * @param isAutoApplied - 是否为AI自动应用，若是则添加一个标记
     * @returns 附加了新内容的完整HTML字符串
     */
    public appendContentToNote(originalContent: string, contentToAppend: string, isAutoApplied: boolean): string {
        const paragraphs = contentToAppend.split('\n').map(p => `<p>${p || ' '}</p>`).join('');
        let htmlToAppend = paragraphs;
        if (isAutoApplied) {
            htmlToAppend += `<p style="font-size:0.8em; color: #9ca3af; text-align:center; margin: 1.5em 0;">--- AI生成内容已应用 ---</p>`;
        }
        return (originalContent || "") + htmlToAppend;
    }

    /**
     * 根据新标题更新笔记对象，并同步内容中的<h1>标签
     * @param note - 要更新的原始笔记对象
     * @param newTitle - 新的标题
     * @returns 一个被更新后的新笔记对象副本
     */
    public renameNote(note: NoteItem, newTitle: string): NoteItem {
        const updatedNote = { ...note, title: newTitle };
        if (updatedNote.content.includes('<h1>')) {
            updatedNote.content = updatedNote.content.replace(/<h1[^>]*>.*?<\/h1>/, `<h1>${newTitle}</h1>`);
        } else {
            updatedNote.content = `<h1>${newTitle}</h1>` + updatedNote.content;
        }
        return updatedNote;
    }
}

export const noteService = new NoteService();