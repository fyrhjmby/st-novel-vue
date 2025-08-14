import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Connection, Edge, Elements, FlowEvents, FlowExportObject, Node, VueFlowInstance } from '@vue-flow/core';
import { useVueFlow } from '@vue-flow/core';
import { workflowEditorService } from '@/workflow/services/workflowEditorService';

let id = 0;
const getNextId = () => `dnd-node-${id++}`;

export const useWorkflowEditorStore = defineStore('workflowEditor', () => {
    const elements = ref<Elements>([]);
    const selectedNode = ref<Node | null>(null);
    const isLoading = ref(false);
    const isSaving = ref(false);

    const {
        onConnect,
        addEdges,
        addNodes,
        project,
        instance,
        onPaneReady,
        onNodesChange,
        onEdgesChange,
        removeNodes,
        findNode,
    } = useVueFlow();

    onConnect((params: Connection | Edge) => {
        params.markerEnd = { type: 'arrowclosed', color: '#D1D5DB' };
        params.style = { stroke: '#D1D5DB', strokeWidth: 2 };
        addEdges([params]);
    });

    onPaneReady((flowInstance: VueFlowInstance) => {
        instance.value = flowInstance;
        loadWorkflow();
    });

    const onNodeClick = (event: FlowEvents['nodeClick']) => {
        selectedNode.value = event.node;
    };

    const clearSelection = () => {
        selectedNode.value = null;
        if(instance.value) {
            instance.value.getNodes.forEach(node => node.selected = false);
        }
    }

    const onDragOver = (event: DragEvent) => {
        event.preventDefault();
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
        }
    };

    const onDrop = (event: DragEvent) => {
        if (!instance.value) return;

        const nodeDataString = event.dataTransfer?.getData('application/vueflow');
        if (!nodeDataString) return;

        const { name, ...data } = JSON.parse(nodeDataString);

        const position = project({ x: event.clientX, y: event.clientY });

        const newNode: Node = {
            id: getNextId(),
            type: 'custom',
            position,
            label: name,
            data: {
                title: name,
                description: data.description,
                icon: data.icon,
                iconBg: data.bgClass,
                // Default config for new nodes
                config: {
                    model: 'GPT-4-Turbo (推荐)',
                    temperature: 0.7,
                    max_tokens: 1000,
                    prompt: `你是一个社交媒体专家，请根据以下主题为推特平台生成一篇帖子:\n{{topic}}`,
                }
            }
        };
        addNodes([newNode]);
    };

    const removeSelectedNodes = () => {
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
        if (!instance.value) return;
        isSaving.value = true;
        try {
            const flowData = instance.value.toObject();
            await workflowEditorService.save(flowData);
        } catch(e) {
            console.error('Save failed:', e);
        } finally {
            isSaving.value = false;
        }
    };

    const loadWorkflow = async () => {
        isLoading.value = true;
        try {
            const flowData = await workflowEditorService.load();
            if (flowData && instance.value) {
                elements.value = flowData.elements;
                instance.value.setViewport(flowData.viewport);
            } else {
                elements.value = [
                    { id: '1', type: 'custom', label: '开始', position: { x: 80, y: 80 }, data: { title: '开始', description: '工作流的入口点，定义了启动流程所需的输入参数。', icon: `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"/></svg>`, iconBg: 'bg-green-100 text-green-600' } },
                    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#D1D5DB', strokeWidth: 2 }, markerEnd: { type: 'arrowclosed', color: '#D1D5DB' } },
                ];
            }
        } catch(e) {
            console.error('Load failed:', e);
        } finally {
            isLoading.value = false;
            setTimeout(() => instance.value?.fitView(), 100);
        }
    }

    return {
        elements,
        selectedNode,
        isSaving,
        isLoading,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onDragOver,
        onDrop,
        onNodeClick,
        clearSelection,
        removeSelectedNodes,
        updateNodeData,
        saveWorkflow,
        loadWorkflow,
        setInstance: onPaneReady,
    };
});