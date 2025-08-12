import { fetchAllNovelProjects, getNovelProject } from '../api/projectApi';
import type { NovelProject } from '@/novel/editor/types/project';
import type { NovelMetadata } from '@/novel/editor/types';

class NovelSettingsService {

    /**
     * 根据ID数组异步获取完整的小说项目对象列表。
     * @param novelIds - 要获取的小说ID数组。
     * @returns 完整的小说项目对象数组。
     */
    public async getReferencedNovels(novelIds: string[]): Promise<NovelProject[]> {
        if (!novelIds || novelIds.length === 0) return [];

        const projects = await Promise.all(
            novelIds.map(id => getNovelProject(id))
        );

        return projects.filter((p): p is NovelProject => p !== undefined);
    }

    /**
     * 异步获取可供添加为参考书的所有其他小说项目。
     * @param novelMetadata - 当前正在编辑的小说的元数据。
     * @returns 可用的参考小说项目数组。
     */
    public async getAvailableReferenceNovels(novelMetadata: NovelMetadata | null): Promise<NovelProject[]> {
        const allNovels = await fetchAllNovelProjects();
        if (!novelMetadata) return allNovels;

        const currentAndReferencedIds = new Set([
            ...novelMetadata.referenceNovelIds,
            novelMetadata.id
        ]);

        return allNovels.filter(novel => !currentAndReferencedIds.has(novel.metadata.id));
    }
}

export const novelSettingsService = new NovelSettingsService();