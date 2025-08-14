import { defineStore } from 'pinia';
import { ref } from 'vue';
import { marketplaceService } from '@/workflow/services/marketplaceService';
import type { MarketplaceTag, WorkflowTemplate } from '@/workflow/types';

export const useMarketplaceStore = defineStore('marketplace', () => {
    const popularTags = ref<MarketplaceTag[]>([]);
    const workflowTemplates = ref<WorkflowTemplate[]>([]);
    const isLoading = ref(false);

    const loadMarketplaceData = async () => {
        isLoading.value = true;
        try {
            const data = await marketplaceService.getMarketplaceData();
            if (data) {
                popularTags.value = data.popularTags;
                workflowTemplates.value = data.workflowTemplates;
            }
        } catch (error) {
            console.error('Error loading marketplace data in store:', error);
        } finally {
            isLoading.value = false;
        }
    };

    return {
        popularTags,
        workflowTemplates,
        isLoading,
        loadMarketplaceData,
    };
});