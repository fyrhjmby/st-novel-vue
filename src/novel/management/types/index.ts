

/**
 * Represents a character in the novel.
 */
export interface NovelCharacter {
    id: string;
    name: string;
    avatar: string;
    identity: string;
    gender?: string;
    age?: number;
    faction?: string;
    summary: string; // The main description, visible to AI
    notes?: string; // Private notes for the author
    status?: 'editing' | 'completed' | 'draft';
}

/**
 * Represents a category within the worldview, e.g., "地点", "技术".
 */
export interface WorldviewCategory {
    id: string;
    name: string;
    icon: string; // Font Awesome icon class, e.g., "fa-solid fa-location-dot"
    items: WorldviewItem[];
}


/**
 * Represents a specific item within a worldview category.
 */
export interface WorldviewItem {
    id: string;
    title: string;
    description: string;
    lastUpdated: string; // e.g., "2天前"
}

/**
 * Represents a single tag for a novel.
 */
export interface NovelTag {
    text: string;
    class: string;
}

/**
 * Represents the core metadata for a novel being managed.
 */
export interface NovelMetadata {
    id: string;
    title: string;
    description: string;
    cover: string;
    tags: NovelTag[];
    status: '连载中' | '已完结' | '暂停更新';
}