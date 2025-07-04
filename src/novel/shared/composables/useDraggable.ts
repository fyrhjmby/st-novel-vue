import { ref, onUnmounted } from 'vue';

interface DraggableOptions {
    initialPosition?: { x: number; y: number };
    padding?: number;
}

export function useDraggable(options: DraggableOptions = {}) {
    const { initialPosition = { x: 0, y: 0 }, padding = 0 } = options;

    const position = ref({ x: initialPosition.x, y: initialPosition.y });
    const dragging = ref(false);

    let initialMouseX = 0;
    let initialMouseY = 0;
    let startPositionX = 0;
    let startPositionY = 0;
    const dragThreshold = 5;

    const onDrag = (e: MouseEvent) => {
        e.preventDefault();

        const dx = e.clientX - initialMouseX;
        const dy = e.clientY - initialMouseY;

        if (!dragging.value && (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold)) {
            dragging.value = true;
        }

        if (dragging.value) {
            let newX = startPositionX + dx;
            let newY = startPositionY + dy;

            const minClampX = padding;
            const minClampY = padding;
            const maxClampX = window.innerWidth - padding;
            const maxClampY = window.innerHeight - padding;

            position.value.x = Math.max(minClampX, Math.min(newX, maxClampX));
            position.value.y = Math.max(minClampY, Math.min(newY, maxClampY));
        }
    };

    const endDrag = () => {
        window.removeEventListener('mousemove', onDrag);
        window.removeEventListener('mouseup', endDrag);
    };

    const startDrag = (e: MouseEvent) => {
        e.preventDefault();
        dragging.value = false;

        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        startPositionX = position.value.x;
        startPositionY = position.value.y;

        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', endDrag);
    };

    onUnmounted(() => {
        window.removeEventListener('mousemove', onDrag);
        window.removeEventListener('mouseup', endDrag);
    });

    return {
        position,
        dragging,
        startDrag,
    };
}