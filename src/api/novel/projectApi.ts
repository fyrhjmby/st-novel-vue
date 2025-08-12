import apiClient from '@/api/client';
import type { NovelProject } from '@/novel/editor/types/project';
import type { Volume } from '@/novel/editor/types';

/**
 * 根据ID获取完整的小说项目数据
 * @param novelId - 小说ID
 * @returns 返回完整的小说项目对象
 */
export const getNovelProject = async (novelId: string): Promise<NovelProject> => {
    const response = await apiClient.get(`/novels/${novelId}/project`);
    return response.data;
};

/**
 * 更新一个小说项目的内容结构（目录、设定、笔记等）
 * @param novelId - 小说ID
 * @param projectData - 仅包含需要更新的内容结构数据
 * @returns 返回更新后的小说项目
 */
export const updateNovelProjectContent = async (novelId: string, projectData: Omit<NovelProject, 'metadata'>): Promise<NovelProject> => {
    const response = await apiClient.put(`/novels/${novelId}/project-content`, projectData);
    return response.data;
};

/**
 * 从解析后的数据导入一本新小说
 * @param data - 包含标题、描述和章节数据等
 * @returns 返回新创建的完整小说项目
 */
export const importNovelProject = async (data: {
    title: string;
    description: string;
    category: string;
    directoryData: Volume[];
}): Promise<NovelProject> => {
    const response = await apiClient.post('/novels/import', data);
    return response.data;
};

/**
 * 获取所有小说项目，用于参考书选择等场景
 * @returns 返回所有小说项目的数组
 */
export const fetchAllNovelProjects = async (): Promise<NovelProject[]> => {
    const response = await apiClient.get('/novels/projects');
    return response.data;
};

/**
 * 永久删除一个小说项目（非移入回收站）
 * @param novelId - 小说ID
 */
export const deleteNovelProject = async (novelId: string): Promise<void> => {
    await apiClient.delete(`/novels/${novelId}/permanent`);
};