export interface CoreItem {
    id: string;
    title: string;
    icon: string;
    viewType: string;
    metadata: Record<string, any>;
}

export interface Tab {
    id: string;
    itemId: string;
    title: string;
    icon: string;
    isDirty: boolean;
}