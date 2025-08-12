export interface ApiProvider {
    name: string;
    shortName: string;
    description: string;
    statusText: string;
    activeKeys: number;
    totalCalls: string;
}

export interface ApiKey {
    id: number;
    provider: string;
    providerShort: string;
    name: string;
    keyFragment: string;
    model: string;
    calls: string;
    status: '启用' | '暂停';
    created: string;
    baseUrl?: string;
    temperature: number;
    maxTokens: number;
    description: string;
}

export interface ModalProvider {
    name: string;
    shortName: string;
    description: string;
}