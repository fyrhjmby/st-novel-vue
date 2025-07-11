
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Pane } from '@/core/types';
import { eventBus } from '@/core/services/EventBusService';
import { useNotificationStore } from './notificationStore';

export const usePaneStore = defineStore('core-pane', () => {
    const panes = ref<Pane[]>([]);
    const activePaneId = ref<string | null>(null);

    const activePane = computed(() => {
        if (!activePaneId.value) return null;
        return panes.value.find(p => p.id === activePaneId.value) || null;
    });

    function initializePanes() {
        if (panes.value.length === 0) {
            const initialPaneId = `pane-${Date.now()}`;
            panes.value.push({ id: initialPaneId, tabs: [], activeTabId: null, activeItem: null });
            activePaneId.value = initialPaneId;
            eventBus.emit('core:pane.initialized', { initialPaneId });
        }
    }

    function setActivePane(paneId: string) {
        if (panes.value.some(p => p.id === paneId) && activePaneId.value !== paneId) {
            activePaneId.value = paneId;
            eventBus.emit('core:pane.activated', { paneId });
        }
    }

    function splitPane(sourcePaneId: string): string {
        const sourcePaneIndex = panes.value.findIndex(p => p.id === sourcePaneId);
        if (sourcePaneIndex === -1) {
            const notificationStore = useNotificationStore();
            notificationStore.add(`Cannot split: pane with ID "${sourcePaneId}" not found.`, 'error');
            return '';
        }

        const newPaneId = `pane-${Date.now()}`;
        const newPane: Pane = { id: newPaneId, tabs: [], activeTabId: null, activeItem: null };
        panes.value.splice(sourcePaneIndex + 1, 0, newPane);

        eventBus.emit('core:pane.splitted', { sourcePaneId, newPaneId });
        return newPaneId;
    }

    function closePane(paneId: string) {
        if (panes.value.length <= 1) {
            const notificationStore = useNotificationStore();
            notificationStore.add('Cannot close the last pane.', 'warning');
            return;
        }

        const paneIndex = panes.value.findIndex(p => p.id === paneId);
        if (paneIndex === -1) return;

        const closedPane = panes.value[paneIndex];
        panes.value.splice(paneIndex, 1);

        if (activePaneId.value === paneId) {
            const newActiveIndex = Math.max(0, paneIndex - 1);
            const newActivePaneId = panes.value[newActiveIndex]?.id || null;
            activePaneId.value = newActivePaneId;
            eventBus.emit('core:pane.activated', { paneId: newActivePaneId });
        }

        eventBus.emit('core:pane.closed', { closedPaneId: paneId, tabs: closedPane.tabs });
    }

    return {
        panes,
        activePaneId,
        activePane,
        initializePanes,
        setActivePane,
        splitPane,
        closePane,
    };
});