// src/novel/types/index.ts
// 定义小说模块对外共享的数据类型

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
 * 小说在仪表盘列表中的数据结构。
 * 这是 NovelProject 的一个摘要视图。
 */
export interface NovelDashboardItem {
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


/**
 * 定义“最近编辑”条目的数据结构。
 * 对应于 `RecentView.vue` 中显示的数据。
 */
export interface RecentActivityItem {
    id: string; // 活动自身的唯一ID
    novelId: string; // 关联的小说ID
    novelTitle: string; // 关联的小说标题
    novelCover: string; // 关联的小说封面

    editedItemType: 'chapter' | 'outline' | 'character'; // 被编辑的项目类型
    editedItemName: string; // 被编辑的项目名称，例如 "第四章：跃迁点" 或 "角色设定 - 艾拉"
    editedAt: string; // 编辑时间, ISO 8601 格式
    formattedTime: string; // 用于UI显示的格式化时间，如 "2小时前" 或 "下午 3:45"
}

/**
 * 定义“回收站”中条目的数据结构。
 * 对应于 `TrashView.vue` 中显示的数据。
 */
export interface DeletedItem {
    id: string; // 被删除项目的ID
    name: string; // 被删除项目的名称
    type: '小说' | '章节' | '角色'; // 被删除项目的类型
    icon: string; // 用于UI显示的图标HTML字符串
    deletedAt: string; // 删除时间, ISO 8601 格式
    retentionDays: number; // 剩余保留天数
    retentionPercent: number; // 剩余时间百分比，用于进度条显示
}