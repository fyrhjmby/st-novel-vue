import type { CommandService } from '@core/services/CommandService';
import { useDirectoryStore } from '../stores/directoryStore';
import { useEditorStore } from '../stores/editorStore';
import { useUIStore } from '../stores/uiStore';
import { useNotesStore } from '../stores/notesStore';
import { useRelatedContentStore } from '../stores/relatedContentStore';
import { useContextMenuStore } from '../stores/contextPreviewModalStore'; // UPDATED: Corrected file path
import { useAITaskStore } from '../stores/aiTaskStore';
import { tabManagementService } from '@core/tabs/service/TabManagementService';
import type { Chapter, NoteItem, RelatedTree, Volume } from '../types';

export function registerNovelCommands(commandService: CommandService) {
    const editorStore = useEditorStore();
    const directoryStore = useDirectoryStore();
    const notesStore = useNotesStore();
    const relatedContentStore = useRelatedContentStore();
    const uiStore = useUIStore();
    const contextPreviewStore = useContextMenuStore();
    const aiTaskStore = useAITaskStore();

    // --- 目录操作 ---
    commandService.register({
        id: 'novel.volume.create',
        label: '新建卷',
        execute: () => {
            const newVolume = directoryStore.addNewVolume();
            uiStore.setEditingNodeId(newVolume.id);
            uiStore.toggleNodeExpansion(newVolume.id);
        },
    });
    commandService.register({
        id: 'novel.chapter.create',
        label: '新建章节',
        execute: (context) => {
            const newChapter = directoryStore.addChapterToVolume(context.volumeId);
            if (newChapter) {
                tabManagementService.openTab(newChapter.id);
                uiStore.setEditingNodeId(newChapter.id);
                uiStore.toggleNodeExpansion(context.volumeId);
            }
        },
    });

    // --- 笔记操作 ---
    commandService.register({
        id: 'novel.note.create',
        label: '新建笔记',
        execute: () => {
            const newNote = notesStore.addNote('新建笔记');
            tabManagementService.openTab(newNote.id);
            uiStore.setEditingNodeId(newNote.id);
        },
    });

    // --- 设定与相关内容操作 ---
    commandService.register({
        id: 'novel.related.create-group',
        label: '新建分组',
        execute: (context) => {
            const newNode = relatedContentStore.addRelatedNode(context.nodeId, 'group');
            if (newNode) uiStore.setEditingNodeId(newNode.id);
            uiStore.toggleRelatedNodeExpansion(context.nodeId);
        },
    });
    commandService.register({
        id: 'novel.related.create-item',
        label: '新建条目',
        execute: (context) => {
            const newNode = relatedContentStore.addRelatedNode(context.nodeId, 'item');
            if (newNode) {
                tabManagementService.openTab(newNode.id);
                uiStore.setEditingNodeId(newNode.id);
            }
            uiStore.toggleRelatedNodeExpansion(context.nodeId);
        },
    });
    commandService.register({
        id: 'novel.related.create-custom',
        label: '新建自定义条目',
        execute: (context) => {
            const newNode = relatedContentStore.addCustomRelatedNode(context.nodeId as 'plot' | 'analysis');
            tabManagementService.openTab(newNode.id);
            uiStore.setEditingNodeId(newNode.id);
            uiStore.toggleRelatedNodeExpansion(context.nodeId);
        },
    });

    // --- 通用节点操作 ---
    commandService.register({
        id: 'novel.node.rename',
        label: '重命名',
        execute: (context) => uiStore.setEditingNodeId(context.nodeId),
    });
    commandService.register({
        id: 'novel.node.delete',
        label: '删除',
        execute: (context) => {
            const { nodeId, type } = context;
            if (type === 'volume' || type === 'chapter') {
                directoryStore.deleteNode(nodeId);
            } else if (type === 'note') {
                notesStore.deleteNote(nodeId);
            } else if (nodeId.startsWith('custom-')) {
                relatedContentStore.deleteCustomRelatedNode(nodeId);
            } else {
                relatedContentStore.deleteRelatedNode(nodeId);
            }
            tabManagementService.closeTab(nodeId);
        },
    });

    // --- AI 任务 ---
    const executeAITask = (context: { taskType: '润色' | '续写' | '分析', node: Chapter | RelatedTree | NoteItem, isBatch?: boolean }) => {
        const { taskType, node, isBatch } = context;
        if (isBatch && node.type === 'volume') {
            aiTaskStore.startBatchTaskForVolume(taskType, node as Volume);
            editorStore.ensureAIPanelIsOpen();
            return;
        }

        tabManagementService.openTab(node.id);

        if (uiStore.uiState.needsPreview) {
            contextPreviewStore.show({ type: taskType, targetItemId: node.id, title: node.title });
        } else {
            aiTaskStore.startNewTask(taskType, node.id);
            editorStore.ensureAIPanelIsOpen();
        }
    };

    commandService.register({ id: 'novel.ai.polish', label: '润色内容', execute: (context) => executeAITask({ ...context, taskType: '润色' }) });
    commandService.register({ id: 'novel.ai.continue', label: '续写内容', execute: (context) => executeAITask({ ...context, taskType: '续写' }) });
    commandService.register({ id: 'novel.ai.analyze', label: '分析内容', execute: (context) => executeAITask({ ...context, taskType: '分析' }) });


    // --- UI 交互命令 ---
    commandService.register({
        id: 'novel.sidebar.toggle',
        label: '切换侧边栏',
        execute: () => editorStore.toggleSidebar(),
    });

    commandService.register({
        id: 'novel.sidebar.show-panel',
        label: '显示侧边栏面板',
        execute: (context) => editorStore.setActiveSidebarPanel(context.panelId),
    });

    commandService.register({
        id: 'novel.system-view.open',
        label: '打开系统视图',
        execute: (context) => tabManagementService.openTab(context.viewId),
    });

    commandService.register({
        id: 'novel.history-view.open',
        label: '打开历史记录',
        execute: () => editorStore.openHistoryPanelForActiveTab(),
    });

    commandService.register({
        id: 'novel.reader-view.open',
        label: '打开阅读模式',
        execute: () => editorStore.openReaderViewForActiveTab(),
    });
}