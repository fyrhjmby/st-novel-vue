export interface Theme {
    name: string;
}

export interface SettingItem {
    title: string;
    description: string;
    enabled: boolean;
}

export interface SystemSettings {
    activeTheme: string;
    zoomLevel: number;
    language: string;
    dateFormat: string;
    notificationSettings: SettingItem[];
    appSettings: SettingItem[];
}