// 文件: src/core/services/ViewRegistry.ts
// 描述: 视图注册表服务，负责管理 "viewType" 字符串到 Vue 组件的映射。

import type { Component } from 'vue';

class ViewRegistry {
    private views: Map<string, Component> = new Map();

    /**
     * 注册一个视图类型及其对应的Vue组件。
     * 应用层在启动时调用此方法，告诉内核如何渲染特定类型的内容。
     * @param viewType - 视图的唯一标识符字符串 (e.g., 'novel-chapter-editor')。
     * @param component - 要渲染的Vue组件。
     */
    public register(viewType: string, component: Component): void {
        if (this.views.has(viewType)) {
            console.warn(`[ViewRegistry] View type "${viewType}" is already registered. Overwriting.`);
        }
        this.views.set(viewType, component);
    }

    /**
     * 根据视图类型解析并返回对应的Vue组件。
     * PaneInstance组件会调用此方法来动态渲染内容。
     * @param viewType - 视图的唯一标识符字符串。
     * @returns 如果找到，则返回Vue组件；否则返回null。
     */
    public resolve(viewType: string): Component | null {
        if (!this.views.has(viewType)) {
            console.error(`[ViewRegistry] No view component registered for type "${viewType}".`);
            return null;
        }
        return this.views.get(viewType) || null;
    }
}

// 导出一个单例，确保整个应用共享同一个视图注册表。
export const viewRegistry = new ViewRegistry();