const ICON_MAP: Record<string, string> = {
    'volume': 'fa-solid fa-layer-group text-purple-500',
    'chapter': 'fa-solid fa-file-lines text-blue-600',
    'settings': 'fa-solid fa-book-journal-whills',
    'group': 'fa-solid fa-folder text-yellow-600',
    'character_item': 'fa-regular fa-user',
    'worldview_item': 'fa-solid fa-book-atlas',
    'location_item': 'fa-regular fa-map',
    'item_item': 'fa-solid fa-box-archive',
    'plot': 'fa-solid fa-feather-pointed',
    'plot_volume': 'fa-solid fa-book-bible text-rose-500',
    'plot_chapter': 'fa-solid fa-scroll text-rose-500',
    'plot_item': 'fa-solid fa-lightbulb text-rose-500',
    'analysis': 'fa-solid fa-magnifying-glass-chart',
    'analysis_volume': 'fa-solid fa-chart-pie text-orange-500',
    'analysis_chapter': 'fa-solid fa-chart-simple text-orange-500',
    'analysis_item': 'fa-solid fa-magnifying-glass-plus text-orange-500',
    'note': 'fa-solid fa-note-sticky text-yellow-500',
    'root': 'fa-solid fa-sitemap text-gray-500',
    'default': 'fa-solid fa-question text-gray-400'
};

export function getIconByNodeType(type: string): string {
    if (ICON_MAP[type]) {
        return ICON_MAP[type];
    }
    const normalizedType = type.replace(/s_item$/, '_item');
    return ICON_MAP[normalizedType] || ICON_MAP['default'];
}