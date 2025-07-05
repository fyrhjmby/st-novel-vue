
/**
 * AI模型定义
 */
export interface AIModel {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'limited';
}

/**
 * 聊天消息定义
 */
export interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
}

/**
 * 单个聊天会话定义
 */
export interface Conversation {
    id: string;
    title: string;
    summary: string;
    createdAt: string;
    messages: ChatMessage[];
}


/**
 * 小说标签定义
 */
export interface NovelTag {
    text: string;
    class: string;
}

/**
 * 小说状态定义
 */
export interface NovelStatus {
    text: '编辑中' | '待审核' | '已驳回' | '已发布';
    class: string;
}

/**
 * 小说分类的类型别名
 */
export type NovelCategory = '科幻' | '奇幻' | '悬疑' | '恐怖' | '都市' | '言情' | '历史';


/**
 * 小说核心数据结构
 */
export interface Novel {
    id: string;
    title: string;
    description: string;
    cover: string;
    status: NovelStatus;
    tags: NovelTag[];
    chapters: number;
    lastUpdated: string;
    category: NovelCategory;
    deletedAt?: string;
}