// 文件: ..\src\novel\editor\api\novelProjectApi.ts

import apiClient from '@/api/client';
import type { NovelProject } from '@/novel/editor/types/project';
import type { Volume, TreeNode, ItemNode } from '@/novel/editor/types';

/**
 * 创建或导入小说项目时使用的负载结构。
 */
export interface NovelProjectPayload {
    title: string;
    description: string;
    category: string;
    directoryData: Volume[];
    settingsData: TreeNode[];
    plotCustomData: ItemNode[];
    analysisCustomData: ItemNode[];
    othersCustomData?: ItemNode[];
}


/**
 * 创建一本新的、结构完整的小说项目。
 * @param data - 包含小说所有初始数据的负载。
 * @returns 返回新创建的完整小说项目。
 */
export const createNovelProject = async (data: NovelProjectPayload): Promise<NovelProject> => {
    const response = await apiClient.post('/novels/create-full', data);
    return response.data;
};

/**
 * 根据ID获取一个完整的小说项目。
 * @param novelId - 小说的ID。
 * @returns 返回一个完整的小说项目。
 */
export const getNovelProject = async (novelId: string): Promise<NovelProject> => {
    const response = await apiClient.get(`/novels/projects/${novelId}`);
    return response.data;
};

/**
 * 从解析后的数据导入一本新小说。
 * @param data - 包含标题、描述和章节数据等。
 * @returns 返回新创建的完整小说项目。
 */
export const importNovelProject = async (data: NovelProjectPayload): Promise<NovelProject> => {
    const response = await apiClient.post('/novels/import', data);
    return response.data;
};

/**
 * 获取所有小说项目，用于参考书选择等场景。
 * @returns 返回所有小说项目的数组。
 */
export const fetchAllNovelProjects = async (): Promise<NovelProject[]> => {
    const response = await apiClient.get('/novels/projects');
    return response.data;
};

/**
 * 永久删除一个小说项目（非移入回收站）。
 * @param novelId - 小说ID。
 */
export const deleteNovelProject = async (novelId: string): Promise<void> => {
    await apiClient.delete(`/novels/${novelId}/permanent`);
};