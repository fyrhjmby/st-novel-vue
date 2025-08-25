import * as derivedContentApi from '@/novel/editor/api/derivedContentApi';
import type { PlotAnalysisItem } from '@/novel/editor/types';

/**
 * 获取指定小说的所有派生内容（剧情和分析）。
 * @param novelId - 小说的ID。
 * @returns 返回一个包含所有派生内容条目的数组。
 */
export const getDerivedItemsForNovel = (novelId: string): Promise<PlotAnalysisItem[]> => {
    return derivedContentApi.getDerivedItemsForNovel(novelId);
};

/**
 * 创建一个新的派生内容条目。
 * @param itemData - 创建条目所需的数据。
 * @returns 返回新创建的派生内容条目。
 */
export const createDerivedItem = (itemData: Omit<PlotAnalysisItem, 'id'>): Promise<PlotAnalysisItem> => {
    return derivedContentApi.createDerivedItem(itemData);
};

/**
 * 更新一个派生内容条目。
 * @param itemId - 要更新的条目的ID。
 * @param itemData - 包含更新字段的对象。
 * @returns 返回更新后的派生内容条目。
 */
export const updateDerivedItem = (itemId: string, itemData: Partial<Omit<PlotAnalysisItem, 'id'>>): Promise<PlotAnalysisItem> => {
    return derivedContentApi.updateDerivedItem(itemId, itemData);
};

/**
 * 删除一个派生内容条目。
 * @param itemId - 要删除的条目的ID。
 */
export const deleteDerivedItem = (itemId: string): Promise<void> => {
    return derivedContentApi.deleteDerivedItem(itemId);
};