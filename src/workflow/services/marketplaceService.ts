import { marketplaceApi } from '@/workflow/api/marketplaceApi';
import type { MarketplaceData } from '@/workflow/types';

export const marketplaceService = {
    getMarketplaceData: async (): Promise<MarketplaceData | null> => {
        try {
            const data = await marketplaceApi.fetchMarketplaceData();
            return data;
        } catch (error) {
            console.error('Failed to get marketplace data:', error);
            return null;
        }
    },
};