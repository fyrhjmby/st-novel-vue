import * as projectApi from '@/api/novel/projectApi';
import type { NovelProject } from '@/novel/editor/types/project';

/**
 * [Proxy] 根据ID获取完整的小说项目数据
 */
export const getNovelProject = (novelId: string): Promise<NovelProject> => {
    return projectApi.getNovelProject(novelId);
};

/**
 * [Proxy] 获取所有小说项目，用于参考书选择等场景
 */
export const fetchAllNovelProjects = (): Promise<NovelProject[]> => {
    return projectApi.fetchAllNovelProjects();
};

/**
 * [Proxy] 更新一个小说项目的内容结构
 */
export const updateNovelProjectContent = (novelId: string, projectData: Omit<NovelProject, 'metadata'>): Promise<NovelProject> => {
    return projectApi.updateNovelProjectContent(novelId, projectData);
};