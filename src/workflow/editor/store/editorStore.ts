import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Node, FlowEvents, Elements } from '@vue-flow/core';
import { editorService } from '@/workflow/editor/services/editorService';
import { useVueFlowHandler } from '../composables/useVueFlowHandler.ts';

export const useEditorStore = defineStore('workflowEditor', () => {
    const elements = ref<Elements>([]);
    const selectedNode = ref<Node | null>(null);
    const isLoading = ref(false);
    const isSaving = ref(false);
    const currentWorkflowId = ref<string | null>(null);

    const { instance, onPaneReady, onDragOver, onDrop, removeNodes, findNode } = useVueFlowHandler(elements);

    const onNodeClick = (event: FlowEvents['nodeClick']) => {
        selectedNode.value = event.node;
    };

    const clearSelection = () => {
        selectedNode.value = null;
        elements.value = elements.value.map(el => ({ ...el, selected: false }));
    };

    const removeSelectedNode = () => {
        if (selectedNode.value) {
            removeNodes([selectedNode.value], true);
            clearSelection();
        }
    };

    const updateNodeData = (nodeId: string, newData: any) => {
        const node = findNode(nodeId);
        if (node) {
            node.data = { ...node.data, ...newData };
        }
        if (selectedNode.value && selectedNode.value.id === nodeId) {
            selectedNode.value.data = { ...selectedNode.value.data, ...newData };
        }
    };

    const saveWorkflow = async () => {
        if (!instance.value || !currentWorkflowId.value) return;
        isSaving.value = true;
        try {
            const flowData = instance.value.toObject();
            await editorService.save(currentWorkflowId.value, flowData);
        } catch(e) {
            console.error('Save failed:', e);
        } finally {
            isSaving.value = false;
        }
    };

    const loadWorkflow = async (id: string) => {
        currentWorkflowId.value = id;
        isLoading.value = true;
        try {
            const initialNode = { id: '1', type: 'custom', label: '开始', position: { x: 80, y: 80 }, data: { title: '开始', description: '工作流的入口点。', iconName: 'play-circle', iconColor: 'green' } };
            if (id === 'new') {
                elements.value = [initialNode];
            } else {
                const flowData = await editorService.load(id);
                if (flowData && flowData.nodes?.length) {
                    elements.value = [...(flowData.nodes || []), ...(flowData.edges || [])];
                    if (instance.value && flowData.viewport) {
                        instance.value.setViewport(flowData.viewport);
                    }
                } else {
                    elements.value = [initialNode];
                }
            }
        } finally {
            isLoading.value = false;
            setTimeout(() => instance.value?.fitView(), 100);
        }
    };

    return {
        elements,
        selectedNode,
        isSaving,
        isLoading,
        currentWorkflowId,
        onDragOver,
        onDrop,
        onNodeClick,
        clearSelection,
        removeSelectedNode,
        updateNodeData,
        saveWorkflow,
        loadWorkflow,
        setInstance: onPaneReady,
    };
});