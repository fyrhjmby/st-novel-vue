// 文件: src/core/services/WorkspaceService.ts

import { eventBus } from './EventBusService';
import { useLayoutStore } from '@/core/stores/layoutStore';
import { usePaneStore } from '@/core/stores/paneStore';
import { useTabStore } from '@/core/stores/tabStore';

const WORKSPACE_STORAGE_KEY = 'editorCoreWorkspaceState_v2';

class WorkspaceService {
    private debouncedPersistState: () => void;

    constructor() {
        this.debouncedPersistState = this.debounce(this.persistState.bind(this), 500);
    }

    public initialize() {
        eventBus.on('core:state-changed', this.debouncedPersistState);
        console.log('[WorkspaceService] Initialized and listening for state changes.');
    }

    public destroy() {
        eventBus.off('core:state-changed', this.debouncedPersistState);
        console.log('[WorkspaceService] Destroyed event listener.');
    }

    private getStoresState() {
        const layoutStore = useLayoutStore();
        const paneStore = usePaneStore();
        const tabStore = useTabStore();

        return {
            layout: {
                isSidebarVisible: layoutStore.isSidebarVisible,
                sidebarWidth: layoutStore.sidebarWidth,
            },
            paneLayout: {
                root: paneStore.root,
                activePaneId: paneStore.activePaneId,
            },
            tabs: tabStore.dehydrate(),
        };
    }

    private persistState(): void {
        try {
            const state = this.getStoresState();
            const stateJSON = JSON.stringify(state);
            localStorage.setItem(WORKSPACE_STORAGE_KEY, stateJSON);
        } catch (error) {
            console.error('[WorkspaceService] Failed to persist state:', error);
        }
    }

    public loadAndHydrateStores(): void {
        const savedStateJSON = localStorage.getItem(WORKSPACE_STORAGE_KEY);
        if (!savedStateJSON) {
            console.log('[WorkspaceService] No saved workspace state found.');
            return;
        }

        try {
            const savedState = JSON.parse(savedStateJSON);
            const layoutStore = useLayoutStore();
            const paneStore = usePaneStore();
            const tabStore = useTabStore();

            if (savedState.layout) {
                layoutStore.hydrate(savedState.layout);
            }
            if (savedState.paneLayout) {
                paneStore.hydrate(savedState.paneLayout);
            }
            if (savedState.tabs) {
                tabStore.hydrate(savedState.tabs);
            }
            console.log('[WorkspaceService] Stores hydrated from saved state.');
        } catch (error) {
            console.error('[WorkspaceService] Failed to hydrate stores:', error);
            localStorage.removeItem(WORKSPACE_STORAGE_KEY);
        }
    }

    private debounce<T extends (...args: any[]) => any>(func: T, delay: number): () => void {
        let timeoutId: number | undefined;
        return () => {
            clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => func(), delay);
        };
    }
}

export const workspaceService = new WorkspaceService();