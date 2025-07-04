// ..\src\novel\editor\stores\uiStateStore.ts

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStateStore = defineStore('editorUIState', () => {
    // --- State ---
    const isContextPreviewModalVisible = ref(false);

    // --- Actions ---

    /**
     * 打开上下文预览模态框。
     */
    const openContextPreviewModal = () => {
        isContextPreviewModalVisible.value = true;
    };

    /**
     * 关闭上下文预览模态框。
     */
    const closeContextPreviewModal = () => {
        isContextPreviewModalVisible.value = false;
    };

    return {
        isContextPreviewModalVisible,
        openContextPreviewModal,
        closeContextPreviewModal,
    };
});