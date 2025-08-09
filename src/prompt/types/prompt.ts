export interface Feature {
    title: string;
    description: string;
    icon: string;
    bgClass: string;
    iconBgClass: string;
}

export interface Example {
    tag: string;
    original: string;
    optimized: string;
    borderColorClass: string;
    tagBgClass: string;
}

export interface Prompt {
    id: string;
    title:string;
    description: string;
    icon: string;
    iconBgClass: string;
    tag: string;
    tagClass: string;
    likes: number;
    views: number;
    usage?: number;
    author: string;
    authorAvatarClass: string;
    status?: '公开' | '私有';
    updated?: string;
    isHot?: boolean;
    isFavorite?: boolean;
    features?: Feature[];
    examples?: Example[];
}