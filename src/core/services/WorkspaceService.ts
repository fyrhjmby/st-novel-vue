
import { toRaw } from 'vue';
import { usePaneStore } from '@/core/stores/paneStore';
import { useLayoutStore } from '@/core/stores/layoutStore';

const WORKSPACE_STORAGE_KEY = 'editorCoreWorkspaceState';

class WorkspaceService {
    private paneStore = usePaneStore();
    private layoutStore = useLayoutStore();

    constructor() {
        this.persist = this.debounce(this.persist.bind(this), 1000);
    }

    /**
     * 将当前工作区状态保存到localStorage。
     */
    public persist(): void {
        const state = {
            panes: {
                panes: toRaw(this.paneStore.panes).map(p => ({
                    id: p.id,
                    activeTabId: p.activeTabId,
                    tabs: p.tabs.map(t => ({ id: t.id })) // 只保存tab的ID
                })),
                activePaneId: this.paneStore.activePaneId,
            },
            layout: {
                isSidebarVisible: this.layoutStore.isSidebarVisible,
                sidebarWidth: this.layoutStore.sidebarWidth,
            },
        };
        localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(state));
        console.log('[WorkspaceService] State persisted.');
    }

    /**
     * 从localStorage恢复工作区状态。
     * 应用启动时调用。
     */
    public async hydrate(): Promise<void> {
        const savedStateJSON = localStorage.getItem(WORKSPACE_STORAGE_KEY);
        if (!savedStateJSON) {
            console.log('[WorkspaceService] No saved state found.');
            return;
        }

        try {
            const savedState = JSON.parse(savedStateJSON);

            // 恢复布局状态
            if (savedState.layout) {
                this.layoutStore.hydrate(savedState.layout);
            }

            // 恢复窗格和标签页状态
            if (savedState.panes && savedState.panes.panes.length > 0) {
                // 直接恢复窗格结构
                this.paneStore.panes = []; // 清空默认窗格
                this.paneStore.activePaneId = savedState.panes.activePaneId;

                for (const savedPane of savedState.panes.panes) {
                    const newPane = { id: savedPane.id, activeTabId: savedPane.activeTabId, tabs: [] };
                    this.paneStore.panes.push(newPane);
                    // 异步恢复每个标签页
                    for (const savedTab of savedPane.tabs) {
                        // 这里我们不直接创建Tab对象，而是调用openTab
                        // openTab会从ItemProvider获取最新的title和icon
                        await useTabStore().openTab(savedTab.id, newPane.id);
                    }
                    // 确保恢复后的activeTabId是正确的
                    newPane.activeTabId = savedPane.activeTabId;
                }

                console.log('[WorkspaceService] State hydrated.');
            }
        } catch (error) {
            console.error('[WorkspaceService] Failed to hydrate state:', error);
            localStorage.removeItem(WORKSPACE_STORAGE_KEY);
        }
    }

    /**
     * 简单的debounce函数，防止过于频繁地写入localStorage。
     * @param func - 要节流的函数。
     * @param delay - 延迟时间（毫秒）。
     */
    private debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
        let timeoutId: number | undefined;
        return (...args: Parameters<T>) => {
            clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => func(...args), delay);
        };
    }
}

export const workspaceService = new WorkspaceService();