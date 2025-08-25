// 文件: ..\src\novel\editor\services\relatedContentService.ts
import * as settingsApi from '@/novel/editor/api/settingsApi';
import * as customPlotApi from '@/novel/editor/api/customPlotApi';
import * as customAnalysisApi from '@/novel/editor/api/customAnalysisApi';
import * as customOthersApi from '@/novel/editor/api/customOthersApi';
import type { TreeNode, ItemNode } from '@/novel/editor/types';

export interface RelatedContentData {
    settingsData: TreeNode[];
    plotCustomData: ItemNode[];
    analysisCustomData: ItemNode[];
    othersCustomData: ItemNode[];
}

class RelatedContentService {
    public async getRelatedContent(novelId: string): Promise<RelatedContentData> {
        const [
            settingsData,
            plotCustomData,
            analysisCustomData,
            othersCustomData
        ] = await Promise.all([
            settingsApi.getSettingsData(novelId),
            customPlotApi.getPlotCustomData(novelId),
            customAnalysisApi.getAnalysisCustomData(novelId),
            customOthersApi.getOthersCustomData(novelId),
        ]);

        return {
            settingsData,
            plotCustomData,
            analysisCustomData,
            othersCustomData
        };
    }

    public async saveRelatedContent(novelId: string, data: RelatedContentData): Promise<void> {
        await Promise.all([
            settingsApi.updateSettingsData(novelId, data.settingsData),
            customPlotApi.updatePlotCustomData(novelId, data.plotCustomData),
            customAnalysisApi.updateAnalysisCustomData(novelId, data.analysisCustomData),
            customOthersApi.updateOthersCustomData(novelId, data.othersCustomData),
        ]);
    }
}

export const relatedContentService = new RelatedContentService();