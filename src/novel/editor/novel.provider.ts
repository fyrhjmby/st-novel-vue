import type { ItemProvider, CoreItem } from '@core/types';
import { useDirectoryStore } from './stores/directoryStore';
import { useRelatedContentStore } from './stores/relatedContentStore';
import { useNotesStore } from './stores/notesStore';
import { getIconByNodeType } from './utils/iconUtils';
import type { Chapter, RelatedTree, NoteItem } from './types';

// 定义了模块内可编辑实体的类型联合
type EditableItem = Chapter | RelatedTree | NoteItem;

const SYSTEM_VIEWS_CONFIG = {
    'system:search': { title: '搜索', icon: 'fa-solid fa-magnifying-glass', viewType: 'novel-search-view' },
    'system:ai_chat': { title: 'AI 聊天', icon: 'fa-solid fa-wand-magic-sparkles', viewType: 'novel-ai-chat-view' },
    'system:ai_tasks': { title: 'AI 任务', icon: 'fa-solid fa-list-check', viewType: 'novel-ai-task-panel' },
    'system:settings_editor': { title: '编辑器设置', icon: 'fa-solid fa-pencil', viewType: 'novel-settings-editor' },
    'system:settings_context': { title: '上下文管理', icon: 'fa-solid fa-book-open-reader', viewType: 'novel-settings-context' },
    'system:settings_tasks': { title: '任务管理', icon: 'fa-solid fa-list-check', viewType: 'novel-settings-tasks' },
    'system:settings_ai_config': { title: 'AI 任务配置', icon: 'fa-solid fa-microchip', viewType: 'novel-settings-ai-config' },
    'system:settings_novel': { title: '小说设置', icon: 'fa-solid fa-swatchbook', viewType: 'novel-settings-novel' },
    'system:history': { title: '版本历史', icon: 'fa-solid fa-code-compare', viewType: 'novel-history-panel' },
    'system:reader': { title: '阅读模式', icon: 'fa-solid fa-book-open', viewType: 'novel-reader-panel' },
};

class NovelItemProvider implements ItemProvider {
    public async getItem(id: string): Promise<CoreItem | null> {
        // 处理系统视图
        const systemViewInfo = this.getSystemView(id);
        if (systemViewInfo) {
            return systemViewInfo;
        }

        // 处理内容实体
        const directoryStore = useDirectoryStore();
        const relatedContentStore = useRelatedContentStore();
        const notesStore = useNotesStore();

        const finders = [
            () => directoryStore.findNodeById(id)?.node,
            () => relatedContentStore.findNodeById(id)?.node,
            () => notesStore.findNoteById(id),
        ];

        for (const find of finders) {
            const item = find() as EditableItem | undefined;
            if (item && 'content' in item) {
                return {
                    id: item.id,
                    title: item.title,
                    icon: getIconByNodeType(item.type),
                    viewType: this.getViewTypeForItem(item),
                    metadata: { ...item }, // 传递完整业务数据
                };
            }
        }

        return null;
    }

    public async updateItem(id: string, content: string): Promise<void> {
        const directoryStore = useDirectoryStore();
        const relatedContentStore = useRelatedContentStore();
        const notesStore = useNotesStore();

        if (directoryStore.findNodeById(id)?.node) {
            directoryStore.updateChapterContent(id, content);
        } else if (relatedContentStore.findNodeById(id)?.node) {
            relatedContentStore.updateNodeContent(id, content);
        } else if (notesStore.findNoteById(id)) {
            notesStore.updateNoteContent(id, content);
        }
    }

    private getSystemView(id: string): CoreItem | null {
        const parts = id.split(':');
        const baseId = parts.slice(0, 2).join(':');
        const config = SYSTEM_VIEWS_CONFIG[baseId as keyof typeof SYSTEM_VIEWS_CONFIG];

        if (!config) return null;

        let title = config.title;
        // 为动态系统视图（如历史记录）生成唯一标题
        if (parts.length > 2) {
            const targetId = parts.slice(2).join(':');
            // 异步地获取目标项的标题
            // 注意: 这是一个简化的同步查找，实际可能需要异步
            const directoryStore = useDirectoryStore();
            const targetNode = directoryStore.findNodeById(targetId)?.node;
            if (targetNode) {
                title = `《${targetNode.title}》 ${config.title}`;
            }
        }

        return {
            id: id,
            title: title,
            icon: config.icon,
            viewType: config.viewType,
            metadata: { targetId: parts.length > 2 ? parts.slice(2).join(':') : null },
        };
    }

    private getViewTypeForItem(item: EditableItem): string {
        switch (item.type) {
            case 'chapter':
            case 'note':
            case 'worldview_item': // Fallthrough for all Tiptap-editable content
            case 'character_item':
            case 'location_item':
            case 'item_item':
            case 'plot_item':
            case 'analysis_item':
            case 'plot_chapter':
            case 'analysis_chapter':
                return 'novel-content-editor';
            default:
                return 'novel-default-view'; // A fallback view
        }
    }
}

export const novelItemProvider = new NovelItemProvider();