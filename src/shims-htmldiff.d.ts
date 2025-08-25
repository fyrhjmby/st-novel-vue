// 文件: ..\src\shims-htmldiff.d.ts

declare module 'htmldiff-js' {
    // 声明该模块默认导出一个名为 HtmlDiff 的类
    export default class HtmlDiff {
        /**
         * 创建一个新的 HtmlDiff 实例。
         * @param options 可选的配置对象。
         */
        constructor(options?: any);

        /**
         * 对比两个 HTML 字符串并返回差异。
         * @param oldText 旧的 HTML 字符串。
         * @param newText 新的 HTML 字符串。
         * @returns 一个包含差异标记的 HTML 字符串。
         */
        build(oldText: string, newText: string): string;
    }
}