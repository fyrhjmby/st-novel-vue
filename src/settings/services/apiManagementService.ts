// src/settings/services/apiManagementService.ts

import * as api from '@/settings/api/apiManagementApi';
import type { ApiKey } from '@/settings/api/apiManagementApi';

export const loadApiManagementData = async () => {
    const [providers, keys, modalProviders] = await Promise.all([
        api.fetchApiProviders(),
        api.fetchApiKeys(),
        api.fetchModalProviders()
    ]);
    return { providers, keys, modalProviders };
};

export const addNewApiKey = async (newKeyData: Omit<ApiKey, 'id' | 'keyFragment' | 'calls' | 'created'> & {key: string}) => {
    return await api.addApiKey(newKeyData);
};

export const updateApiKey = async (keyData: Partial<ApiKey> & { id: number }) => {
    return await api.updateApiKey(keyData);
};

export const deleteApiKey = async (keyId: number) => {
    return await api.deleteApiKey(keyId);
};