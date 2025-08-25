import apiClient from '@/api/client';
import type { AIProviderConfig } from '@novel/editor/types';

/**
 * Fetches the list of available AI providers from the backend.
 * These are the configurations that can be used for AI tasks.
 * @returns A promise that resolves to an array of AI provider configurations.
 */
export const fetchAIProviders = async (): Promise<AIProviderConfig[]> => {
    const response = await apiClient.get('/ai/providers');
    return response.data;
};