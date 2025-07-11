
import type { CoreItem } from './index';
/**
 * 数据提供者接口 (ItemProvider Interface)。
 * 内核自身不实现它，但它依赖这个接口来获取任何需要展示的数据。
 * 应用层（如小说编辑器）必须提供一个实现了此接口的对象，并将其注入到内核中。
 *
 * 这种设计将内核的数据获取逻辑与具体的数据源（如Pinia Store、本地文件、API）完全解耦。
 */
export interface ItemProvider {
    /**
     * 根据ID异步获取一个项目。
     * @param id - 要获取的项目的唯一ID。
     * @returns 返回一个Promise，解析为CoreItem对象或在找不到时解析为null。
     */
    getItem(id: string): Promise<CoreItem | null>;
}