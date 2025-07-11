
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { configService } from '@/core/services/ConfigService';

export const useLayoutStore = defineStore('core-layout', () => {
    // --- State ---
    const isSidebarVisible = ref(true);
    const sidebarWidth = ref(configService.get('layout.sidebar.defaultWidth', 320));

    // --- Actions ---

    /**
     * 切换侧边栏的可见性。
     */
    function toggleSidebar() {
        isSidebarVisible.value = !isSidebarVisible.value;
    }

    /**
     * 设置侧边栏的宽度。
     * @param width - 新的宽度值。
     */
    function setSidebarWidth(width: number) {
        const min = configService.get('layout.sidebar.minWidth', 240);
        const max = configService.get('layout.sidebar.maxWidth', 600);
        sidebarWidth.value = Math.max(min, Math.min(width, max));
    }

    /**
     * (用于工作区恢复) 设置整个布局的状态。
     * @param state - 包含布局状态的对象。
     */
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
    };
});