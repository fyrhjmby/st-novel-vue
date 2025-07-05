

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