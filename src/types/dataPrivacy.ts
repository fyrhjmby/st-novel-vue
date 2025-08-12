export interface DataCollectionSetting {
    title: string;
    description: string;
    enabled: boolean;
}

export interface DataUsageItem {
    title: string;
    tag: string;
    includes: string;
    purpose: string;
}

export interface DataPermission {
    title: string;
    description: string;
    action: string;
}