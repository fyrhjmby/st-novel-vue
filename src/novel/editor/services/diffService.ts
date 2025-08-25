// 文件: ..\src\novel\editor\services\diffService.ts

import HtmlDiff from 'htmldiff-js';

/**
 * 计算两个HTML字符串之间的差异。
 * @param oldHtml - 旧版本的HTML内容。
 * @param newHtml - 新版本的HTML内容。
 * @returns 一个包含 <ins> 和 <del> 标签来高亮差异的HTML字符串。
 */
export const calculateHtmlDiff = (oldHtml: string, newHtml: string): string => {
    const differ = new HtmlDiff();

    // 调用 build 方法计算差异
    const diffResult = differ.build(oldHtml, newHtml);

    return diffResult;
};