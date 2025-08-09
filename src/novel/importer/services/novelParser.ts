import type { Volume, Chapter } from '@/novel/editor/types';

/**
 * 将纯文本段落转换为带<p>标签的HTML字符串
 * @param text - 输入的文本
 * @returns HTML格式的字符串
 */
const textToHtmlParagraphs = (text: string): string => {
    return text.split('\n').map(p => p.trim()).filter(p => p).map(p => `<p>${p}</p>`).join('');
};

/**
 * 解析小说文本并根据选项进行分章和分卷
 * @param text - 要解析的小说全文
 * @param options - 解析选项
 * @returns 返回一个卷数组，可直接用于创建新的小说项目
 */
export const parseNovelText = (
    text: string,
    options: { chaptersPerVolume: number }
): Volume[] => {
    // 1. 按空行（一个或多个换行符，中间可能包含空格）分割成章节内容块
    const chapterContents = text.split(/\n\s*\n/).filter(content => content.trim() !== '');

    // 2. 将内容块转换为章节对象
    const allChapters: Chapter[] = chapterContents.map((content, index) => {
        const lines = content.trim().split('\n');
        const title = lines[0]?.trim() || `第 ${index + 1} 章`;
        const bodyText = lines.slice(1).join('\n').trim();
        const bodyHtml = textToHtmlParagraphs(bodyText);

        return {
            id: `ch-imported-${Date.now()}-${index}`,
            type: 'chapter',
            title: title,
            wordCount: content.trim().length,
            content: `<h1>${title}</h1>${bodyHtml}`,
            status: 'completed'
        };
    });

    // 3. 将章节按指定数量分组到卷中
    const volumes: Volume[] = [];
    const { chaptersPerVolume } = options;
    let volumeIndex = 1;

    for (let i = 0; i < allChapters.length; i += chaptersPerVolume) {
        const chapterChunk = allChapters.slice(i, i + chaptersPerVolume);
        const volume: Volume = {
            id: `vol-imported-${Date.now()}-${volumeIndex}`,
            type: 'volume',
            title: `第 ${volumeIndex} 卷`,
            content: `<h1>第 ${volumeIndex} 卷</h1><p>该卷由导入功能自动创建，包含 ${chapterChunk.length} 个章节。</p>`,
            chapters: chapterChunk,
        };
        volumes.push(volume);
        volumeIndex++;
    }

    // 如果没有任何内容，则创建一个默认的空卷
    if (volumes.length === 0) {
        volumes.push({
            id: `vol-imported-${Date.now()}-1`,
            type: 'volume',
            title: '第一卷',
            content: '<h1>第一卷</h1><p>未从文件中解析出任何章节。</p>',
            chapters: [],
        });
    }

    return volumes;
};