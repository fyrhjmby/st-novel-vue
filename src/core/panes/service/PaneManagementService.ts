import { usePaneStore } from '@core/panes/stores/paneStore.ts';
import { useNotificationStore } from '@core/layout/stores/notificationStore.ts';
import { paneTreeService } from '@core/panes/service/PaneTreeService.ts';
import { eventBus } from '@core/common/services/EventBusService.ts';
import type { PaneNode } from '@core/types.ts';
import { CoreEvent } from '@core/constants.ts';

class PaneManagementService {
    public initializePanes() {
        const paneStore = usePaneStore();
        if (!paneStore.root) {
            const initialPaneId = `pane-${Date.now()}`;
            const initialRoot: PaneNode = { id: initialPaneId, type: 'leaf', tabIds: [], activeTabId: null };
            paneStore._setRoot(initialRoot);
            this.setActivePane(initialPaneId);
            eventBus.emit(CoreEvent.PANE_INITIALIZED, { initialPaneId });
        }
    }

    public setActivePane(paneId: string | null) {
        const paneStore = usePaneStore();
        if (paneId && paneStore.activePaneId !== paneId) {
            paneStore._setActivePaneId(paneId);
            eventBus.emit(CoreEvent.PANE_ACTIVATED, { paneId });
        }
    }

    public setActiveTab(paneId: string, tabId: string | null) {
        const paneStore = usePaneStore();
        if (!paneStore.root) return;
        const result = paneTreeService.findNodeAndParent(paneStore.root, paneId);
        if (result && result.node.type === 'leaf' && result.node.activeTabId !== tabId) {
            result.node.activeTabId = tabId;
            eventBus.emit(CoreEvent.STATE_CHANGED, { store: 'pane' });
        }
    }

    public addTabToPane(tabId: string, paneId: string) {
        const paneStore = usePaneStore();
        if (!paneStore.root) return;
        const result = paneTreeService.findNodeAndParent(paneStore.root, paneId);
        if (result && result.node.type === 'leaf' && !result.node.tabIds.includes(tabId)) {
            result.node.tabIds.push(tabId);
            eventBus.emit(CoreEvent.STATE_CHANGED, { store: 'pane' });
        }
    }

    public removeTabFromPane(tabId: string) {
        const paneStore = usePaneStore();
        if (!paneStore.root) return;
        const leaf = paneStore.findLeafContainingTab(tabId);
        if (leaf) {
            const index = leaf.tabIds.indexOf(tabId);
            if (index > -1) {
                leaf.tabIds.splice(index, 1);
                if (leaf.activeTabId === tabId) {
                    const newActiveIndex = Math.max(0, index - 1);
                    leaf.activeTabId = leaf.tabIds[newActiveIndex] || null;
                }
                eventBus.emit(CoreEvent.STATE_CHANGED, { store: 'pane' });
            }
        }
    }

    public updatePaneNodeSize(splitNodeId: string, newSizes: number[]) {
        const paneStore = usePaneStore();
        if (!paneStore.root) return;
        const findResult = paneTreeService.findNodeAndParent(paneStore.root, splitNodeId);
        if (findResult && findResult.node.type === 'split') {
            findResult.node.sizes = newSizes;
            eventBus.emit(CoreEvent.STATE_CHANGED, { store: 'pane' });
        }
    }

    public splitPane(sourcePaneId: string, direction: 'horizontal' | 'vertical' = 'horizontal') {
        const paneStore = usePaneStore();
        if (!paneStore.root) return;
        const result = paneTreeService.splitPane(paneStore.root, sourcePaneId, direction);
        if (result) {
            paneStore._setRoot(result.newRoot);
            this.setActivePane(result.newPaneId);
            eventBus.emit(CoreEvent.PANE_SPLITTED, { sourcePaneId, newPaneId: result.newPaneId });
        }
    }

    public closePane(paneId: string): string[] | null {
        const paneStore = usePaneStore();
        if (!paneStore.root) return null;
        const result = paneTreeService.closePane(paneStore.root, paneId);
        if (result) {
            paneStore._setRoot(result.newRoot);
            if (paneStore.activePaneId === paneId) {
                const firstLeaf = paneTreeService.findLeaf(paneStore.root);
                this.setActivePane(firstLeaf ? firstLeaf.id : null);
            }
            eventBus.emit(CoreEvent.PANE_CLOSED, { closedPaneId: paneId });
            return result.closedPane.tabIds;
        } else {
            useNotificationStore().add('Cannot close the last pane.', 'warning');
            return null;
        }
    }
}

export const paneManagementService = new PaneManagementService();