const ICON_MAP: Record<string, string> = {
    // 目录树 (Directory)
    'volume': 'fa-solid fa-layer-group text-purple-500',
    'chapter': 'fa-solid fa-file-lines text-blue-600',

    // 相关内容 - 设定 (Related - Settings)
    'settings_root': 'fa-solid fa-book-journal-whills',
    'group': 'fa-solid fa-folder text-yellow-600',
    'character_item': 'fa-regular fa-user', // 角色条目 - 无色
    'worldview_item': 'fa-regular fa-file-lines', // 世界观条目 - 无色
    'location_item': 'fa-regular fa-map', // 地点条目 - 无色
    'item_item': 'fa-regular fa-file-lines', // 物品条目 - 无色
    'generic_item': 'fa-regular fa-file-lines', // 通用条目 - 无色

    // 相关内容 - 剧情 (Related - Plot)
    'plot_root': 'fa-solid fa-feather-pointed text-rose-500',
    'plot_volume': 'fa-solid fa-book-bible text-rose-500',
    'plot_chapter': 'fa-solid fa-scroll text-rose-500',
    'plot_item': 'fa-solid fa-lightbulb text-rose-500',

    // 相关内容 - 分析 (Related - Analysis)
    'analysis_root': 'fa-solid fa-magnifying-glass-chart text-orange-500',
    'analysis_volume': 'fa-solid fa-chart-pie text-orange-500',
    'analysis_chapter': 'fa-solid fa-chart-simple text-orange-500',
    'analysis_item': 'fa-solid fa-magnifying-glass-plus text-orange-500',

    // 笔记 (Notes)
    'note': 'fa-solid fa-note-sticky text-yellow-500',

    // 通用根节点 (Fallback)
    'root': 'fa-solid fa-sitemap text-gray-500',
    'default': 'fa-solid fa-question text-gray-400'
};

/**
 * 根据节点类型获取对应的 Font Awesome 图标类名
 * @param type - 节点的类型字符串
 * @returns 完整的图标类名字符串
 */
export function getIconByNodeType(type: string): string {
    // 将复数形式的父级ID转换为单数形式以匹配ICON_MAP
    // 例如：'characters_item' -> 'character_item'
    const normalizedType = type
        .replace('characters', 'character')
        .replace('locations', 'location')
        .replace('items', 'item');

    return ICON_MAP[normalizedType] || ICON_MAP['default'];
}