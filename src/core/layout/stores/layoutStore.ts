import { defineStore } from 'pinia';
import { ref } from 'vue';
import { configService } from '@core/common/services/ConfigService.ts';

export const useLayoutStore = defineStore('core-layout', () => {
    const isSidebarVisible = ref(true);
    const sidebarWidth = ref(configService.get('layout.sidebar.defaultWidth', 320));

    function toggleSidebar() {
        isSidebarVisible.value = !isSidebarVisible.value;
    }

    function setSidebarWidth(width: number) {
        const min = configService.get('layout.sidebar.minWidth', 240);
        const max = configService.get('layout.sidebar.maxWidth', 600);
        const newWidth = Math.max(min, Math.min(width, max));
        if (sidebarWidth.value !== newWidth) {
            sidebarWidth.value = newWidth;
        }
    }

    function dehydrate() {
        return {
            isSidebarVisible: isSidebarVisible.value,
            sidebarWidth: sidebarWidth.value,
        };
    }

    function hydrate(state: { isSidebarVisible?: boolean; sidebarWidth?: number; }) {
        if (typeof state.isSidebarVisible === 'boolean') {
            isSidebarVisible.value = state.isSidebarVisible;
        }
        if (typeof state.sidebarWidth === 'number') {
            setSidebarWidth(state.sidebarWidth);
        }
    }

    return {
        isSidebarVisible,
        sidebarWidth,
        toggleSidebar,
        setSidebarWidth,
        hydrate,
        dehydrate,
    };
});