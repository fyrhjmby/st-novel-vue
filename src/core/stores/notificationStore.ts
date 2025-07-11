// 文件: src/core/stores/notificationStore.ts
// 描述: 管理全局通知（Toast）的状态。

import { defineStore } from 'pinia';
import { ref } from 'vue';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
    duration?: number; // 显示时长（毫秒），可选
}

let nextId = 0;

export const useNotificationStore = defineStore('core-notification', () => {
    const notifications = ref<Notification[]>([]);

    /**
     * 添加一条新通知。
     * @param message - 通知内容。
     * @param type - 通知类型。
     * @param duration - （可选）显示时长，默认3000ms。
     */
    function add(message: string, type: NotificationType = 'info', duration: number = 3000) {
        const id = nextId++;
        notifications.value.push({ id, message, type, duration });

        if (duration > 0) {
            setTimeout(() => {
                remove(id);
            }, duration);
        }
    }

    /**
     * 移除一条通知。
     * @param id - 要移除的通知的ID。
     */
    function remove(id: number) {
        const index = notifications.value.findIndex(n => n.id === id);
        if (index !== -1) {
            notifications.value.splice(index, 1);
        }
    }

    return {
        notifications,
        add,
        remove,
    };
});