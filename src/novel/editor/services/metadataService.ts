// 文件: ..\src\novel\editor\services\metadataService.ts
import * as metadataApi from '@/novel/editor/api/metadataApi';
import type { NovelMetadata } from '@/novel/editor/types/project';

/**
 * 根据小说ID获取元数据
 * @param novelId - 小说ID
 * @returns 返回小说元数据
 */
export const getNovelMetadata = (novelId: string): Promise<NovelMetadata> => {
    return metadataApi.getNovelMetadata(novelId);
};

/**
 * 更新小说元数据
 * @param novelId - 小说ID
 * @param metadata - 更新后的元数据
 * @returns 返回更新后的元数据
 */
export const updateNovelMetadata = (novelId: string, metadata: Partial<NovelMetadata>): Promise<NovelMetadata> => {
    return metadataApi.updateNovelMetadata(novelId, metadata);
};