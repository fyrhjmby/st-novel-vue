import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { PaneNode, LeafPaneNode } from '@core/types.ts';
import { paneTreeService } from '@core/panes/service/PaneTreeService.ts';
import { paneManagementService } from '@core/panes/service/PaneManagementService.ts';

export const usePaneStore = defineStore('core-pane', () => {
    const root = ref<PaneNode | null>(null);
    const activePaneId = ref<string | null>(null);

    const activePane = computed((): LeafPaneNode | null => {
        if (!activePaneId.value || !root.value) return null;
        const result = paneTreeService.findNodeAndParent(root.value, activePaneId.value);
        return result && result.node.type === 'leaf' ? result.node : null;
    });

    const findLeafContainingTab = (tabId: string): LeafPaneNode | null => {
        if (!root.value) return null;
        return paneTreeService.findLeafContainingTab(root.value, tabId);
    };

    function _setRoot(newRoot: PaneNode) {
        root.value = newRoot;
    }

    function _setActivePaneId(paneId: string | null) {
        activePaneId.value = paneId;
    }

    function dehydrate() {
        return {
            root: root.value,
            activePaneId: activePaneId.value,
        };
    }

    function hydrate(state: { root: PaneNode, activePaneId: string | null }) {
        if (state.root && state.activePaneId) {
            root.value = state.root;
            activePaneId.value = state.activePaneId;
        }
    }

    function initializePanes() {
        paneManagementService.initializePanes();
    }

    return {
        root,
        activePaneId,
        activePane,
        findLeafContainingTab,
        _setRoot,
        _setActivePaneId,
        initializePanes,
        hydrate,
        dehydrate,
    };
});