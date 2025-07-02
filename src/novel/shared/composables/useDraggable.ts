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
    // [修复] 用于存储 setTimeout 的 ID，以便可以清除它，从而区分点击和拖动
    const dragTimeout = ref<number | undefined>(undefined);

    // 鼠标按下，准备开始拖动
    const startDrag = (event: MouseEvent) => {
        // 只响应鼠标左键
        if (event.button !== 0) return;

        // [修复] 设置一个延迟来区分点击和拖拽
        // 如果用户按住超过150ms，我们才认为他想拖动
        dragTimeout.value = window.setTimeout(() => {
            dragging.value = true;
        }, 150);

        offset.value.x = event.clientX - position.value.x;
        offset.value.y = event.clientY - position.value.y;

        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
    };

    const onDrag = (event: MouseEvent) => {
        // 只有在 dragging 状态为 true 时才移动
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
        // [修复] 无论如何都清除定时器。如果 mouseup 发生在150ms内，拖拽就不会开始。
        window.clearTimeout(dragTimeout.value);

        // 使用 setTimeout 确保 dragging 状态在 click 事件处理后改变
        // 这给 click 事件一个机会去检查 dragging 状态 (此时还是 false)
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
        const buttonHeight = 64;
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