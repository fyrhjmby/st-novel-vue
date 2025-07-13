// 文件: src/core/composables/useResizable.ts
// 描述: 一个可复用的 Vue Composable，用于处理元素拖拽调整大小的逻辑。

import { onUnmounted } from 'vue';

interface ResizableOptions {
    onResize: (delta: { dx: number; dy: number }) => void;
    onResizeEnd?: () => void;
    cursor?: 'col-resize' | 'row-resize';
}

export function useResizable(options: ResizableOptions) {
    const { onResize, onResizeEnd, cursor = 'col-resize' } = options;
    let startX = 0;
    let startY = 0;

    const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        onResize({ dx, dy });
    };

    const handleMouseUp = () => {
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        onResizeEnd?.();
    };

    const startResize = (event: MouseEvent) => {
        event.preventDefault();
        startX = event.clientX;
        startY = event.clientY;

        document.body.style.cursor = cursor;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    onUnmounted(() => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    });

    return {
        startResize,
    };
}