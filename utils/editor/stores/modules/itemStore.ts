import { defineStore } from 'pinia';
import { useDirectoryStore } from '../directoryStore';
import { useRelatedContentStore } from '../relatedContentStore';
import { useNotesStore } from '../notesStore';
import type { EditorItem, SystemViewInfo } from '@/novel/editor/types';
import { getIconByNodeType } from '@/novel/editor/utils/iconUtils';

export const SYSTEM_VIEWS: Record<string, SystemViewInfo> = {
    'system:search': { id: 'system:search', type: 'system', component: 'SearchView', title: '搜索', icon: 'fa-solid fa-magnifying-glass' },
    'system:ai_chat': { id: 'system:ai_chat', type: 'system', component: 'AIChatView', title: 'AI 聊天', icon: 'fa-solid fa-wand-magic-sparkles' },
    'system:ai_tasks': { id: 'system:ai_tasks', type: 'system', component: 'AITaskPanel', title: 'AI 任务', icon: 'fa-solid fa-list-check' },
    'system:settings_editor': { id: 'system:settings_editor', type: 'system', component: 'EditorSettings', title: '编辑器设置', icon: 'fa-solid fa-pencil' },
    'system:settings_context': { id: 'system:settings_context', type: 'system', component: 'ContextSettings', title: '上下文管理', icon: 'fa-solid fa-book-open-reader' },
    'system:settings_tasks': { id: 'system:settings_tasks', type: 'system', component: 'TaskSettings', title: '任务管理', icon: 'fa-solid fa-list-check' },
    'system:settings_ai_config': { id: 'system:settings_ai_config', type: 'system', component: 'AIConfigSettings', title: 'AI 任务配置', icon: 'fa-solid fa-microchip' },
    'system:settings_novel': { id: 'system:settings_novel', type: 'system', component: 'NovelSettings', title: '小说设置', icon: 'fa-solid fa-swatchbook' },
    'system:history': { id: 'system:history', type: 'system', component: 'HistoryPanel', title: '版本历史', icon: 'fa-solid fa-code-compare' },
    'system:reader': { id: 'system:reader', type: 'system', component: 'ReaderPanel', title: '阅读模式', icon: 'fa-solid fa-book-open' },
};

export const useItemStore = defineStore('editor-item', () => {
    const directoryStore = useDirectoryStore();
    const relatedContentStore = useRelatedContentStore();
    const notesStore = useNotesStore();

    function findItemById(id: string): { node: EditorItem | null; source: string | null } {
        if (id.startsWith('system:')) {
            const parts = id.split(':');
            const baseId = parts.slice(0, 2).join(':');
            const systemView = SYSTEM_VIEWS[baseId];
            if (systemView) {
                if (parts.length > 2) {
                    const targetId = parts[2];
                    const { node: targetNode } = findItemById(targetId);
                    return {
                        node: targetNode ? { ...systemView, id, title: `《${targetNode.title}》 ${systemView.title}` } : null,
                        source: 'system'
                    };
                }
                return { node: systemView, source: 'system' };
            }
        }

        let result = directoryStore.findNodeById(id);
        if (result?.node) return { node: result.node, source: 'directory' };

         result = relatedContentStore.findNodeById(id);
        if (result?.node) return { node: result.node, source: 'related' };

        const note = notesStore.findNoteById(id);
        if (note) return { node: note, source: 'notes' };

        return { node: null, source: null };
    }

    function updateItemContentById(id: string, content: string) {
        const { source } = findItemById(id);
        switch (source) {
            case 'directory': directoryStore.updateChapterContent(id, content); break;
            case 'related': relatedContentStore.updateNodeContent(id, content); break;
            case 'notes': notesStore.updateNoteContent(id, content); break;
        }
    }

    function appendContentToItem(itemId: string, content: string, auto: boolean) {
        const { source } = findItemById(itemId);
        switch (source) {
            case 'directory': directoryStore.appendChapterContent(itemId, content, auto); break;
            case 'related': relatedContentStore.appendNodeContent(itemId, content, auto); break;
            case 'notes': notesStore.appendNoteContent(itemId, content, auto); break;
        }
    }

    return { findItemById, updateItemContentById, appendContentToItem, getIconByNodeType };
});