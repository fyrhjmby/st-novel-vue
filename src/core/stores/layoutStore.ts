// 文件: src/core/stores/layoutStore.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';
import { configService } from '@/core/services/ConfigService';
import { eventBus } from '@/core/services/EventBusService';

export const useLayoutStore = defineStore('core-layout', () => {
    const isSidebarVisible = ref(true);
    const sidebarWidth = ref(configService.get('layout.sidebar.defaultWidth', 320));

    function toggleSidebar() {
        isSidebarVisible.value = !isSidebarVisible.value;
        eventBus.emit('core:state-changed', { store: 'layout' });
    }

    function setSidebarWidth(width: number) {
        const min = configService.get('layout.sidebar.minWidth', 240);
        const max = configService.get('layout.sidebar.maxWidth', 600);
        const newWidth = Math.max(min, Math.min(width, max));
        if (sidebarWidth.value !== newWidth) {
            sidebarWidth.value = newWidth;
            eventBus.emit('core:state-changed', { store: 'layout' });
        }
    }

    function hydrate(state: { isSidebarVisible?: boolean; sidebarWidth?: number; }) {
        if (typeof state.isSidebarVisible === 'boolean') {
            isSidebarVisible.value = state.isSidebarVisible;
        }
        if (typeof state.sidebarWidth === 'number') {
            // Use the setter to respect min/max constraints during hydration
            setSidebarWidth(state.sidebarWidth);
        }
    }

    // $subscribe logic is removed to centralize persistence in WorkspaceService

    return {
        isSidebarVisible,
        sidebarWidth,
        toggleSidebar,
        setSidebarWidth,
        hydrate,
    };
});