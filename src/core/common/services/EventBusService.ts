// 文件: src/core/services/EventBusService.ts
// 描述: 一个轻量级的全局事件总线，用于实现模块间的解耦通信。

type EventHandler = (payload?: any) => void;

class EventBusService {
    private events: Map<string, EventHandler[]> = new Map();

    /**
     * 订阅一个事件。
     * @param eventName - 事件名称 (e.g., 'core:tab.opened')。
     * @param handler - 事件处理函数。
     */
    public on(eventName: string, handler: EventHandler): void {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        this.events.get(eventName)!.push(handler);
    }

    /**
     * 取消订阅一个事件。
     * @param eventName - 事件名称。
     * @param handler - 要移除的事件处理函数。
     */
    public off(eventName: string, handler: EventHandler): void {
        const handlers = this.events.get(eventName);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index > -1) {
                handlers.splice(index, 1);
            }
        }
    }

    /**
     * 触发一个事件，通知所有订阅者。
     * @param eventName - 事件名称。
     * @param payload - （可选）随事件传递的数据。
     */
    public emit(eventName: string, payload?: any): void {
        const handlers = this.events.get(eventName);
        if (handlers) {
            // 创建副本以防在处理过程中有订阅/取消订阅操作
            [...handlers].forEach(handler => handler(payload));
        }
    }
}

// 导出一个单例，确保整个应用共享同一个事件总线。
export const eventBus = new EventBusService();