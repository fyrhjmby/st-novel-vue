import { ref } from 'vue';
import type { Connection, Edge, FlowEvents, Node, VueFlowStore, Elements } from '@vue-flow/core';
import { useVueFlow, MarkerType } from '@vue-flow/core';

let id = 0;
const getNextId = () => `dnd-node-${id++}`;

export function useVueFlowHandler(elements: Ref<Elements>) {
    const instance = ref<VueFlowStore | null>(null);

    const { onConnect, addEdges, addNodes, project, removeNodes, findNode } = useVueFlow();

    onConnect((params: Connection) => {
        const newEdge: Edge = {
            ...params,
            markerEnd: { type: MarkerType.ArrowClosed, color: '#D1D5DB' },
            style: { stroke: '#D1D5DB', strokeWidth: 2 },
        };
        addEdges([newEdge]);
    });

    const onPaneReady = (flowInstance: VueFlowStore) => {
        instance.value = flowInstance;
    };

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
                iconName: data.iconName,
                iconColor: data.iconColor,
                config: {},
            }
        };
        addNodes([newNode]);
    };

    return {
        instance,
        onPaneReady,
        onDragOver,
        onDrop,
        removeNodes,
        findNode,
    };
}