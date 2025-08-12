import * as apiManagementApi from '@/api/apiManagementApi';
import type { ApiKey, ApiProvider, ModalProvider } from '@/types/apiManagement';

// Re-export types for the rest of the settings module
export type { ApiKey, ApiProvider, ModalProvider };

export const fetchApiProviders = (): Promise<ApiProvider[]> => {
    return apiManagementApi.fetchApiProviders();
};

export const fetchModalProviders = (): Promise<ModalProvider[]> => {
    return apiManagementApi.fetchModalProviders();
}

export const fetchApiKeys = (): Promise<ApiKey[]> => {
    return apiManagementApi.fetchApiKeys();
};

export const addApiKey = (newKeyData: Omit<ApiKey, 'id' | 'keyFragment' | 'calls' | 'created'> & {key: string}): Promise<ApiKey> => {
    return apiManagementApi.addApiKey(newKeyData);
};

export const updateApiKey = (keyData: Partial<ApiKey> & { id: number }): Promise<ApiKey> => {
    return apiManagementApi.updateApiKey(keyData);
};

export const deleteApiKey = (keyId: number): Promise<ApiKey> => {
    return apiManagementApi.deleteApiKey(keyId);
};