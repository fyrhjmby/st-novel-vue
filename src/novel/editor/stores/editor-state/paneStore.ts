import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface EditorPane {
    id: string;
    openTabIds: string[];
    activeTabId: string | null;
}

export const usePaneStore = defineStore('editor-pane', () => {
    const panes = ref<EditorPane[]>([]);
    const activePaneId = ref<string | null>(null);

    function initializePanes() {
        if (panes.value.length > 0) return;
        const initialPaneId = `pane-${Date.now()}`;
        panes.value.push({ id: initialPaneId, openTabIds: [], activeTabId: null });
        activePaneId.value = initialPaneId;
    }

    function setActivePane(paneId: string) {
        if (panes.value.some(p => p.id === paneId)) {
            activePaneId.value = paneId;
        }
    }

    function splitPane(sourcePaneId: string): string {
        const sourcePaneIndex = panes.value.findIndex(p => p.id === sourcePaneId);
        if (sourcePaneIndex === -1) return '';

        const newPaneId = `pane-${Date.now()}`;
        const newPane: EditorPane = { id: newPaneId, openTabIds: [], activeTabId: null };
        panes.value.splice(sourcePaneIndex + 1, 0, newPane);

        return newPaneId;
    }

    function closePane(paneId: string) {
        if (panes.value.length <= 1) return;
        const paneIndex = panes.value.findIndex(p => p.id === paneId);
        if (paneIndex === -1) return;

        panes.value.splice(paneIndex, 1);
        if (activePaneId.value === paneId) {
            const newActiveIndex = Math.max(0, paneIndex - 1);
            activePaneId.value = panes.value[newActiveIndex]?.id || null;
        }
    }

    return {
        panes,
        activePaneId,
        initializePanes,
        setActivePane,
        splitPane,
        closePane,
    };
});