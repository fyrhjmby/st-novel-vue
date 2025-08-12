import * as projectApi from '@/api/novel/projectApi';
import type { NovelProject } from '@/novel/editor/types/project';
import type { Volume } from '@/novel/editor/types';

/**
 * 根据ID从后端获取完整的小说项目数据
 * @param novelId - 小说ID
 * @returns 完整的小说项目对象或在出错时返回undefined
 */
export const getNovelProject = async (novelId: string): Promise<NovelProject | undefined> => {
    try {
        return await projectApi.getNovelProject(novelId);
    } catch (error) {
        console.error(`Failed to get novel project with ID ${novelId}:`, error);
        return undefined;
    }
};

/**
 * 获取所有小说项目
 * @returns 所有小说项目的数组或在出错时返回空数组
 */
export const getAllNovelProjects = async (): Promise<NovelProject[]> => {
    try {
        return await projectApi.fetchAllNovelProjects();
    } catch (error) {
        console.error('Failed to get all novel projects:', error);
        return [];
    }
};

/**
 * 调用后端API从解析后的数据导入一本新小说
 * @param title - 小说标题
 * @param description - 小说描述
 * @param category - 小说分类
 * @param directoryData - 卷和章节数据
 * @returns 新创建的完整小说项目
 */
export const importNovelProject = (
    title: string,
    description: string,
    category: string,
    directoryData: Volume[]
): Promise<NovelProject> => {
    return projectApi.importNovelProject({ title, description, category, directoryData });
};