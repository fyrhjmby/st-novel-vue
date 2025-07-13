import { useLayoutStore } from '@core/layout/stores/layoutStore.ts';
import { usePaneStore } from '@core/panes/stores/paneStore.ts';
import { useTabStore } from '@core/tabs/stores/tabStore.ts';

const WORKSPACE_STORAGE_KEY = 'editorCoreWorkspaceState';
const WORKSPACE_STATE_VERSION = 'v2.1';

type Unsubscribe = () => void;

class WorkspaceService {
    private debouncedPersistState: () => void;
    private subscriptions: Unsubscribe[] = [];

    constructor() {
        this.debouncedPersistState = this.debounce(this.persistState.bind(this), 500);
    }

    public initialize() {
        const layoutStore = useLayoutStore();
        const paneStore = usePaneStore();
        const tabStore = useTabStore();

        // Subscribe to each store and save the unsubscribe function
        this.subscriptions.push(layoutStore.$subscribe(this.debouncedPersistState));
        this.subscriptions.push(paneStore.$subscribe(this.debouncedPersistState));
        this.subscriptions.push(tabStore.$subscribe(this.debouncedPersistState));

        console.log('[WorkspaceService] Initialized and subscribed to stores.');
    }

    public destroy() {
        // Unsubscribe from all stores to prevent memory leaks
        this.subscriptions.forEach(unsubscribe => unsubscribe());
        this.subscriptions = [];
        console.log('[WorkspaceService] Destroyed store subscriptions.');
    }

    private getStoresState() {
        const layoutStore = useLayoutStore();
        const paneStore = usePaneStore();
        const tabStore = useTabStore();

        return {
            version: WORKSPACE_STATE_VERSION,
            state: {
                layout: layoutStore.dehydrate(),
                paneLayout: paneStore.dehydrate(),
                tabs: tabStore.dehydrate(),
            }
        };
    }

    private persistState(): void {
        try {
            const statePayload = this.getStoresState();
            const stateJSON = JSON.stringify(statePayload);
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
            const savedPayload = JSON.parse(savedStateJSON);

            if (savedPayload.version !== WORKSPACE_STATE_VERSION) {
                console.warn(
                    `[WorkspaceService] Mismatch in workspace state version. Expected '${WORKSPACE_STATE_VERSION}', found '${savedPayload.version}'. Discarding saved state.`
                );
                localStorage.removeItem(WORKSPACE_STORAGE_KEY);
                return;
            }

            const savedState = savedPayload.state;
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