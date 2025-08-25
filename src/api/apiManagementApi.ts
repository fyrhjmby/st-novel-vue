import apiClient from './client';
import type { ApiProvider, ApiKey, ModalProvider } from '@/types/apiManagement';

// --- API Functions ---
export const fetchApiProviders = async (): Promise<ApiProvider[]> => {
    const response = await apiClient.get('/api-providers');
    return response.data;
};

export const fetchModalProviders = async (): Promise<ModalProvider[]> => {
    // 假设有一个专门为模态框提供简化数据的端点
    const response = await apiClient.get('/api-providers/modal');
    return response.data;
};

export const fetchApiKeys = async (): Promise<ApiKey[]> => {
    const response = await apiClient.get('/api-keys');
    return response.data;
};

export const addApiKey = async (newKeyData: Omit<ApiKey, 'id' | 'keyFragment' | 'calls' | 'created' | 'providerShort'> & { apiKey: string }): Promise<ApiKey> => {
    const response = await apiClient.post('/api-keys', newKeyData);
    return response.data;
};

export const updateApiKey = async (keyData: Partial<ApiKey> & { id: number; key?: string }): Promise<ApiKey> => {
    const response = await apiClient.put(`/api-keys/${keyData.id}`, keyData);
    return response.data;
};

export const deleteApiKey = async (keyId: number): Promise<ApiKey> => {
    const response = await apiClient.delete(`/api-keys/${keyId}`);
    return response.data; // 返回被删除的密钥信息以供store更新状态
};