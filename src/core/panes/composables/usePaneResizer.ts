import { type Ref } from 'vue';
import { useResizable } from '@core/common/composables/useResizable.ts';
import { paneManagementService } from '@core/panes/service/PaneManagementService.ts';
import { configService } from '@core/common/services/ConfigService.ts';
import type { SplitPaneNode, PaneNode } from '@core/types.ts';

export function usePaneResizer(nodeRef: Ref<PaneNode | undefined>) {

    let initialSizes: number[] = [];
    let totalSize = 0;
    let activeIndex = 0;
    let container: HTMLElement | null = null;
    let firstElement: HTMLElement | null = null;
    let secondElement: HTMLElement | null = null;

    const { startResize: start } = useResizable({
        cursor: (nodeRef.value as SplitPaneNode)?.direction === 'horizontal' ? 'col-resize' : 'row-resize',
        onResize: ({ dx, dy }) => {
            const node = nodeRef.value;
            if (!node || node.type !== 'split') return;

            const delta = node.direction === 'horizontal' ? dx : dy;
            const deltaPercent = (delta / totalSize) * 100;

            const newSizes = [...initialSizes];
            newSizes[activeIndex] += deltaPercent;
            newSizes[activeIndex + 1] -= deltaPercent;

            const minSize = configService.get('pane.resizer.minSize', 10);
            if (newSizes[activeIndex] < minSize || newSizes[activeIndex + 1] < minSize) {
                return;
            }

            paneManagementService.updatePaneNodeSize(node.id, newSizes);
        }
    });

    const startResize = (event: MouseEvent, index: number) => {
        const node = nodeRef.value;
        if (!node || node.type !== 'split') return;

        container = (event.currentTarget as HTMLElement).parentElement;
        if (!container) return;

        firstElement = container.children[index * 2] as HTMLElement;
        secondElement = container.children[index * 2 + 2] as HTMLElement;
        if (!firstElement || !secondElement) return;

        activeIndex = index;
        initialSizes = [...node.sizes];
        totalSize = node.direction === 'horizontal'
            ? firstElement.offsetWidth + secondElement.offsetWidth
            : firstElement.offsetHeight + secondElement.offsetHeight;

        start(event);
    };

    return {
        startResize,
    };
}