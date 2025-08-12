import { fetchApiKeys as globalFetchApiKeys } from '@/api/apiManagementApi';
import type { ApiKey } from '@/types/apiManagement';

export const fetchApiKeys = (): Promise<ApiKey[]> => {
    return globalFetchApiKeys();
};