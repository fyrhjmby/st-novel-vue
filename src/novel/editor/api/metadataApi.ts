import {
    getNovelMetadata as globalGetNovelMetadata,
    updateNovelMetadata as globalUpdateNovelMetadata,
} from '@/api/novel/metadataApi';
import type { NovelMetadata } from '@/novel/editor/types/project';

/**
 * [Proxy] 根据小说ID获取元数据
 */
export const getNovelMetadata = (novelId: string): Promise<NovelMetadata> => {
    return globalGetNovelMetadata(novelId);
};

/**
 * [Proxy] 更新小说元数据
 */
export const updateNovelMetadata = (novelId: string, metadata: Partial<NovelMetadata>): Promise<NovelMetadata> => {
    return globalUpdateNovelMetadata(novelId, metadata);
};