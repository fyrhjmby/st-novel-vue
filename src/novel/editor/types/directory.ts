export interface Chapter {
    id: string;
    type: 'chapter';
    title: string;
    wordCount: number;
    content: string;
    status: 'completed' | 'editing' | 'planned';
}

export interface Volume {
    id: string;
    type: 'volume';
    title:string;
    content: string;
    chapters: Chapter[];
}