// 文件路径: src/novel/editor/stores/paneStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { EditorPane } from '@/novel/editor/types';

export const usePaneStore = defineStore('editor-pane', () => {
    const panes = ref<EditorPane[]>([]);
    const activePaneId = ref<string | null>(null);

    const activePane = computed(() => panes.value.find(p => p.id === activePaneId.value));
    const activeTabId = computed(() => activePane.value?.activeTabId ?? null);

    const initializePanes = () => {
        if (panes.value.length === 0) {
            const initialPaneId = `pane-${Date.now()}`;
            panes.value.push({ id: initialPaneId, openTabIds: [], activeTabId: null });
            activePaneId.value = initialPaneId;
        }
    };

    const findPaneByTabId = (tabId: string): EditorPane | undefined => {
        return panes.value.find(p => p.openTabIds.includes(tabId));
    };

    const addTabToPane = (itemId: string, targetPaneId?: string) => {
        const paneId = targetPaneId || activePaneId.value;
        if (!paneId) return;

        let pane = panes.value.find(p => p.id === paneId);
        if (!pane) return;

        const existingTabPane = findPaneByTabId(itemId);
        if (existingTabPane) {
            existingTabPane.activeTabId = itemId;
            activePaneId.value = existingTabPane.id;
            return;
        }

        if (!pane.openTabIds.includes(itemId)) {
            pane.openTabIds.push(itemId);
        }
        pane.activeTabId = itemId;
        activePaneId.value = paneId;
    };

    const removeTabFromPane = (itemId: string, paneId?: string) => {
        const targetPaneId = paneId || findPaneByTabId(itemId)?.id;
        if (!targetPaneId) return;

        const pane = panes.value.find(p => p.id === targetPaneId);
        if (!pane) return;

        const index = pane.openTabIds.indexOf(itemId);
        if (index === -1) return;

        pane.openTabIds.splice(index, 1);

        if (pane.activeTabId === itemId) {
            pane.activeTabId = pane.openTabIds.length > 0 ? pane.openTabIds[Math.max(0, index - 1)] : null;
        }
    };

    const removePane = (paneId: string) => {
        if (panes.value.length <= 1) return;
        const paneIndex = panes.value.findIndex(p => p.id === paneId);
        if (paneIndex === -1) return;

        const wasActive = activePaneId.value === paneId;
        panes.value.splice(paneIndex, 1);

        if (wasActive) {
            const newActiveIndex = Math.max(0, paneIndex - 1);
            activePaneId.value = panes.value[newActiveIndex]?.id || null;
        }
    };

    const _splitPane = (sourcePaneId: string): string | null => {
        const sourcePaneIndex = panes.value.findIndex(p => p.id === sourcePaneId);
        if (sourcePaneIndex === -1) return null;

        const newPaneId = `pane-${Date.now()}`;
        const newPane: EditorPane = { id: newPaneId, openTabIds: [], activeTabId: null };

        panes.value.splice(sourcePaneIndex + 1, 0, newPane);
        return newPaneId;
    }

    return {
        panes,
        activePaneId,
        activePane,
        activeTabId,
        initializePanes,
        addTabToPane,
        removeTabFromPane,
        removePane,
        setActivePane: (paneId: string) => { if (panes.value.some(p => p.id === paneId)) { activePaneId.value = paneId; } },
        splitPane: _splitPane,
        findPaneByTabId,
    };
});