// 文件: src/core/stores/commandPaletteStore.ts

import { ref, computed, nextTick } from 'vue';
import { defineStore } from 'pinia';
import { commandService } from '@/core/services/CommandService';
import type { Command } from '@/core/types';

interface PaletteCommand {
    id: string;
    label: string;
    icon?: string;
}

export const useCommandPaletteStore = defineStore('core-command-palette', () => {
    const isVisible = ref(false);
    const searchQuery = ref('');
    const allCommands = ref<PaletteCommand[]>([]);
    const selectedIndex = ref(0);
    const searchInputRef = ref<HTMLInputElement | null>(null);

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
        // Filter commands every time the palette is shown to get the latest context.
        const availableCommands: PaletteCommand[] = [];
        for (const command of commandService.getAllCommands()) {
            if (commandService.canExecute(command.id)) {
                availableCommands.push({
                    id: command.id,
                    label: typeof command.label === 'function' ? command.label({}) : command.label,
                    icon: command.icon
                });
            }
        }
        allCommands.value = availableCommands;

        isVisible.value = true;
        nextTick(() => {
            searchInputRef.value?.focus();
        });
    }

    function hide() {
        isVisible.value = false;
        searchQuery.value = '';
        selectedIndex.value = 0;
    }

    function setInputRef(el: HTMLInputElement | null) {
        searchInputRef.value = el;
    }

    function navigate(direction: 1 | -1) {
        const newIndex = selectedIndex.value + direction;
        if (newIndex >= 0 && newIndex < filteredCommands.value.length) {
            selectedIndex.value = newIndex;
        }
    }

    function executeSelected() {
        const command = filteredCommands.value[selectedIndex.value];
        if (command) {
            executeCommand(command.id);
        }
    }

    function executeCommand(commandId: string) {
        commandService.execute(commandId);
        hide();
    }

    function handleEscape() {
        if (isVisible.value) {
            hide();
        }
    }

    return {
        isVisible, searchQuery, selectedIndex, filteredCommands,
        show, hide, setInputRef, navigate,
        executeSelected, executeCommand, handleEscape,
    };
});