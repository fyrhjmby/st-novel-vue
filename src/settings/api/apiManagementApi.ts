// src/settings/api/apiManagementApi.ts

export interface ApiProvider {
    name: string;
    shortName: string;
    description: string;
    statusText: string;
    statusClass: string;
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
}

export interface ModalProvider {
    name: string;
    shortName: string;
    description: string;
}

const mockApiProviders: ApiProvider[] = [
    { name: 'OpenAI', shortName: 'OA', description: 'GPT系列模型', statusText: '2个密钥', statusClass: 'status-active', activeKeys: 2, totalCalls: '15,677' },
    { name: 'Claude', shortName: 'CL', description: 'Anthropic AI', statusText: '1个密钥', statusClass: 'status-active', activeKeys: 1, totalCalls: '8,912' },
    { name: 'Azure OpenAI', shortName: 'AZ', description: 'Microsoft Azure', statusText: '未配置', statusClass: 'status-unconfigured', activeKeys: 0, totalCalls: '0' },
    { name: 'Google AI', shortName: 'GG', description: 'Gemini系列', statusText: '未配置', statusClass: 'status-unconfigured', activeKeys: 0, totalCalls: '0' },
    { name: 'Mistral', shortName: 'MS', description: 'Mistral AI', statusText: '未配置', statusClass: 'status-unconfigured', activeKeys: 0, totalCalls: '0' },
    { name: 'Cohere', shortName: 'CO', description: 'Command系列', statusText: '未配置', statusClass: 'status-unconfigured', activeKeys: 0, totalCalls: '0' },
];

const mockApiKeys: ApiKey[] = [
    { id: 1, provider: 'OpenAI', providerShort: 'OA', name: '生产环境密钥', keyFragment: 'sk-••••1a2b', model: 'GPT-4-Turbo', calls: '12,456', status: '启用', created: '2024-03-01' },
    { id: 2, provider: 'OpenAI', providerShort: 'OA', name: '测试环境密钥', keyFragment: 'sk-••••3c4d', model: 'GPT-3.5-Turbo', calls: '3,221', status: '暂停', created: '2024-05-15' },
    { id: 3, provider: 'Claude', providerShort: 'CL', name: '主密钥', keyFragment: 'sk-ant-••••5e6f', model: 'Claude 3 Opus', calls: '8,912', status: '启用', created: '2024-04-10' },
];

const mockModalProviders: ModalProvider[] = [
    { name: 'OpenAI', shortName: 'OA', description: 'GPT系列' },
    { name: 'Claude', shortName: 'CL', description: 'Anthropic' },
    { name: 'Azure', shortName: 'AZ', description: 'Microsoft' },
    { name: 'Google AI', shortName: 'GG', description: 'Gemini' },
    { name: 'Mistral', shortName: 'MS', description: 'Mistral AI' },
    { name: 'Cohere', shortName: 'CO', description: 'Command' },
];

export const fetchApiProviders = (): Promise<ApiProvider[]> => {
    return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(mockApiProviders))), 300));
};

export const fetchApiKeys = (): Promise<ApiKey[]> => {
    return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(mockApiKeys))), 400));
};

export const fetchModalProviders = (): Promise<ModalProvider[]> => {
    return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(mockModalProviders))), 200));
}

export const addApiKey = (newKeyData: Omit<ApiKey, 'id' | 'keyFragment' | 'calls' | 'created'> & {key: string}): Promise<ApiKey> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newId = Math.max(...mockApiKeys.map(k => k.id), 0) + 1;
            const newApiKey: ApiKey = {
                id: newId,
                provider: newKeyData.provider,
                providerShort: newKeyData.providerShort,
                name: newKeyData.name,
                keyFragment: `${newKeyData.key.substring(0, 5)}••••${newKeyData.key.substring(newKeyData.key.length - 4)}`,
                model: newKeyData.model,
                baseUrl: newKeyData.baseUrl,
                calls: '0',
                status: newKeyData.status,
                created: new Date().toISOString().split('T')[0],
            };
            mockApiKeys.push(newApiKey);
            resolve(newApiKey);
        }, 500);
    });
};

export const updateApiKey = (keyData: Partial<ApiKey> & { id: number }): Promise<ApiKey> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = mockApiKeys.findIndex(k => k.id === keyData.id);
            if (index !== -1) {
                // Merge new data into existing key
                mockApiKeys[index] = { ...mockApiKeys[index], ...keyData };
                resolve(mockApiKeys[index]);
            } else {
                reject(new Error('API Key not found'));
            }
        }, 300);
    });
};

export const deleteApiKey = (keyId: number): Promise<ApiKey> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = mockApiKeys.findIndex(k => k.id === keyId);
            if (index !== -1) {
                const deletedKey = mockApiKeys[index];
                mockApiKeys.splice(index, 1);
                resolve(deletedKey);
            } else {
                reject(new Error('API Key not found'));
            }
        }, 400);
    });
};