// 文件: src/novel/editor/utils/iconUtils.ts

const ICON_MAP: Record<string, string> = {
    // 目录树 (Directory)
    'volume': 'fa-regular fa-folder-open text-gray-500',
    'chapter': 'fa-regular fa-file-lines text-gray-600',

    // 相关内容 - 设定 (Related - Settings)
    'setting': 'fa-solid fa-book-journal-whills', // 设定根节点
    'group': 'fa-regular fa-folder text-gray-500',
    'character_item': 'fa-regular fa-user',
    'location_item': 'fa-regular fa-map',
    'item_item': 'fa-solid fa-cube',
    'worldview_item': 'fa-solid fa-book-atlas',
    'characters_overview': 'fa-solid fa-users',
    'locations_overview': 'fa-solid fa-map-location-dot',
    'items_overview': 'fa-solid fa-box-archive',
    'worldview_overview': 'fa-solid fa-book-atlas',


    // 相关内容 - 剧情 (Related - Plot)
    'plot': 'fa-solid fa-feather-pointed', // 剧情根节点
    'plot_volume': 'fa-solid fa-book-bible',
    'plot_chapter': 'fa-solid fa-scroll',
    'plot_item': 'fa-solid fa-lightbulb', // 自定义剧情条目

    // 相关内容 - 分析 (Related - Analysis)
    'analysis': 'fa-solid fa-magnifying-glass-chart', // 分析根节点
    'analysis_volume': 'fa-solid fa-chart-pie',
    'analysis_chapter': 'fa-solid fa-chart-simple',
    'analysis_item': 'fa-solid fa-magnifying-glass-plus', // 自定义分析条目

    // 相关内容 - 其他 (Related - Others)
    'others': 'fa-solid fa-puzzle-piece', // 其他根节点
    'others_item': 'fa-regular fa-file-zipper', // 其他条目

    // 新增：提示词模板 (Prompt Templates)
    'prompt_group': 'fa-solid fa-layer-group text-sky-600',
    'prompt_item': 'fa-regular fa-comment-dots text-sky-500',

    // 新增：AI任务类型作为分组图标
    '润色': 'fa-solid fa-palette text-blue-500',
    '续写': 'fa-solid fa-wand-magic-sparkles text-gray-600',
    '分析': 'fa-solid fa-magnifying-glass-chart text-amber-500',
    '剧情生成': 'fa-solid fa-feather text-pink-500',
    '创作': 'fa-solid fa-pen-nib text-violet-500',


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

    const normalizedType = type.replace(/s_item$/, '_item'); // characters_item -> character_item

    return ICON_MAP[normalizedType] || ICON_MAP['default'];
}