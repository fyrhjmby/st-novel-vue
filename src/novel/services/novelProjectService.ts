import * as novelProjectApi from '@/novel/editor/api/novelProjectApi';
import type { NovelProject } from '@/novel/editor/types/project';
import type { Volume } from '@/novel/editor/types';

/**
 * 根据ID从后端获取完整的小说项目数据
 * @param novelId - 小说ID
 * @returns 完整的小说项目对象
 */
export const getNovelProject = (novelId: string): Promise<NovelProject> => {
    return novelProjectApi.getNovelProject(novelId);
};

/**
 * 封装导入新小说项目所需的数据
 */
type ImportData = {
    title: string;
    description: string;
    category: string;
    directoryData: Volume[];
};

/**
 * 从解析后的数据导入一本新小说。
 * @param data - 包含标题、描述、分类和章节数据等。
 * @returns 返回新创建的完整小说项目。
 */
export const importNovelProject = (data: ImportData): Promise<NovelProject> => {
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