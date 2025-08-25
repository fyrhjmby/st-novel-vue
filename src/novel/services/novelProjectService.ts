// 文件: ..\src\novel\services\novelProjectService.ts

import * as novelProjectApi from '@/novel/editor/api/novelProjectApi';
import type { NovelProject } from '@/novel/editor/types/project';
import type { NovelProjectPayload } from '@/novel/editor/api/novelProjectApi';

/**
 * 创建一本新的、结构完整的小说项目。
 * @param data - 包含小说所有初始数据的负载。
 * @returns 返回新创建的完整小说项目。
 */
export const createNovelProject = (data: NovelProjectPayload): Promise<NovelProject> => {
    return novelProjectApi.createNovelProject(data);
};

/**
 * 根据ID从后端获取完整的小说项目数据
 * @param novelId - 小说ID
 * @returns 完整的小说项目对象
 */
export const getNovelProject = (novelId: string): Promise<NovelProject> => {
    return novelProjectApi.getNovelProject(novelId);
};

/**
 * 从解析后的数据导入一本新小说。
 * @param data - 包含标题、描述、分类和章节数据等。
 * @returns 返回新创建的完整小说项目。
 */
export const importNovelProject = (data: NovelProjectPayload): Promise<NovelProject> => {
    return novelProjectApi.importNovelProject(data);
};

/**
 * 获取所有小说项目，用于参考书选择等场景。
 * @returns 返回所有小说项目的数组。
 */
export const fetchAllNovelProjects = (): Promise<NovelProject[]> => {
    return novelProjectApi.fetchAllNovelProjects();
};

/**
 * 永久删除一个小说项目（非移入回收站）。
 * @param novelId - 小说ID。
 */
export const deleteNovelProject = (novelId: string): Promise<void> => {
    return novelProjectApi.deleteNovelProject(novelId);
};