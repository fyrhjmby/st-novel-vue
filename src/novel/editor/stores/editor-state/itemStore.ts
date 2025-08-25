// 文件: ..\src\novel\editor\stores\editor-state\itemStore.ts

import { defineStore } from 'pinia';
import { useDirectoryStore } from '../directoryStore';
import { useRelatedContentStore } from '../relatedContentStore';
import { useNotesStore } from '../notesStore';
import { useDerivedContentStore } from '../derivedContentStore';
import { usePromptTemplateStore } from '../promptTemplateStore';
import { useReferenceStore } from '../referenceStore';
import type { EditorItem, SystemViewInfo, TreeNode, PlotAnalysisItem } from '@/novel/editor/types';
import { getIconByNodeType } from '@/novel/editor/utils/iconUtils';
import { useDerivedViewStore } from '../derivedViewStore';

export const SYSTEM_VIEWS: Record<string, SystemViewInfo> = {
    'system:search': { id: 'system:search', type: 'system', component: 'SearchView', title: '搜索', icon: 'fa-solid fa-magnifying-glass' },
    'system:ai_chat': { id: 'system:ai_chat', type: 'system', component: 'AIChatView', title: 'AI 聊天', icon: 'fa-solid fa-wand-magic-sparkles' },
    'system:ai_tasks': { id: 'system:ai_tasks', type: 'system', component: 'AITaskPanel', title: 'AI 任务', icon: 'fa-solid fa-list-check' },
    'system:settings_editor': { id: 'system:settings_editor', type: 'system', component: 'EditorSettings', title: '编辑器设置', icon: 'fa-solid fa-pencil' },
    'system:settings_context': { id: 'system:settings_context', type: 'system', component: 'ContextSettings', title: '上下文管理', icon: 'fa-solid fa-book-open-reader' },
    'system:settings_tasks': { id: 'system:settings_tasks', type: 'system', component: 'TaskSettings', title: '任务管理', icon: 'fa-solid fa-list-check' },
    'system:settings_ai_config': { id: 'system:settings_ai_config', type: 'system', component: 'AIConfigSettings', title: 'AI 任务配置', icon: 'fa-solid fa-microchip' },
    'system:settings_novel': { id: 'system:settings_novel', type: 'system', component: 'NovelSettings', title: '小说设置', icon: 'fa-solid fa-swatchbook' },
    'system:settings_theme': { id: 'system:settings_theme', type: 'system', component: 'ThemeSettings', title: '主题设置', icon: 'fa-solid fa-palette' },
    'system:history': { id: 'system:history', type: 'system', component: 'HistoryPanel', title: '版本历史', icon: 'fa-solid fa-code-compare' },
    'system:derived_view': { id: 'system:derived_view', type: 'system', component: 'DerivedContentView', title: '派生内容', icon: 'fa-solid fa-clone' },
};

export const useItemStore = defineStore('editor-item', () => {
    const directoryStore = useDirectoryStore();
    const relatedContentStore = useRelatedContentStore();
    const notesStore = useNotesStore();
    const derivedContentStore = useDerivedContentStore();
    const promptTemplateStore = usePromptTemplateStore();
    const referenceStore = useReferenceStore();
    const derivedViewStore = useDerivedViewStore();

    function findItemById(id: string): { node: EditorItem | null; source: string | null } {
        if (id.startsWith('system:')) {
            const parts = id.split(':');
            const baseId = `system:${parts[1]}`;
            const systemView = SYSTEM_VIEWS[baseId];
            if (systemView) {
                // Handle dynamic title for history panel
                if (baseId === 'system:history' && parts.length === 3) {
                    const targetId = parts[2];
                    const { node: targetNode } = findItemById(targetId);
                    return {
                        node: targetNode ? { ...systemView, id, title: `《${targetNode.title}》 ${systemView.title}` } : null,
                        source: 'system'
                    };
                }
                // Handle dynamic title for derived view panel
                if (baseId === 'system:derived_view') {
                    return {
                        node: { ...systemView, id, title: derivedViewStore.viewTitle },
                        source: 'system'
                    }
                }
                return { node: { ...systemView, id }, source: 'system' };
            }
        }

        const derivedItem = derivedContentStore.findItemById(id);
        if (derivedItem) return { node: derivedItem as PlotAnalysisItem, source: 'derived' };

        const promptItem = promptTemplateStore.findPromptById(id);
        if (promptItem) return { node: promptItem, source: 'prompt' };

        let dirResult = directoryStore.findNodeById(id);
        if (dirResult?.node) return { node: dirResult.node, source: 'directory' };

        const relatedResult = relatedContentStore.findNodeById(id);
        if(relatedResult?.node) return { node: relatedResult.node, source: 'related' };

        const note = notesStore.findNoteById(id);
        if (note) return { node: note, source: 'notes' };

        const refResult = referenceStore.findNodeById(id);
        if (refResult?.node) return { node: refResult.node, source: 'reference' };

        return { node: null, source: null };
    }

    function updateItemContentById(id: string, content: string) {
        const { source } = findItemById(id);
        switch (source) {
            case 'directory': directoryStore.updateChapterContent(id, content); break;
            case 'related': relatedContentStore.updateNodeContent(id, content); break;
            case 'notes': notesStore.updateNoteContent(id, content); break;
            case 'derived': derivedContentStore.updateNodeContent(id, content); break;
            case 'prompt': promptTemplateStore.updatePromptContent(id, content); break;
        }
    }

    function appendContentToItem(itemId: string, content: string, auto: boolean) {
        const { source } = findItemById(itemId);
        switch (source) {
            case 'directory': directoryStore.appendChapterContent(itemId, content, auto); break;
            case 'related': relatedContentStore.appendNodeContent(itemId, content, auto); break;
            case 'notes': notesStore.appendNoteContent(itemId, content, auto); break;
            case 'derived': derivedContentStore.appendNodeContent(itemId, content, auto); break;
        }
    }

    return { findItemById, updateItemContentById, appendContentToItem, getIconByNodeType };
});