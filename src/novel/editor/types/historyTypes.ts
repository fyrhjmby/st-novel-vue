// 文件: ..\src\novel\editor\types\historyTypes.ts

/**
 * 代表一个文档的历史版本快照。
 */
export interface HistoryVersion {
    id: string;          // 版本的唯一ID
    label: string;       // 版本的显示名称 (例如 "AI 润色", "手动保存")
    timestamp: string;   // 版本创建的时间戳 (例如 "1小时前", "2023-10-27 15:30")
    content: string;     // 该版本的完整HTML内容 (用于恢复)
}

/**
 * 代表两个版本之间的差异。
 */
export interface VersionDiff {
    fromVersionId: string; // 对比的起始版本ID ('current' 代表当前版本)
    toVersionId: string;   // 对比的目标版本ID
    diffHtml: string;      // 包含 <ins> 和 <del> 标签的HTML字符串
}