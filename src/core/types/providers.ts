

import type { CoreItem } from './index';

/**
 * 数据提供者接口 (ItemProvider Interface)。
 * 内核依赖此接口来获取和更新数据。
 * 应用层必须提供一个实现了此接口的对象，并将其注入到内核中。
 */
export interface ItemProvider {
    /**
     * 根据ID异步获取一个项目。
     * @param id - 要获取的项目的唯一ID。
     * @returns 返回一个Promise，解析为CoreItem对象或在找不到时解析为null。
     */
    getItem(id: string): Promise<CoreItem | null>;

    /**
     * 根据ID和新内容更新一个项目。
     * @param id - 要更新的项目的唯一ID。
     * @param content - 项目的新内容。
     * @returns 返回一个Promise，在更新完成后解析。可用于处理保存失败的情况。
     */
    updateItem(id: string, content: string): Promise<void>;
}