// 文件: src/core/stores/contextMenuStore.ts
// 描述: 一个新的 Pinia Store，用于管理全局右键菜单的状态。

import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ContextMenuItem } from '@core/types.ts';

export const useContextMenuStore = defineStore('core-context-menu', () => {
    const isVisible = ref(false);
    const position = ref({ x: 0, y: 0 });
    const items = ref<ContextMenuItem[]>([]);

    function showMenu(event: MouseEvent, menuItems: ContextMenuItem[]) {
        isVisible.value = true;
        position.value = { x: event.clientX, y: event.clientY };
        items.value = menuItems;
    }

    function hideMenu() {
        isVisible.value = false;
        items.value = [];
    }

    return {
        isVisible,
        position,
        items,
        showMenu,
        hideMenu,
    };
});