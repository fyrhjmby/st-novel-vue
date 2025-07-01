
import { ref, onMounted, onBeforeUnmount } from 'vue';

interface Position {
    x: number;
    y: number;
}

interface DraggableOptions {
    initialPosition?: Position;
    padding?: number;
}

/**
 * 拖拽逻辑的 Vue Composable
 * @param options - 拖拽选项，如初始位置和边界填充
 * @returns 包含位置、拖拽状态和事件处理函数的对象
 */
export function useDraggable(options: DraggableOptions = {}) {
    const {
        initialPosition = { x: window.innerWidth - 100, y: window.innerHeight - 100 },
        padding = 16
    } = options;

    const position = ref<Position>({ ...initialPosition });
    const dragging = ref(false);
    const offset = ref({ x: 0, y: 0 });
    // [重构] 用于存储 setTimeout 的 ID，以便可以清除它
    const dragTimeout = ref<number | undefined>(undefined);

    // 鼠标按下，开始拖动
    const startDrag = (event: MouseEvent) => {
        // 只响应鼠标左键
        if (event.button !== 0) return;
        dragTimeout.value = window.setTimeout(() => {
            dragging.value = true;
        }, 150);

        offset.value.x = event.clientX - position.value.x;
        offset.value.y = event.clientY - position.value.y;

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    };

    const onDrag = (event: MouseEvent) => {
        if (!dragging.value) return;
        event.preventDefault();

        const buttonWidth = 64; // 假设按钮宽度为 64px
        const buttonHeight = 64; // 假设按钮高度为 64px

        // 计算新位置
        let newX = event.clientX - offset.value.x;
        let newY = event.clientY - offset.value.y;

        // 边界检测
        newX = Math.max(padding, Math.min(newX, window.innerWidth - buttonWidth - padding));
        newY = Math.max(padding, Math.min(newY, window.innerHeight - buttonHeight - padding));

        position.value.x = newX;
        position.value.y = newY;
    };

    // 鼠标松开，停止拖动
    const stopDrag = () => {
        window.clearTimeout(dragTimeout.value);

        if (dragging.value) {
            setTimeout(() => {
                dragging.value = false;
            }, 0);
        }

        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
    };

    const updatePositionOnResize = () => {
        const buttonWidth = 64;
        const buttonHeight = 64; // 在此定义，以保持一致
        if (position.value.x > window.innerWidth - buttonWidth - padding) {
            position.value.x = window.innerWidth - buttonWidth - padding;
        }
        if (position.value.y > window.innerHeight - buttonHeight - padding) {
            position.value.y = window.innerHeight - buttonHeight - padding;
        }
    };

    onMounted(() => {
        window.addEventListener('resize', updatePositionOnResize);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('resize', updatePositionOnResize);
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
    });

    return {
        position,
        dragging,
        startDrag,
    };
}