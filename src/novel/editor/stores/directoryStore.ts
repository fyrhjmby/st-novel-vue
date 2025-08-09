// src/novel/editor/stores/directoryStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Volume, Chapter } from '@/novel/editor/types';
import { useEditorStore } from './editorStore';
import { useUIStore } from './uiStore';
import { useDerivedContentStore } from './derivedContentStore';
import * as directoryService from '@/novel/editor/services/directoryService';

export const useDirectoryStore = defineStore('directory', () => {
    const directoryData = ref<Volume[]>([]);

    const fetchDirectoryData = (data: Volume[]) => {
        directoryData.value = data;
    };

    const findNodeById = (nodeId: string) => {
        return directoryService.findNodeById(directoryData.value, nodeId);
    };

    const updateChapterContent = (nodeId: string, content: string) => {
        const result = findNodeById(nodeId);
        if (result && (result.node.type === 'chapter' || result.node.type === 'volume')) {
            directoryService.updateNodeContent(result.node, content);
        }
    };

    const appendChapterContent = (nodeId: string, contentToAppend: string, isAutoApplied: boolean) => {
        const result = findNodeById(nodeId);
        if (result && result.node.type === 'chapter') {
            directoryService.appendChapterContent(result.node, contentToAppend, isAutoApplied);
        }
    };

    const addNewVolume = () => {
        const uiStore = useUIStore();
        const editorStore = useEditorStore();
        const newVolume = directoryService.createVolume();
        directoryData.value.push(newVolume);

        editorStore.setEditingNodeId(newVolume.id);
        uiStore.ensureNodeIsExpanded(newVolume.id);
    };

    const addChapterToVolume = (volumeId: string) => {
        const volume = directoryData.value.find(v => v.id === volumeId);
        if (volume) {
            const editorStore = useEditorStore();
            const uiStore = useUIStore();
            const newChapter = directoryService.createChapter();
            volume.chapters.push(newChapter);

            uiStore.ensureNodeIsExpanded(volume.id);
            editorStore.openTab(newChapter.id);
            editorStore.setEditingNodeId(newChapter.id);
        }
    };

    const renameNode = (nodeId: string, newTitle: string) => {
        const result = findNodeById(nodeId);
        if (result?.node) {
            directoryService.renameNode(result.node, newTitle);
        }
    };

    const deleteNode = (nodeId: string) => {
        const result = findNodeById(nodeId);
        if (!result) return;

        // Coordination logic: Must happen before data is deleted
        const editorStore = useEditorStore();
        const derivedContentStore = useDerivedContentStore();

        if (result.node.type === 'chapter') {
            derivedContentStore.deleteDerivedDataForSource(result.node.id);
        } else if (result.node.type === 'volume') {
            result.node.chapters.forEach(chapter => {
                derivedContentStore.deleteDerivedDataForSource(chapter.id);
            });
            derivedContentStore.deleteDerivedDataForSource(result.node.id);
        }

        // Data manipulation logic
        const wasDeleted = directoryService.deleteNode(directoryData.value, nodeId);

        // UI update logic
        if (wasDeleted) {
            editorStore.closeTab(nodeId);
            if (editorStore.editingNodeId === nodeId) editorStore.setEditingNodeId(null);
        }
    };

    return {
        directoryData,
        fetchDirectoryData,
        findNodeById,
        updateChapterContent,
        appendChapterContent,
        addNewVolume,
        addChapterToVolume,
        renameNode,
        deleteNode,
    };
});