import { defineStore } from 'pinia';
import * as service from '@/settings/services/apiManagementService';
import type { ApiProvider, ApiKey, ModalProvider } from '@/types/apiManagement';

interface ApiManagementState {
    apiProviders: ApiProvider[];
    apiKeys: ApiKey[];
    modalProviders: ModalProvider[];
    isLoading: boolean;
    isSaving: boolean;
}

export const useApiManagementStore = defineStore('api-management', {
    state: (): ApiManagementState => ({
        apiProviders: [],
        apiKeys: [],
        modalProviders: [],
        isLoading: false,
        isSaving: false,
    }),

    actions: {
        async initializeData() {
            if (this.apiProviders.length > 0) return;
            this.isLoading = true;
            try {
                const data = await service.loadApiManagementData();
                this.apiProviders = data.providers;
                this.apiKeys = data.keys;
                this.modalProviders = data.modalProviders;
            } catch (error) {
                console.error("Failed to initialize API management data:", error);
            } finally {
                this.isLoading = false;
            }
        },

        async addKey(newKeyData: Omit<ApiKey, 'id' | 'keyFragment' | 'calls' | 'created'> & {key: string}) {
            this.isSaving = true;
            try {
                const addedKey = await service.addNewApiKey(newKeyData);
                this.apiKeys.push(addedKey);

                const provider = this.apiProviders.find(p => p.name === addedKey.provider);
                if(provider) {
                    provider.activeKeys += 1;
                    provider.statusText = `${provider.activeKeys}个密钥`;
                }
            } catch (error) {
                console.error("Failed to add new API key:", error);
                // Optionally re-throw or handle the error in the UI
                throw error;
            } finally {
                this.isSaving = false;
            }
        },

        async updateKey(keyData: Partial<ApiKey> & { id: number, key?: string }) {
            this.isSaving = true;
            try {
                const updatedKey = await service.updateApiKey(keyData);
                const index = this.apiKeys.findIndex(k => k.id === updatedKey.id);
                if (index !== -1) {
                    // Replace the old key with the updated one from the server
                    this.apiKeys[index] = { ...this.apiKeys[index], ...updatedKey };
                }
            } catch (error) {
                console.error("Failed to update API key:", error);
                throw error;
            } finally {
                this.isSaving = false;
            }
        },

        async deleteKey(keyId: number) {
            this.isSaving = true;
            try {
                const deletedKey = await service.deleteApiKey(keyId);
                this.apiKeys = this.apiKeys.filter(k => k.id !== keyId);

                const provider = this.apiProviders.find(p => p.name === deletedKey.provider);
                if (provider) {
                    provider.activeKeys -= 1;
                    if (provider.activeKeys > 0) {
                        provider.statusText = `${provider.activeKeys}个密钥`;
                    } else {
                        provider.statusText = '未配置';
                    }
                }
            } catch (error) {
                console.error("Failed to delete API key:", error);
                throw error;
            } finally {
                this.isSaving = false;
            }
        },
    },
});