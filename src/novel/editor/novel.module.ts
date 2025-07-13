import { type Component } from 'vue';
import type { ViewRegistry } from '@core/common/services/ViewRegistry';
import { commandService } from '@core/services/CommandService';
import { keybindingService } from '@core/common/services/KeybindingService';
import { registerNovelCommands } from './features/novel.commands';
import { registerNovelKeybindings } from './features/novel.keybindings';
import { registerNovelContextMenu } from './features/novel.contextMenu';

// --- 视图组件动态导入 ---
const NovelEditorPane = () => import('./views/NovelEditorPane.vue');
const AIChatView = () => import('./components/ai/AIChatView.vue');
const AITaskPanel = () => import('./components/ai/AITaskPanel.vue');
const SearchView = () => import('./components/system/SearchView.vue');
const HistoryPanel = () => import('./components/system/HistoryPanel.vue');
const ReaderPanel = () => import('./components/system/ReaderPanel.vue');
const EditorSettings = () => import('./components/system/settings/EditorSettings.vue');
const ContextSettings = () => import('./components/system/settings/ContextSettings.vue');
const TaskSettings = () => import('./components/system/settings/TaskSettings.vue');
const AIConfigSettings = () => import('./components/system/settings/AIConfigSettings.vue');
const NovelSettings = () => import('./components/system/settings/NovelSettings.vue');

const VIEW_MAP: Record<string, Component> = {
    'novel-content-editor': NovelEditorPane,
    'novel-ai-chat-view': AIChatView,
    'novel-ai-task-panel': AITaskPanel,
    'novel-search-view': SearchView,
    'novel-history-panel': HistoryPanel,
    'novel-reader-panel': ReaderPanel,
    'novel-settings-editor': EditorSettings,
    'novel-settings-context': ContextSettings,
    'novel-settings-tasks': TaskSettings,
    'novel-settings-ai-config': AIConfigSettings,
    'novel-settings-novel': NovelSettings,
};

function registerViewComponents(viewRegistry: ViewRegistry) {
    for (const viewType in VIEW_MAP) {
        viewRegistry.register(viewType, VIEW_MAP[viewType]);
    }
}

export class NovelModule {
    public install(viewRegistry: ViewRegistry): void {
        registerViewComponents(viewRegistry);
        registerNovelCommands(commandService);
        registerNovelKeybindings(keybindingService);
        registerNovelContextMenu();
    }
}