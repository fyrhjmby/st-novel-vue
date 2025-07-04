export interface RelatedTree {
    id: string;
    title: string;
    type: string;
    icon: string;
    children?: RelatedTree[];
    content?: string;
}