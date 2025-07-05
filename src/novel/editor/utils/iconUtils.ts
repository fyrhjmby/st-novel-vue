
const ICON_MAP: Record<string, string> = {
    // 目录树 (Directory)
    'volume': 'fa-solid fa-layer-group text-purple-500',
    'chapter': 'fa-solid fa-file-lines text-blue-600',

    // 相关内容 - 设定 (Related - Settings)
    'settings': 'fa-solid fa-book-journal-whills', // 设定根节点
    'group': 'fa-solid fa-folder text-yellow-600',
    'character_item': 'fa-regular fa-user',
    'worldview_item': 'fa-solid fa-book-atlas',
    'location_item': 'fa-regular fa-map',
    'item_item': 'fa-solid fa-box-archive',

    // 相关内容 - 剧情 (Related - Plot)
    'plot': 'fa-solid fa-feather-pointed', // 剧情根节点
    'plot_volume': 'fa-solid fa-book-bible text-rose-500',
    'plot_chapter': 'fa-solid fa-scroll text-rose-500',
    'plot_item': 'fa-solid fa-lightbulb text-rose-500', // 自定义剧情条目

    // 相关内容 - 分析 (Related - Analysis)
    'analysis': 'fa-solid fa-magnifying-glass-chart', // 分析根节点
    'analysis_volume': 'fa-solid fa-chart-pie text-orange-500',
    'analysis_chapter': 'fa-solid fa-chart-simple text-orange-500',
    'analysis_item': 'fa-solid fa-magnifying-glass-plus text-orange-500', // 自定义分析条目

    // 笔记 (Notes)
    'note': 'fa-solid fa-note-sticky text-yellow-500',

    // 通用根节点和默认
    'root': 'fa-solid fa-sitemap text-gray-500',
    'default': 'fa-solid fa-question text-gray-400'
};

/**
 * 根据节点类型获取对应的 Font Awesome 图标类名
 * @param type - 节点的类型字符串, e.g., "characters_item"
 * @returns 完整的图标类名字符串
 */
export function getIconByNodeType(type: string): string {
    // 检查是否有直接匹配
    if (ICON_MAP[type]) {
        return ICON_MAP[type];
    }

    // [重构] 增加对动态生成的类型（如 'characters_item'）的匹配
    // 将复数形式的父级ID转换为单数形式以匹配ICON_MAP
    // 例如：'characters_item' -> 'character_item'
    const normalizedType = type.replace(/s_item$/, '_item'); // characters_item -> character_item

    return ICON_MAP[normalizedType] || ICON_MAP['default'];
}