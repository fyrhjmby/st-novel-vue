import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface PaletteCommand {
    id: string;
    label: string;
    icon?: string;
}

export const useCommandPaletteStore = defineStore('core-command-palette', () => {
    const isVisible = ref(false);
    const searchQuery = ref('');
    const allCommands = ref<PaletteCommand[]>([]);
    const selectedIndex = ref(0);

    const filteredCommands = computed(() => {
        if (!searchQuery.value) {
            return allCommands.value;
        }
        const query = searchQuery.value.toLowerCase();
        return allCommands.value.filter(cmd =>
            cmd.label.toLowerCase().includes(query)
        );
    });

    function show() {
        isVisible.value = true;
    }

    function hide() {
        isVisible.value = false;
        searchQuery.value = '';
        allCommands.value = [];
    }

    function _setCommands(commands: PaletteCommand[]) {
        allCommands.value = commands;
        setSelectedIndex(0);
        searchQuery.value = '';
    }

    function setSelectedIndex(index: number) {
        if (index >= 0 && index < filteredCommands.value.length) {
            selectedIndex.value = index;
        }
    }

    function navigate(direction: 1 | -1) {
        const newIndex = selectedIndex.value + direction;
        setSelectedIndex(newIndex);
    }

    return {
        isVisible,
        searchQuery,
        selectedIndex,
        filteredCommands,
        allCommands,
        show,
        hide,
        _setCommands,
        navigate,
        setSelectedIndex,
    };
});